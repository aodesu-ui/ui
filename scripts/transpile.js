const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findProjectRoot(startPath = __dirname) {
  let current = startPath;
  while (current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return startPath;
}

function createTempTsConfig(filePath, projectRoot) {
  // Buscar tsconfig existente o crear uno optimizado
  const existingTsConfigPath = path.join(projectRoot, 'tsconfig.json');
  let baseConfig = {};

  if (fs.existsSync(existingTsConfigPath)) {
    try {
      baseConfig = JSON.parse(fs.readFileSync(existingTsConfigPath, 'utf8'));
      console.log('📁 Usando configuración de tsconfig.json existente');
    } catch (e) {
      console.log('⚠️  No se pudo leer tsconfig.json existente, usando configuración por defecto');
    }
  }

  // Configuración optimizada para transpilación
  const tempTsConfig = {
    ...baseConfig,
    compilerOptions: {
      // Mantener opciones existentes o usar defaults
      ...(baseConfig.compilerOptions || {}),
      // Overrides para transpilación
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'node',
      jsx: 'react-jsx',
      outDir: './dist-transpile',
      strict: false,
      noEmit: false,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,
      // Configuración de paths para alias comunes
      paths: {
        "@/*": ["./src/*"],
        "@/lib/*": ["./lib/*", "./src/lib/*", "./app/lib/*"],
        "@/components/*": ["./components/*", "./src/components/*"],
        ...(baseConfig.compilerOptions?.paths || {})
      },
      // Excluir opciones problemáticas
      resolveJsonModule: undefined
    },
    include: [
      filePath,
      '**/*.ts',
      '**/*.tsx',
      'node_modules/@radix-ui/**/*',
      'node_modules/class-variance-authority/**/*'
    ],
    exclude: [
      ...(baseConfig.exclude || []),
      'node_modules',
      'dist',
      'build'
    ].filter(Boolean)
  };

  const tsConfigPath = path.join(projectRoot, 'tsconfig.transpile.json');
  fs.writeFileSync(tsConfigPath, JSON.stringify(tempTsConfig, null, 2));
  return tsConfigPath;
}

function installMissingDependencies(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log('⚠️  No se encontró package.json');
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const missingDeps = [];
    const requiredDeps = ['@radix-ui/react-slot', 'class-variance-authority', 'react', 'react-dom'];

    for (const dep of requiredDeps) {
      if (!dependencies[dep]) {
        missingDeps.push(dep);
      }
    }

    if (missingDeps.length > 0) {
      console.log(`📦 Instalando dependencias faltantes: ${missingDeps.join(', ')}`);
      execSync(`npm install ${missingDeps.join(' ')} --save-dev`, {
        stdio: 'inherit',
        cwd: projectRoot
      });
    }
  } catch (error) {
    console.log('⚠️  No se pudieron verificar las dependencias:', error.message);
  }
}

function transpileTypeScript(filePath) {
  const projectRoot = findProjectRoot(path.dirname(filePath));
  console.log(`📂 Directorio del proyecto: ${projectRoot}`);

  // Instalar dependencias faltantes
  installMissingDependencies(projectRoot);

  try {
    // Crear tsconfig temporal
    const tsConfigPath = createTempTsConfig(filePath, projectRoot);
    const outDir = './dist-transpile';

    // Crear directorio de salida
    if (!fs.existsSync(path.join(projectRoot, outDir))) {
      fs.mkdirSync(path.join(projectRoot, outDir), { recursive: true });
    }

    console.log(`🔨 Transpilando ${filePath}...`);

    // Ejecutar tsc desde el directorio del proyecto
    execSync(`npx tsc --project ${tsConfigPath}`, {
      stdio: 'inherit',
      cwd: projectRoot
    });

    // Leer resultado
    const fileName = path.basename(filePath, '.tsx');
    const outputPath = path.join(projectRoot, outDir, `${fileName}.js`);

    if (fs.existsSync(outputPath)) {
      const content = fs.readFileSync(outputPath, 'utf8');

      // Limpiar archivo temporal
      fs.unlinkSync(tsConfigPath);

      console.log(`✅ Transpilación completada: ${outputPath}`);
      console.log('\n📄 Resultado:');
      console.log('='.repeat(50));
      console.log(content);

      return content;
    } else {
      console.log('⚠️  Archivo de salida no generado');
    }

  } catch (error) {
    console.error('❌ Error durante la transpilación:', error.message);
    // No relanzar el error para permitir que continúe con ESBuild
  }
}

function transpileWithESBuild(filePath) {
  const projectRoot = findProjectRoot(path.dirname(filePath));

  try {
    console.log(`🔨 Transpilando con ESBuild...`);

    const fileName = path.basename(filePath, '.tsx');
    const outDir = './dist-transpile';
    const outputPath = path.join(projectRoot, outDir, `${fileName}.js`);

    // Crear directorio de salida
    if (!fs.existsSync(path.join(projectRoot, outDir))) {
      fs.mkdirSync(path.join(projectRoot, outDir), { recursive: true });
    }

    // Comando ESBuild con opciones para resolver problemas comunes
    const esbuildCommand = [
      'npx esbuild',
      `"${filePath}"`,
      `--outfile="${outputPath}"`,
      '--loader=tsx',
      '--format=esm',
      '--target=es2020',
      '--jsx=automatic',
      '--bundle', // Esto incluye las dependencias
      '--external:react',
      '--external:react-dom',
      '--platform=node'
    ].join(' ');

    execSync(esbuildCommand, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true
    });

    if (fs.existsSync(outputPath)) {
      const content = fs.readFileSync(outputPath, 'utf8');
      console.log(`✅ Transpilación ESBuild completada: ${outputPath}`);
      console.log('\n📄 Resultado:');
      console.log('='.repeat(50));
      console.log(content);
      return content;
    }

  } catch (error) {
    console.error('❌ Error con ESBuild:', error.message);

    // Último intento: transpilación simple sin dependencias
    return transpileSimple(filePath);
  }
}

function transpileSimple(filePath) {
  console.log('🔨 Intentando transpilación simple...');

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Transformaciones básicas (muy simplificadas)
    let simpleOutput = content
      .replace(/import.*from\s+["']@\/lib\/utils["'];?/g, '// import removed: @/lib/utils')
      .replace(/import.*from\s+["']@radix-ui\/react-slot["'];?/g, '// import removed: @radix-ui/react-slot')
      .replace(/import.*from\s+["']class-variance-authority["'];?/g, '// import removed: class-variance-authority')
      .replace(/import\s+{([^}]+)}\s+from\s+["']react["'];?/g, 'import { $1 } from "react";')
      .replace(/type\s+[^=]+=\s+[^;]+;?/g, '// $&') // Comentar tipos
      .replace(/:([^:]+):\s*[^{;]+(?={|;)/g, '// $&') // Comentar anotaciones de tipo
      .replace(/<[^>]+\?>/g, '') // Remover tipos genéricos en JSX
      .replace(/as\s+[^,);]+/g, ''); // Remover assertions de tipo

    const outDir = './dist-transpile';
    const fileName = path.basename(filePath, '.tsx');
    const outputPath = path.join(findProjectRoot(path.dirname(filePath)), outDir, `${fileName}.js`);

    fs.writeFileSync(outputPath, simpleOutput, 'utf8');

    console.log(`✅ Transpilación simple completada: ${outputPath}`);
    console.log('\n📄 Resultado (simplificado):');
    console.log('='.repeat(50));
    console.log(simpleOutput);

    return simpleOutput;
  } catch (error) {
    console.error('❌ Error en transpilación simple:', error.message);
    throw error;
  }
}

// Función principal
function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log('📝 Uso: node transpile.js <ruta-al-archivo-typescript>');
    console.log('📝 Ejemplo: node transpile.js ./components/Button.tsx');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ El archivo ${filePath} no existe`);
    process.exit(1);
  }

  console.log(`🎯 Transpilando: ${filePath}`);

  // Intentar con TypeScript primero
  let result = transpileTypeScript(filePath);

  // Si falla, intentar con ESBuild
  if (!result) {
    console.log('🔄 Cambiando a ESBuild...');
    result = transpileWithESBuild(filePath);
  }

  if (result) {
    console.log('🎉 ¡Transpilación completada con éxito!');
  } else {
    console.error('💥 No se pudo transpilar el archivo');
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  transpileTypeScript,
  transpileWithESBuild,
  transpileSimple
};

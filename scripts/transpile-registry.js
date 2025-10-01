const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      // Excluir archivos de definición (.d.ts)
      if (!file.endsWith('.d.ts')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function createRegistryTsConfig(files, projectRoot) {
  // Buscar tsconfig existente para heredar configuración
  const existingTsConfigPath = path.join(projectRoot, 'tsconfig.json');
  let baseConfig = {};

  if (fs.existsSync(existingTsConfigPath)) {
    try {
      baseConfig = JSON.parse(fs.readFileSync(existingTsConfigPath, 'utf8'));
      console.log('📁 Usando configuración base de tsconfig.json');
    } catch (e) {
      console.log('⚠️  No se pudo leer tsconfig.json, usando configuración por defecto');
    }
  }

  const tempTsConfig = {
    ...baseConfig,
    compilerOptions: {
      // Opciones base
      ...(baseConfig.compilerOptions || {}),
      // Overrides específicos para transpilación
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'node',
      jsx: 'preserve', // Cambiado a 'preserve' para mantener JSX
      outDir: undefined, // No usar outDir, queremos archivos junto a los originales
      strict: false,
      noEmit: false,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,
      // Configuración de paths para alias comunes
      paths: {
        "@/*": ["./src/*", "./*"],
        "@/lib/*": ["./lib/*", "./src/lib/*", "./app/lib/*", "./registry/*"],
        "@/components/*": ["./components/*", "./src/components/*", "./registry/*"],
        "@/registry/*": ["./registry/*"],
        ...(baseConfig.compilerOptions?.paths || {})
      },
      // Excluir opciones problemáticas
      resolveJsonModule: undefined,
      declaration: false,
      declarationMap: false,
      sourceMap: false,
      removeComments: true
    },
    include: [
      ...files,
      'node_modules/@radix-ui/**/*',
      'node_modules/class-variance-authority/**/*',
      'node_modules/react/**/*',
      'node_modules/react-dom/**/*'
    ],
    exclude: [
      ...(baseConfig.exclude || []),
      'node_modules',
      'dist',
      'build',
      '**/*.d.ts'
    ].filter(Boolean)
  };

  const tsConfigPath = path.join(projectRoot, 'tsconfig.registry.json');
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

function transpileRegistry() {
  const projectRoot = process.cwd();
  const registryPath = path.join(projectRoot, 'registry');

  if (!fs.existsSync(registryPath)) {
    console.error('❌ No se encontró el directorio registry');
    process.exit(1);
  }

  console.log('📁 Buscando archivos TypeScript en registry...');
  const tsFiles = findTypeScriptFiles(registryPath);

  if (tsFiles.length === 0) {
    console.log('ℹ️  No se encontraron archivos TypeScript para transpilar');
    return;
  }

  console.log(`📄 Encontrados ${tsFiles.length} archivos:`);
  tsFiles.forEach(file => console.log(`   - ${path.relative(projectRoot, file)}`));

  // Instalar dependencias faltantes
  installMissingDependencies(projectRoot);

  try {
    // Crear tsconfig temporal
    const tsConfigPath = createRegistryTsConfig(tsFiles, projectRoot);

    console.log('🔨 Transpilando archivos...');

    // Compilar sin outDir para que los archivos se guarden junto a los originales
    // Usamos jsx: preserve y luego renombramos
    execSync(`npx tsc --project ${tsConfigPath} --noEmit false --outDir .`, {
      stdio: 'inherit',
      cwd: projectRoot
    });

    // Renombrar archivos .js a .jsx para archivos que originalmente eran .tsx
    renameJsToJsx(tsFiles);

    // Limpiar archivo temporal
    fs.unlinkSync(tsConfigPath);

    // Verificar archivos generados
    console.log('\n✅ Transpilación completada!');
    console.log('📝 Archivos JSX generados:');

    const jsxFiles = findJSXFiles(registryPath);
    jsxFiles.forEach(file => {
      const relativePath = path.relative(projectRoot, file);
      console.log(`   ✅ ${relativePath}`);
    });

  } catch (error) {
    console.error('❌ Error durante la transpilación:', error.message);
    console.log('🔄 Intentando con ESBuild...');
    transpileRegistryWithESBuild(tsFiles);
  }
}

function renameJsToJsx(tsFiles) {
  let renamedCount = 0;
  tsFiles.forEach(tsFile => {
    if (tsFile.endsWith('.tsx')) {
      const jsFile = tsFile.replace(/\.tsx$/, '.js');
      const jsxFile = tsFile.replace(/\.tsx$/, '.jsx');

      if (fs.existsSync(jsFile)) {
        fs.renameSync(jsFile, jsxFile);
        renamedCount++;
      }
    }
  });
  console.log(`🔄 Renombrados ${renamedCount} archivos .js a .jsx`);
}

function findJSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findJSXFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function transpileRegistryWithESBuild(files) {
  const projectRoot = process.cwd();

  console.log('🔨 Transpilando con ESBuild...');

  files.forEach(filePath => {
    try {
      // Determinar extensión de salida basada en la extensión de entrada
      const outputExtension = filePath.endsWith('.tsx') ? '.jsx' : '.js';
      const outputPath = filePath.replace(/\.tsx?$/, outputExtension);
      const relativePath = path.relative(projectRoot, filePath);

      console.log(`   📄 Transpilando: ${relativePath}`);

      const esbuildCommand = [
        'npx esbuild',
        `"${filePath}"`,
        `--outfile="${outputPath}"`,
        filePath.endsWith('.tsx') ? '--loader=tsx' : '--loader=ts',
        '--format=esm',
        '--target=es2020',
        '--jsx=automatic',
        '--bundle',
        '--external:react',
        '--external:react-dom',
        '--platform=node'
      ].join(' ');

      execSync(esbuildCommand, {
        stdio: 'pipe',
        cwd: projectRoot,
        shell: true
      });

      console.log(`   ✅ Generado: ${path.relative(projectRoot, outputPath)}`);
    } catch (error) {
      console.error(`   ❌ Error con ${filePath}:`, error.message);
    }
  });

  console.log('🎉 Transpilación con ESBuild completada!');
}

function backupOriginalFiles() {
  const registryPath = path.join(process.cwd(), 'registry');
  const backupPath = path.join(process.cwd(), 'registry-backup');

  if (fs.existsSync(backupPath)) {
    console.log('⚠️  Ya existe una copia de seguridad, saltando...');
    return;
  }

  console.log('📦 Creando copia de seguridad del registry...');

  // Usar método cross-platform para copiar directorios
  if (process.platform === 'win32') {
    execSync(`xcopy "${registryPath}" "${backupPath}" /E /I /H`, {
      stdio: 'inherit',
      shell: true
    });
  } else {
    execSync(`cp -r "${registryPath}" "${backupPath}"`, {
      stdio: 'inherit',
      shell: true
    });
  }

  console.log('✅ Copia de seguridad creada en registry-backup/');
}

// Función principal
function main() {
  console.log('🎯 Iniciando transpilación del directorio registry...');
  console.log('📝 Generando archivos .jsx para componentes React...');

  // Crear copia de seguridad
  backupOriginalFiles();

  // Transpilar
  transpileRegistry();

  console.log('\n🎉 ¡Proceso completado!');
  console.log('📁 Los archivos .jsx se han generado junto a sus originales TypeScript.');
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  transpileRegistry,
  findTypeScriptFiles
};

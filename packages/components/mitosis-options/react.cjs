// mitosis-options/react.cjs
/** @type {import('@builder.io/mitosis').Target} */
module.exports = {
  typescript: true,
  stateType: 'useState',
  stylesType: 'style-attribute',
  format: 'esm',
  // Asegurar que se preserven los tipos TypeScript
  preserveImports: true,
  preserveFileExtensions: true,
  // Configuraciones específicas para React
  hookNames: {
    useState: 'useState',
    useEffect: 'useEffect',
    useContext: 'useContext',
    useRef: 'useRef',
    useMemo: 'useMemo',
    useCallback: 'useCallback',
  },
  // Plugins adicionales si es necesario
  plugins: [],
};

// mitosis-config.cjs
const react = require('./mitosis-options/react.cjs');

/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
	files: 'src/**',
	dest: 'dist',
	targets: ['react'],
	options: {
		react
	}
};

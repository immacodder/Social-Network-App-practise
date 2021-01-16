const colors = require('tailwindcss/colors')
module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#BB86FC',
				secondary: '#CF6679',
				danger: '#DE483E'
			},
			fontFamily: {
				sans: ['Open Sans', 'sans-serif']
			}
			// fill: {
			// 	primary: '#BB86FC',
			// 	black: 'rgba(0,0,0,.9)',
			// 	white: '#eeeeee'
			// }
		}
	},
	variants: {
		extend: {
			opacity: ['disabled']
		}
	},
	plugins: []
}

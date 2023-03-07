/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {},
		screens: {
			'xs': '350px',

			'sm': '640px',

			'md': '768px',

			'lg': '1024px',

			'xl': '1280px',

			'2xl': '1536px',
		},
	},
	plugins: [],
}

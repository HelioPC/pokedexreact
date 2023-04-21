import { DefaultTheme } from 'styled-components'

export const light: DefaultTheme['theme'] = {
	name: 'light',

	colors: {
		primary: '#000000',
		mainBg: '#F2F3FA',
		button: '#121212',
		textButton: '#FFFFFF',
		barBackground: '#FFFFFF',
		cardBackground: '#FFFFFF',
		cardSecundary: '#F5F5F5',
		textPrimary: '#000000',
	}
}

export const dark: DefaultTheme['theme'] = {
	name: 'dark',

	colors: {
		primary: '#FFFFFF',
		mainBg: '#181818',
		button: '#252423',
		textButton: '#FFFFFF',
		barBackground: '#252423',
		cardBackground: '#252423',
		cardSecundary: '#3D3D3D',
		textPrimary: '#FFFFFF',
	}
}

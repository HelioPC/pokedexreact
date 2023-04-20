import { DefaultTheme } from 'styled-components'

export const light: DefaultTheme['theme'] = {
	name: 'light',

	colors: {
		primary: '#2564CF',
		mainBg: '#F2F3FA',
		sideBarBg: '#FFFFFF',
		sideBarLabelBg: '#EFF6FC',
		textPrimary: '#000000',
		textSecundary: '#605E5C',
		active: '#78BAFD',
	}
}

export const dark: DefaultTheme['theme'] = {
	name: 'dark',

	colors: {
		primary: '#2564CF',
		mainBg: '#11100F',
		sideBarBg: '#252423',
		sideBarLabelBg: '#3B3A39',
		textPrimary: '#FFFFFF',
		textSecundary: '#A19F9D',
		active: '#78BAFD',
	}
}

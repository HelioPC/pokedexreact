import React, { ReactNode, useContext, useState } from 'react'
import { ThemeContext, ThemeProvider } from 'styled-components'
import { dark, light } from '../../shared/theme'

const THEME_STORAGE_KEY = 'pokemonAppTheme'

type AppThemeProps = {
	children: ReactNode
}

const readStoredTheme = () => {
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY)
		if (!stored) return light

		const parsed = JSON.parse(stored) as { name?: string }
		return parsed.name === 'dark' ? dark : light
	} catch {
		return light
	}
}

export const AppThemeProvider = ({ children }: AppThemeProps) => {
	const [theme, setTheme] = useState(readStoredTheme)

	const switchTheme = () => {
		const next = theme.name === 'light' ? dark : light
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next))
		setTheme(next)
	}

	const value = { theme, switchTheme }

	return (
		<ThemeProvider theme={value}>
			{children}
		</ThemeProvider>
	)
}

export const useAppTheme = () => {
	const context = useContext(ThemeContext)

	if (!context) {
		throw new Error('useAppTheme must be used within AppThemeProvider')
	}

	return context
}

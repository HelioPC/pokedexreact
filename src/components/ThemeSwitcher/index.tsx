import React, { useEffect, useState } from 'react'
import Switch from 'react-switch'
import { useAppTheme } from '../../contexts/ThemeContext'

const ThemeSwitcher = () => {
	const { switchTheme, theme } = useAppTheme()
	const [checked, setChecked] = useState(theme.name === 'light')

	useEffect(() => {
		setChecked(theme.name === 'light')
	}, [theme])

	return (
		<Switch
			height={20}
			width={40}
			onChange={() => switchTheme()}
			checked={checked}
			checkedIcon={false}
			uncheckedIcon={false}
		/>
	)
}

export default ThemeSwitcher
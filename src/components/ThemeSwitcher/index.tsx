import React, { useEffect, useState } from 'react'
import { MdDarkMode, MdLightbulb } from 'react-icons/md'
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
			checkedIcon={
				<div className='w-full h-full flex items-center justify-center'>
					<MdLightbulb color='white' />
				</div>
			}
			uncheckedIcon={
				<div className='w-full h-full flex items-center justify-center'>
					<MdDarkMode />
				</div>
			}
		/>
	)
}

export default ThemeSwitcher
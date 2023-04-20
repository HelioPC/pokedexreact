import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Detail from './pages/Detail'
import Home from './pages/Home'
import Page404 from './pages/Page404'
import { PokeProvider } from './contexts/PokeContext'
import { AppThemeProvider } from './contexts/ThemeContext'

const App = () => {
	return (
		<AppThemeProvider>
			<PokeProvider>
				<HashRouter>
					{/*TODO: Refactor code and styles */}
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/pokemon/:id' element={<Detail />} />
						<Route path='/*' element={<Page404 />} />
					</Routes>
				</HashRouter>
			</PokeProvider>
		</AppThemeProvider>
	)
}

export default App
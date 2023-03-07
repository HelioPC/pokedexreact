import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Detail from './pages/Detail'
import Home from './pages/Home'
import Page404 from './pages/Page404'

const App = () => {
	return (
		<BrowserRouter basename='/pokedexreact'>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/pokemon/:id' element={<Detail />} />
				<Route path='/*' element={<Page404 />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
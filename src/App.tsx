import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Detail from './pages/Detail'
import Home from './pages/Home'

const App = () => {
	return (
		<BrowserRouter basename='/pokedexreact'>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/pokemon/:id' element={<Detail />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
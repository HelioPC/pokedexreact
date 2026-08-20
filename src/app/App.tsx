import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../features/home'
import { PokeProvider } from './providers/PokeContext'
import { AppThemeProvider } from './providers/ThemeContext'
import LoadingIndicator from '../shared/ui/LoadingIndicator'

const DetailPage = lazy(() => import('../features/pokemon-detail'))
const NotFoundPage = lazy(() => import('../features/not-found/NotFoundPage'))

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

const RouteFallback = () => (
	<div className='w-full min-h-screen flex justify-center items-center'>
		<LoadingIndicator promiseInProgress />
	</div>
)

const App = () => {
	return (
		<AppThemeProvider>
			<PokeProvider>
				<BrowserRouter basename={basename}>
					<Suspense fallback={<RouteFallback />}>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/pokemon/:id' element={<DetailPage />} />
							<Route path='*' element={<NotFoundPage />} />
						</Routes>
					</Suspense>
				</BrowserRouter>
			</PokeProvider>
		</AppThemeProvider>
	)
}

export default App

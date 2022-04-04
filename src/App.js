import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import Pokemon from './components/Pokemon';

function App() {
	return (
		<Router>
			<div className="app">
				<NavBar />
				<div className='container'>
					<Routes>
						<Route path='/' element={<Dashboard />} />
						<Route path='/pokemon/:pokemonIndex' element={<Pokemon />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;

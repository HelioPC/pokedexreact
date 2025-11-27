import React, { useEffect, useState } from 'react'
import { usePromiseTracker } from 'react-promise-tracker'

import { api } from '../../api'
import { Pokemon, PokemonName } from '../../types/core'
import * as H from './style'
import PokemonCard from '../../components/PokemonCard'
import LoadingIndicator from '../../components/LoadingIndicator'
import { usePokeContext } from '../../contexts/PokeContext'
import { useAppTheme } from '../../contexts/ThemeContext'
import ThemeSwitcher from '../../components/ThemeSwitcher'
import { MdOutlineSearch } from 'react-icons/md'

const POKEMONS_PER_PAGE = 16

const Home = () => {
	const { promiseInProgress } = usePromiseTracker()
	const { state, dispatch } = usePokeContext()
	const { theme, switchTheme } = useAppTheme()
	const [backendpokemons, setBackendPokemons] = useState<Pokemon[]>([])
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const [maxLength, setMaxLength] = useState(8)
	const [allPokemonNames, setAllPokemonNames] = useState<PokemonName[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>([])
	const [loading, setLoading] = useState(false)

	// Fetch all pokemons names
	useEffect(() => {
		const fetchAllNames = async () => {
			const allNames = await api.getPokemons(916)
			setAllPokemonNames(allNames.data.results)
		}

		fetchAllNames()
	}, [])

	// Load pokemons details
	const loadMorePokemons = async () => {
		setLoading(true)
		const nextBatch = allPokemonNames.slice(currentIndex, currentIndex + POKEMONS_PER_PAGE)

		const detailedData = await Promise.all(
			nextBatch.map(async (pokemon) => {
				const res = await fetch(pokemon.url)
				return await res.json()
			})
		)

		setDisplayedPokemons((prev) => [...prev, ...detailedData])
		setCurrentIndex((prev) => prev + POKEMONS_PER_PAGE)
		setLoading(false)
	}

	// Load first 16 pokemons details
	useEffect(() => {
		if (allPokemonNames.length > 0 && displayedPokemons.length === 0) {
			loadMorePokemons()
		}
	}, [allPokemonNames])

	return (
		<H.HomeScreen theme={{ theme: theme, switchTheme: switchTheme }}>
			<div className='absolute top-2 right-10'>
				<ThemeSwitcher />
			</div>

			<H.HomeInputArea>
				<div>
					<MdOutlineSearch
						size={24}
						className='mr-2 ml-5'
					/>
					<input
						type='text'
						placeholder='Find by name or id'
						autoFocus
					/>
				</div>
			</H.HomeInputArea>

			{displayedPokemons.length !== 0 ? (
				<H.HomeMain>
					<H.HomeGrid length={maxLength}>
						{displayedPokemons.map((p, i) => (
							<PokemonCard key={`${p.name}-${i}`} name={p.name} pokeData={p} />
						))}
					</H.HomeGrid>
				</H.HomeMain>
			) : (
				<div className='w-full flex flex-col gap-5 justify-center items-center mt-5'>
					{promiseInProgress ? null : <div>No pokemons</div>}
					<LoadingIndicator promiseInProgress={promiseInProgress} />
				</div>
			)}

			<div className='w-full flex justify-center items-center my-3'>
				<LoadingIndicator promiseInProgress={loading} />
			</div>

			{currentIndex < allPokemonNames.length && (
				<div className='flex justify-center mt-8'>
					<H.HomeButton
						name='load-more'
						disabled={loading}
						className='sm:text-sm text-xs text-center shadow-xl m-3'
						onClick={loadMorePokemons}
					>
						{loading ? 'Carregando...' : 'Carregar mais'}
					</H.HomeButton>
				</div>
			)}
		</H.HomeScreen>
	)
}

export default Home
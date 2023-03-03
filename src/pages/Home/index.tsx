import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'

import { api } from '../../api'
import { Pokemon } from '../../types/core'
import * as H from './style'
import PokemonCard from '../../components/PokemonCard'

const LoadingIndicator = () => {
	const { promiseInProgress } = usePromiseTracker()

	return (
		promiseInProgress ?
			(
				<ThreeDots
					height='80'
					width='80'
					radius='9'
					color='#282936'
					ariaLabel='three-dots-loading'
					wrapperStyle={{}}
					visible={true}
				/>
			) : (
				<div className='hidden' />
			)
	)
}

const Home = () => {
	const [backendpokemons, setBackendPokemons] = useState<Pokemon[]>([])
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const [inputSearch, setInputSearch] = useState('')

	// Fetch all pokemons
	useEffect(() => {
		const fetchResults = async () => {
			const data = await api.getPokemons()

			if(data.status == 200) {
				data.data.results.map((p: Pokemon) => {
					setPokemons((pokemons => [...pokemons, p]))
					setBackendPokemons((pokemons => [...pokemons, p]))
				})
			}

			else console.log('No pokemons available')
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchResults().then(() => {})
		)
	}, [])

	useEffect(() => {
		if(inputSearch.length !== 0)
			setPokemons(backendpokemons.filter((p) => p.name.toLowerCase().includes(inputSearch.toLowerCase())))
		else
			setPokemons(backendpokemons)
	}, [inputSearch])

	return (
		<H.HomeScreen>
			<H.HomeInputArea className='shadow-lg'>
				<div>
					<MdOutlineSearch size={24} color='#000' />
					<input
						type='text'
						value={inputSearch}
						onChange={(e) => setInputSearch(e.target.value)}
					/>
				</div>
			</H.HomeInputArea>
			{pokemons.length !== 0 ? (
				<H.HomeMain>
					<H.HomeGrid length={pokemons.length}>
						{
							pokemons.map((p, i) => (
								<PokemonCard key={`${p.name}-${i}`} name={p.name} />
							))
						}
					</H.HomeGrid>
				</H.HomeMain>
			) : (
				<>
					<div>No pokemons</div>
					<LoadingIndicator />
				</>
			)}
		</H.HomeScreen>
	)
}

export default Home
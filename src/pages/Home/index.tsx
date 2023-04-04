import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import { api } from '../../api'
import { Pokemon } from '../../types/core'
import * as H from './style'
import PokemonCard from '../../components/PokemonCard'
import LoadingIndicator from '../../components/LoadingIndicator'
import { formatNumber } from '../../helpers/numbers'

const LOCALSTORAGEFILTERKEY = 'pokeFilterKey'
const LOCALSTORAGESEARCHKEY = 'pokeSearchKey'

const Home = () => {
	const { promiseInProgress } = usePromiseTracker()
	const [backendpokemons, setBackendPokemons] = useState<Pokemon[]>([])
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const searchStorage = localStorage.getItem(LOCALSTORAGESEARCHKEY)
	const [inputSearch, setInputSearch] = useState(
		searchStorage ? searchStorage as string : ''
	)
	const [maxLength, setMaxLength] = useState(8)
	const filterOptions = [
		{ title: 'All', value: '', },
		{ title: 'A-Z', value: '0', },
		{ title: 'Z-A', value: '1', },
		{ title: 'Min. id', value: '2', },
		{ title: 'Max. id', value: '3', },
	]
	const filterStorage = localStorage.getItem(LOCALSTORAGEFILTERKEY)
	const [option, setOption] = useState(
		filterStorage ? JSON.parse(filterStorage) as string : ''
	)

	// Fetch all pokemons
	useEffect(() => {
		const fetchResults = async () => {
			try {
				const pokemonsNamesResponse = await api.getPokemons(1008)

				if (pokemonsNamesResponse.status == 200) {
					const pokemonsNames: string[] = []
					pokemonsNamesResponse.data.results.map((p: Pokemon) => {
						pokemonsNames.push(p.name)
					})

					const pokemonsData = await Promise.all(
						pokemonsNames.map(async (str) => {
							try {
								const pokemonDataResponse = await api.getPokemon(str)

								if (pokemonDataResponse.status == 200) {
									return pokemonDataResponse.data
								} else throw Error
							} catch (error) {
								console.log('erro')
							}
						})
					)

					console.log(pokemonsData)
					setBackendPokemons(pokemonsData)

					if(inputSearch.length !== 0) {
						setPokemons([...pokemonsData].filter(
							(p) => p.name.toLowerCase()
								.includes(inputSearch.toLowerCase())
						))
					} else {
						switch (option.toString()) {
						case filterOptions[1].value:
							setPokemons([...pokemonsData as Pokemon[]].sort((a, b) => a.name > b.name ? 1 : -1))
							break
	
						case filterOptions[2].value:
							setPokemons([...pokemonsData as Pokemon[]].sort((a, b) => a.name < b.name ? 1 : -1))
							break
						
						case filterOptions[3].value:
							setPokemons(pokemonsData as Pokemon[])
							break
						
						case filterOptions[4].value:
							setPokemons([...pokemonsData as Pokemon[]].reverse())
							break
	
						default:
							setPokemons(pokemonsData as Pokemon[])
							break
						}
					}
				}

				else console.log('No pokemons available')
			} catch (error) { /* empty */ }
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchResults().then(() => { })
		)
	}, [])

	useEffect(() => {
		const filterSearchInput = () => {
			if (backendpokemons.length == 0) return
			if (inputSearch.length !== 0) {
				if (option != filterOptions[0].value) {
					setOption(filterOptions[0].value)
					localStorage.setItem(LOCALSTORAGEFILTERKEY, filterOptions[0].value)
				}
				setPokemons(backendpokemons.filter(
					(p) => p.name.toLowerCase()
						.includes(inputSearch.toLowerCase()) ||
						formatNumber(backendpokemons.indexOf(p) + 1)
							.includes(inputSearch)
				))
			}
			else {
				setPokemons(backendpokemons)
			}
			localStorage.setItem(LOCALSTORAGESEARCHKEY, inputSearch)
		}
		filterSearchInput()
	}, [inputSearch])

	useEffect(() => {
		const filterSelectOption = () => {
			if (backendpokemons.length == 0) return
			if (inputSearch.length != 0) return
			switch (option.toString()) {
			case filterOptions[1].value:
				setInputSearch('')
				localStorage.setItem(LOCALSTORAGESEARCHKEY, '')
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...backendpokemons].sort((a, b) => a.name > b.name ? 1 : -1))
				break

			case filterOptions[2].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...backendpokemons].sort((a, b) => a.name < b.name ? 1 : -1))
				break

			case filterOptions[3].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons(backendpokemons)
				break

			case filterOptions[4].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...backendpokemons].reverse())
				break

			case filterOptions[0].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons(backendpokemons)
				break

			default:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons(backendpokemons)
				break
			}
		}
		filterSelectOption()
	}, [option])

	const sortPokemons = () => {
		const sorted = [...pokemons].sort(() => Math.random() - 0.5)
		setPokemons(sorted)
	}

	return (
		<H.HomeScreen>
			<H.HomeInputArea className='shadow-lg'>
				<div>
					<MdOutlineSearch
						size={24}
						color='#000'
						className='mr-2 ml-5'
					/>
					<input
						type='text'
						placeholder='Find by name or id'
						value={inputSearch}
						onChange={(e) => setInputSearch(e.target.value)}
						disabled={option.length != 0}
					/>
				</div>
			</H.HomeInputArea>

			<H.HomeFilterArea>
				<H.HomeButton
					name='filter'
					className='text-sm shadow-xl m-5'
					onClick={() => sortPokemons()}
				>
					Surprise me
				</H.HomeButton>
				<H.HomeButton
					className={`text-sm shadow-xl m-5 ${maxLength > 16 ? 'cursor-not-allowed' : ''}`}
					disabled={maxLength > 16}
					onClick={() => setMaxLength(maxLength + 4)}
				>
					Load more
				</H.HomeButton>
				<select
					name='filter'
					className='w-32 h-10 flex justify-center items-center bg-black text-white rounded-md py-2 px-4 focus:outline-none text-sm shadow-xl m-5 cursor-text'
					onChange={(e) => setOption(e.target.value)}
					disabled={inputSearch.length != 0}
					value={option}
				>
					{
						filterOptions.map((o, i) => (
							<option key={i} value={o.value}>{o.title}</option>
						))
					}
				</select>
			</H.HomeFilterArea>

			{pokemons.length !== 0 ? (
				<H.HomeMain>
					<H.HomeGrid length={maxLength}>
						{
							pokemons.slice(0, maxLength).map((p, i) => (
								<PokemonCard key={`${p.name}-${i}`} name={p.name} />
							))
						}
					</H.HomeGrid>
				</H.HomeMain>
			) : (
				<div className='w-full flex flex-col gap-5 justify-center items-center mt-5'>
					{promiseInProgress ?  null : <div>No pokemons</div>}
					<LoadingIndicator promiseInProgress={promiseInProgress} />
				</div>
			)}
		</H.HomeScreen>
	)
}

export default Home
import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import { api } from '../../api'
import { Pokemon } from '../../types/core'
import * as H from './style'
import PokemonCard from '../../components/PokemonCard'
import LoadingIndicator from '../../components/LoadingIndicator'
import { PokeContextActions, usePokeContext } from '../../contexts/PokeContext'
import { handlePokemonsFilterByQuery } from '../../utils/searchFilter'
import { useAppTheme } from '../../contexts/ThemeContext'
import ThemeSwitcher from '../../components/ThemeSwitcher'

const LOCALSTORAGEFILTERKEY = 'pokeFilterKey'
const LOCALSTORAGESEARCHKEY = 'pokeSearchKey'

const Home = () => {
	const { promiseInProgress } = usePromiseTracker()
	const { state, dispatch } = usePokeContext()
	const { theme, switchTheme } = useAppTheme()
	const [backendpokemons, setBackendPokemons] = useState<Pokemon[]>([])
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const searchStorage = localStorage.getItem(LOCALSTORAGESEARCHKEY)
	const [inputSearch, setInputSearch] = useState(
		searchStorage ? searchStorage as string : ''
	)
	const [maxLength, setMaxLength] = useState(8)
	const filterStorage = localStorage.getItem(LOCALSTORAGEFILTERKEY)
	const [option, setOption] = useState(
		filterStorage ? JSON.parse(filterStorage) as string : ''
	)
	const [type, setType] = useState('Type')
		
	const filterOptions = [
		{ title: 'All', value: '', },
		{ title: 'A-Z', value: '0', },
		{ title: 'Z-A', value: '1', },
		{ title: 'Min. id', value: '2', },
		{ title: 'Max. id', value: '3', },
	]
	// Normal, Fire, Water, Grass, Flying, Fighting, Poison, Electric, Ground, Rock, Psychic, Ice, Bug, Ghost, Steel, Dragon, Dark and Fairy
	const filterTypeOptions = [
		'Type',
		'Normal',
		'Fire',
		'Water',
		'Grass',
		'Flying',
		'Fighting',
		'Poison',
		'Electric',
		'Ground',
		'Rock',
		'Psychic',
		'Ice',
		'Bug',
		'Ghost',
		'Steel',
		'Dragon',
		'Dark',
		'Fairy',
	]
	// Fetch all pokemons
	useEffect(() => {
		const fetchResults = async () => {
			try {
				let pokemonsToUse: Pokemon[] = []
				if (state.pokemons.length > 0) {
					setBackendPokemons(state.pokemons)
					pokemonsToUse = state.pokemons
				} else {
					const pokemonsNamesResponse = await api.getPokemons(916)

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
									} else {
										console.log('erro')
										throw Error
									}
								} catch (error) {
									console.log('erro')
								}
							})
						)

						setBackendPokemons(pokemonsData)
						pokemonsToUse = pokemonsData

						dispatch({
							type: PokeContextActions.setPokemons,
							payload: pokemonsData
						})
					}
					else console.log('No pokemons available')
				}

				if(inputSearch.length !== 0) {
					setPokemons([...pokemonsToUse].filter(
						(p) => p.name.toLowerCase()
							.includes(inputSearch.toLowerCase())
					))
				} else {
					switch (option.toString()) {
					case filterOptions[1].value:
						setPokemons([...pokemonsToUse as Pokemon[]].sort((a, b) => a.name > b.name ? 1 : -1))
						break

					case filterOptions[2].value:
						setPokemons([...pokemonsToUse as Pokemon[]].sort((a, b) => a.name < b.name ? 1 : -1))
						break
					
					case filterOptions[3].value:
						setPokemons(pokemonsToUse as Pokemon[])
						break
					
					case filterOptions[4].value:
						setPokemons([...pokemonsToUse as Pokemon[]].reverse())
						break

					default:
						setPokemons(pokemonsToUse as Pokemon[])
						break
					}
				}

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
			if (type != filterTypeOptions[0]) return
			if (inputSearch.length !== 0) {
				if (option != filterOptions[0].value) {
					setOption(filterOptions[0].value)
					localStorage.setItem(LOCALSTORAGEFILTERKEY, filterOptions[0].value)
				}
				setPokemons(handlePokemonsFilterByQuery(inputSearch, backendpokemons))
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
			if (pokemons.length == 0) return
			if (inputSearch.length != 0) return
			switch (option.toString()) {
			case filterOptions[1].value:
				setInputSearch('')
				localStorage.setItem(LOCALSTORAGESEARCHKEY, '')
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...pokemons].sort((a, b) => a.name > b.name ? 1 : -1))
				break

			case filterOptions[2].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...pokemons].sort((a, b) => a.name < b.name ? 1 : -1))
				break

			case filterOptions[3].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...pokemons].sort((a, b) => a.id > b.id ? 1 : -1))
				break

			case filterOptions[4].value:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...pokemons].sort((a, b) => a.id < b.id ? 1 : -1))
				break

			case filterOptions[0].value:
				if (type == filterTypeOptions[0]) break
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...pokemons].sort((a, b) => a.id > b.id ? 1 : -1))
				break

			default:
				localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
				setPokemons([...pokemons].sort((a, b) => a.id > b.id ? 1 : -1))
				break
			}
		}
		filterSelectOption()
	}, [option])
	
	useEffect(() => {
		const filterSelectOption = () => {
			if (backendpokemons.length == 0) return
			if (inputSearch.length != 0) return
			if (type == filterTypeOptions[0]) {
				setOption(filterOptions[0].value)
				localStorage.setItem(LOCALSTORAGEFILTERKEY, filterOptions[0].value)
				setPokemons(backendpokemons)
				return
			}
			setPokemons(
				[...backendpokemons].filter(
					(p) => p.types
						.find((t) => t.type.name.toLowerCase() == type.toLowerCase()) != undefined
				)
			)
		}
		filterSelectOption()
	}, [type])

	const sortPokemons = () => {
		const sorted = [...pokemons].sort(() => Math.random() - 0.5)
		setPokemons(sorted)
	}

	return (
		<H.HomeScreen theme={{theme: theme, switchTheme: switchTheme}}>
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
						value={inputSearch}
						onChange={(e) => setInputSearch(e.target.value)}
						disabled={
							(option != filterOptions[0].value) ||
							(backendpokemons.length < 1) ||
							(type != filterTypeOptions[0])
						}
					/>
				</div>
			</H.HomeInputArea>

			<H.HomeFilterArea>
				<H.HomeButton
					name='filter'
					className='sm:text-sm text-xs text-center shadow-xl m-3'
					disabled={pokemons.length < 1}
					onClick={() => sortPokemons()}
				>
					Surprise me
				</H.HomeButton>
				<H.HomeButton
					className={`sm:text-sm text-xs text-center shadow-xl m-3 ${maxLength > 16 ? 'cursor-not-allowed' : ''}`}
					disabled={maxLength > 16 || pokemons.length < 1}
					onClick={() => setMaxLength(maxLength + 4)}
				>
					Load more
				</H.HomeButton>
				<H.HomeSelectOption
					name='filter'
					onChange={(e) => setOption(e.target.value)}
					disabled={
						(inputSearch.length != 0) ||
						(pokemons.length < 1)
					}
					value={option}
				>
					{
						filterOptions.map((o, i) => (
							<option key={i} value={o.value}>{o.title}</option>
						))
					}
				</H.HomeSelectOption>
				<H.HomeSelectOption
					name='type'
					onChange={(e) => setType(e.target.value)}
					disabled={
						(inputSearch.length != 0) ||
						(pokemons.length < 1)
					}
					value={type}
				>
					{
						filterTypeOptions.map((o, i) => (
							<option key={i} value={o}>{o}</option>
						))
					}
				</H.HomeSelectOption>
				{type != 'Type' ? <span>{pokemons.length}</span> : null}
			</H.HomeFilterArea>

			{pokemons.length !== 0 ? (
				<H.HomeMain>
					<H.HomeGrid length={maxLength}>
						{
							pokemons.slice(0, maxLength).map((p, i) => (
								<PokemonCard key={`${p.name}-${i}`} name={p.name} pokeData={p} />
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
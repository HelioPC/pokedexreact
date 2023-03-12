import React, { useEffect, useState } from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'

import { api } from '../../api'
import { Pokemon } from '../../types/core'
import * as H from './style'
import PokemonCard from '../../components/PokemonCard'

const LOCALSTORAGEFILTERKEY = 'pokeFilterKey'
const LOCALSTORAGESEARCHKEY = 'pokeSearchKey'

const Home = () => {
	const [backendpokemons, setBackendPokemons] = useState<Pokemon[]>([])
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const searchStorage = localStorage.getItem(LOCALSTORAGESEARCHKEY)
	const [inputSearch, setInputSearch] = useState(
		searchStorage ? searchStorage as string : ''
	)
	const [maxLength, setMaxLength] = useState(8)
	const filterOptions = [
		{
			title: 'All',
			value: ''
		},
		{
			title: 'A-Z',
			value: '0',
		},
		{
			title: 'Z-A',
			value: '1',
		},
	]
	const filterStorage = localStorage.getItem(LOCALSTORAGEFILTERKEY)
	const [option, setOption] = useState(
		filterStorage ? JSON.parse(filterStorage) as string : ''
	)

	// Fetch all pokemons
	useEffect(() => {
		const fetchResults = async () => {
			try {
				const data = await api.getPokemons(900)

				if (data.status == 200) {
					data.data.results.map((p: Pokemon) => {
						setBackendPokemons((pokemons => [...pokemons, p]))
					})

					if(inputSearch.length !== 0) {
						setPokemons([...data.data.results].filter(
							(p) => p.name.toLowerCase()
								.includes(inputSearch.toLowerCase())
						))
					} else {
						switch (option.toString()) {
						case filterOptions[1].value:
							setPokemons([...data.data.results as Pokemon[]].sort((a, b) => a.name > b.name ? 1 : -1))
							break
	
						case filterOptions[2].value:
							setPokemons([...data.data.results as Pokemon[]].sort((a, b) => a.name < b.name ? 1 : -1))
							break
	
						default:
							setPokemons(data.data.results as Pokemon[])
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
			if (inputSearch.length !== 0) {
				setPokemons(backendpokemons.filter(
					(p) => p.name.toLowerCase()
						.includes(inputSearch.toLowerCase())
				))
			}
			else if(option.length == 0) {
				setPokemons(backendpokemons)
			}
			localStorage.setItem(LOCALSTORAGESEARCHKEY, inputSearch)
		}
		filterSearchInput()
	}, [inputSearch])

	useEffect(() => {
		switch (option.toString()) {
		case filterOptions[1].value:
			setInputSearch('')
			localStorage.setItem(LOCALSTORAGESEARCHKEY, '')
			localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
			setPokemons([...backendpokemons].sort((a, b) => a.name > b.name ? 1 : -1))
			break

		case filterOptions[2].value:
			setInputSearch('')
			localStorage.setItem(LOCALSTORAGESEARCHKEY, '')
			localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
			setPokemons([...backendpokemons].sort((a, b) => a.name < b.name ? 1 : -1))
			break

		default:
			setInputSearch('')
			localStorage.setItem(LOCALSTORAGESEARCHKEY, '')
			localStorage.setItem(LOCALSTORAGEFILTERKEY, option)
			setPokemons(backendpokemons)
			break
		}
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
						placeholder='Find by name'
						value={inputSearch}
						onChange={(e) => setInputSearch(e.target.value)}
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
				<select
					name='filter'
					className='w-32 h-10 flex justify-center items-center bg-black text-white rounded-md py-2 px-4 focus:outline-none text-sm shadow-xl m-5 cursor-text'
					onChange={(e) => setOption(e.target.value)}
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

					<div
						className={`
							w-full xs:flex-row flex-col justify-center items-center my-5
							${maxLength == backendpokemons.length || pokemons.length !== backendpokemons.length ? 'hidden' : 'flex'}
						`}
					>
						<H.HomeButton
							className='text-sm shadow-xl m-5'
							onClick={() => setMaxLength(maxLength + 4)}
						>
							Load more
						</H.HomeButton>
						<H.HomeButton
							className='text-sm shadow-xl cursor-pointer m-5'
							onClick={() => setMaxLength(backendpokemons.length)}
						>
							Load all
						</H.HomeButton>
					</div>
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

export default Home
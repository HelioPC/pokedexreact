/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'

import { formatNumber } from '../../helpers/numbers'
import { Pokemon, Species } from '../../types/core'
import pokeApiImg from '../../assets/logo.png'
import * as D from './style'
import { api } from '../../api'

type CardComponentProps = {
	pokemon: Pokemon
}

const Detail = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!location.state?.fromApp) {
			navigate('/')
		}
	}, [])

	console.log(location.state)

	return (
		location.state.pokemon && (
			<D.DetailScreen>
				<DetailCardComponent pokemon={location.state.pokemon} />
			</D.DetailScreen>
		)
	)
}

const DetailCardComponent = ({ pokemon }: CardComponentProps) => {
	const [pokemonSpecies, setPokemonSpecies] = useState<Species>()
	const [descriptions, setDescriptions] = useState<string[]>([])
	const [currentDescription, setCurrentDescription] = useState('')

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const data = await api.getPokemonSpecies(pokemon.id.toString())

				if (data.status == 200) {
					setPokemonSpecies(data.data)
					const filteredDescriptions = data.data.flavor_text_entries.filter(
						(t: any, i: number, self: any) => t.language.name == 'en' && i < 11 && i === self.findIndex((value: any) => (
							t.flavor_text === value.flavor_text && t.language.name == 'en'
						))
					).map(
						(t: any, i: number) => {
							if (i == 0) setCurrentDescription(
								t.flavor_text.charAt(0).toUpperCase() + t.flavor_text.slice(1).toLowerCase()
							)
							return t.flavor_text.charAt(0).toUpperCase() + t.flavor_text.slice(1).toLowerCase()
						}
					)
					const result = filteredDescriptions.slice(0, filteredDescriptions.length - 1).reduce((acc: any, curr: any, i: any) => {
						if (i % 2 === 0) {
							acc.push(curr + ' ' + filteredDescriptions[i + 1])
						}
						return acc
					}, [])
					result.push(filteredDescriptions[filteredDescriptions.length - 1])
					setDescriptions(result)
					setCurrentDescription(result[0])
				}
			} catch (error) { /* empty */ }
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchResults().then(() => { })
		)
	}, [])

	return (
		<D.DetailCard className='shadow-xl'>
			<D.DetailCardHeader className='shadow'>
				<p className='text-sm font-bold'>
					Num: {formatNumber(pokemon.id)}
				</p>
			</D.DetailCardHeader>

			<D.DetailCardBody>
				<div className='grid md:grid-cols-[repeat(2,50%)] grid-cols-[repeat(1,100%)] md:grid-rows-[repeat(2,250px)] grid-rows-[repeat(4,250px)]'>
					<div className='w-full h-full flex justify-center items-center px-5 py-2'>
						<img
							src={pokemon.sprites.front_default}
							className='xs:w-[calc(100%-40%)] w-full h-[calc(100%-10px)] shadow-lg'
						/>
					</div>
					<div className='w-full h-full flex flex-col items-center px-10 py-8'>
						{
							pokemonSpecies ? (
								<p>
									{currentDescription}
								</p>
							) : (
								<LoadingIndicator />
							)
						}
						<div className='flex gap-4 mt-auto'>
							{
								descriptions.map((d, i) => (
									<div
										key={i}
										className='h-3 w-3 bg-black rounded-[50%] cursor-pointer'
										onClick={() => setCurrentDescription(descriptions[i])}
									/>
								))
							}
						</div>
					</div>
					<div className='w-full h-full'>
						{
							pokemonSpecies ? (
								<p>0</p>
							) : (
								<LoadingIndicator />
							)
						}
					</div>
					<div className='w-full h-full'>
						{
							pokemonSpecies ? (
								<p>0</p>
							) : (
								<LoadingIndicator />
							)
						}
					</div>
				</div>
				<div className='w-full min-h-[200px] bg-[#FF0]'>

				</div>
			</D.DetailCardBody>

			<D.DetailCardFooter>
				<img
					src={pokeApiImg}
					className='h-8 rounded-full'
					alt='api'
				/>
				<p className='text-xs'>
					Pokedex by <a href='https://github.com/HelioPC'>HelioPC</a>
				</p>
			</D.DetailCardFooter>
		</D.DetailCard>
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

export default Detail
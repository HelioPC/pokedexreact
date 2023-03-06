/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdMale, MdFemale } from 'react-icons/md'
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
				<Link to='/'>
					<img
						src={pokeApiImg}
						className='h-8 rounded-full'
						alt='api'
					/>
				</Link>
				<p className='text-sm '>
					Name: <label className='text-sm font-bold'>{pokemon.name}</label>
				</p>
				<p className='text-sm font-bold '>
					{formatNumber(pokemon.id)}
				</p>
			</D.DetailCardHeader>

			<D.DetailCardBody>
				<div className='grid md:grid-cols-[repeat(2,50%)] grid-cols-[repeat(1,100%)] md:grid-rows-[repeat(2,250px)] grid-rows-[repeat(4,auto)]'>
					<div className='w-full h-full flex justify-center items-center px-5 py-2 overflow-hidden'>
						<img
							src={pokemon.sprites.front_default}
							className='xs:w-[calc(100%-40%)] w-full h-[calc(100%-10px)] shadow-lg xs:hover:scale-105 xs:duration-300'
						/>
					</div>
					<div className='w-full h-full flex flex-col items-center xs:px-10 px-5'>
						{
							pokemonSpecies ? (
								<p className='text-sm md:text-start text-center font-bold md:my-auto my-8'>
									{currentDescription}
								</p>
							) : (
								<LoadingIndicator />
							)
						}
						<div className='flex gap-4 md:my-auto my-8'>
							{
								descriptions.map((d, i) => (
									<div
										key={i}
										className='sm:h-3 h-2 sm:w-3 w-2 bg-black rounded-[50%] cursor-pointer'
										onClick={() => setCurrentDescription(descriptions[i])}
									/>
								))
							}
						</div>
					</div>
					<div className='w-full h-full min-h-[250px] grid lg:grid-cols-4 lg:grid-rows-1 md:grid-cols-2 md:grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 xs:grid-cols-3 xs:grid-rows-2 grid-cols-1 grid-rows-4 gap-3 px-5 py-10'>
						{
							pokemonSpecies ? (
								<>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg rounded-lg py-5'>
										<p className='font-bold'>Height</p>
										<p className='text-sm'>{pokemon.height} dm</p>
									</div>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg rounded-lg py-5'>
										<p className='font-bold'>Weight</p>
										<p className='text-sm'>{pokemon.weight} hg</p>
									</div>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg rounded-lg py-5'>
										<p className='font-bold'>Abilities</p>
										<p className='text-sm p-1 bg-[#EDEDED] rounded-md text-center'>
											{pokemon.abilities[0].ability.name}
										</p>
									</div>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg rounded-lg py-5'>
										<p className='font-bold'>Gender</p>
										<div className='flex gap-5'>
											<div className='flex flex-col items-center'>
												<MdMale />
												<span className='text-sm'>{12.5 * (8 - pokemonSpecies.gender_rate)}%</span>
											</div>
											<div className='flex flex-col items-center'>
												<MdFemale />
												<span className='text-sm'>{12.5 * pokemonSpecies.gender_rate}%</span>
											</div>
										</div>
									</div>
								</>
							) : (
								<LoadingIndicator />
							)
						}
					</div>
					<div className='w-full h-full'>
						{
							pokemonSpecies ? (
								<p></p>
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
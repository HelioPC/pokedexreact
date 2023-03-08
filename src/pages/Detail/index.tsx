/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Tooltip as MuiTip } from '@mui/material'
import { MdMale, MdFemale } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

import { formatNumber } from '../../helpers/numbers'
import { Pokemon, Species } from '../../types/core'
import pokeApiImg from '../../assets/logo.png'
import * as D from './style'
import { api } from '../../api'

type CardComponentProps = {
	pokemon: Pokemon
}

ChartJS.register(ArcElement, Tooltip, Legend)

const Detail = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!location.state) {
			navigate('/')
			return
		} else {
			if (!location.state.fromApp) {
				navigate('/')
			}
			if (!location.state.pokemon) {
				navigate('/')
			}
		}
	}, [])

	return (
		location.state?.pokemon ? (
			<D.DetailScreen>
				<DetailCardComponent pokemon={location.state.pokemon} />
			</D.DetailScreen>
		) : (
			<div>Erro</div>
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

	const data = {
		labels: pokemon.stats.map((s) => s.stat.name),
		datasets: [
			{
				label: '# of Votes',
				data: pokemon.stats.map((s) => s.base_stat),
				backgroundColor: [
					'rgba(75, 192, 120, 0.2)',
					'rgba(255, 99, 132, .2)',
					'rgba(25, 88, 236, 0.2)',
					'rgba(199, 102, 255, 0.2)',
					'rgba(86, 255, 252, 0.2)',
					'rgba(255, 159, 64, .2)',
				],
				borderColor: [
					'rgba(75, 192, 120, 1)',
					'rgba(255, 99, 132, 1)',
					'rgba(25, 88, 236, 1)',
					'rgba(199, 102, 255, 1)',
					'rgba(86, 255, 252, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 2,
			},
		],
	}

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
				<div className='grid md:grid-cols-[repeat(2,50%)] grid-cols-[repeat(1,100%)] md:grid-rows-[repeat(2,290px)] grid-rows-[repeat(4,auto)]'>
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
									<MuiTip
										key={i}
										title={d.slice(0, 20) + '...'}
										placement='top'
									>
										<div
											className={`
											h-3 w-3 rounded-[50%] cursor-pointer
											${d == currentDescription ? 'bg-white border-2 border-solid border-black' : 'bg-black'}
										`}
											onClick={() => setCurrentDescription(descriptions[i])}
										/>
									</MuiTip>
								))
							}
						</div>
					</div>
					<div className='w-full h-full min-h-[250px] grid lg:grid-cols-4 lg:grid-rows-1 xs:grid-cols-[repeat(2,150px)] md:grid-rows-2 sm:grid-rows-1 xs:grid-rows-2 grid-cols-[repeat(1,150px)] grid-rows-4 gap-3 px-5 py-10 justify-center'>
						{
							pokemonSpecies ? (
								<>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5'>
										<p className='font-bold'>Height</p>
										<p className='text-sm'>{pokemon.height} dm</p>
									</div>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5'>
										<p className='font-bold'>Weight</p>
										<p className='text-sm'>{pokemon.weight} hg</p>
									</div>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5'>
										<p className='font-bold'>Abilities</p>
										<p className='text-sm p-1 bg-[#EDEDED] rounded-md text-center'>
											{pokemon.abilities[0].ability.name}
										</p>
									</div>
									<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5 px-3'>
										<p className='font-bold'>Gender</p>
										<div className='flex lg:flex-col flex-row gap-5'>
											<div className='flex lg:flex-row flex-col items-center'>
												<MdMale className='text-lg' color='blue' />
												<span className='text-sm'>{12.5 * (8 - pokemonSpecies.gender_rate)}%</span>
											</div>
											<div className='flex lg:flex-row flex-col items-center'>
												<MdFemale className='text-lg' color='pink' />
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
					<div className='w-full h-full flex justify-center p-5'>
						{
							pokemonSpecies ? (
								<Pie data={data} />
							) : (
								<LoadingIndicator />
							)
						}
					</div>
				</div>
				{/*
					<div className='w-full min-h-[200px] bg-[#000] rounded-t-lg shadow-lg'>

					</div>
				*/}
			</D.DetailCardBody>

			<D.DetailCardFooter>
				<img
					src={pokeApiImg}
					className='h-8 rounded-full'
					alt='api'
				/>
				<p className='text-xs'>
					Pokedex by
					<MuiTip
						title='A brilliant software developer'
						placement='top'
					>
						<a href='https://github.com/HelioPC' className='font-bold text-blue-600'> HelioPC</a>
					</MuiTip>
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
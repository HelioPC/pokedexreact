/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip as MuiTip } from '@mui/material'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Pokemon, Species } from '../../../types/core'
import { api } from '../../../api'
import EvolutionChain from '../../../components/EvolutionChain'
import { formatNumber } from '../../../helpers/numbers'
import PieChartColors from '../data'
import BasicInfo from './BasicInfo'
import * as D from '../style'
import pokeApiImg from '../../../assets/logo.png'
import Carousel from '../../../components/Carousel'

type CardComponentProps = {
	pokemon: Pokemon
}

ChartJS.register(ArcElement, Tooltip, Legend)

const DetailCardComponent = ({ pokemon }: CardComponentProps) => {
	const [pokemonSpecies, setPokemonSpecies] = useState<Species>()
	const [descriptions, setDescriptions] = useState<string[]>([])

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
						(t: any) => {
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
				label: 'Raw value',
				data: pokemon.stats.map((s) => s.base_stat),
				...PieChartColors,
				borderWidth: 2,
			},
		],
	}

	return (
		<D.DetailCard className='shadow-xl'>
			<D.DetailCardHeader className='shadow xs:justify-between justify-center'>
				<Link to='/'>
					<img
						src={pokeApiImg}
						className='h-8 rounded-full'
						alt='api'
					/>
				</Link>
				<p className='text-sm xs:block hidden'>
					Name: <label className='text-sm font-bold'>{pokemon.name}</label>
				</p>
				<p className='text-sm font-bold xs:block hidden'>
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
					{
						pokemonSpecies ? (
							<Carousel data={descriptions} />
						) : (
							<LoadingIndicator />
						)
					}
					<div className='w-full h-full min-h-[250px] grid lg:grid-cols-4 lg:grid-rows-1 xs:grid-cols-[repeat(2,150px)] md:grid-rows-2 sm:grid-rows-1 xs:grid-rows-2 grid-cols-[repeat(1,150px)] grid-rows-4 gap-3 px-5 py-10 justify-center'>
						{
							pokemonSpecies ? (
								<BasicInfo
									height={pokemon.height}
									weight={pokemon.weight}
									abilities={pokemon.abilities}
									gender_rate={pokemonSpecies.gender_rate}
								/>
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
				{pokemonSpecies && <EvolutionChain url={pokemonSpecies.evolution_chain.url} />}
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
		promiseInProgress ? (
			<ThreeDots
				height='80'
				width='80'
				radius='9'
				color='#282936'
				ariaLabel='three-dots-loading'
				wrapperStyle={{}}
				visible={true}
			/>
		) : null
	)
}

export default DetailCardComponent
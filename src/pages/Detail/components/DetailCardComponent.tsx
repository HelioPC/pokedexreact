/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

import { Pokemon, Species } from '../../../types/core'
import { api, BASE_IMAGE_URL } from '../../../api'
import EvolutionChain from '../../../components/EvolutionChain'
import PieChartColors from '../data'
import BasicInfo from './BasicInfo'
import * as D from '../style'
import pokeApiImg from '../../../assets/logo.png'
import Carousel from '../../../components/Carousel'
import CardHeader from './CardHeader'
import CardFooter from './CardFooter'
import CardAbilities from './CardAbilities'

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
			<CardHeader
				name={pokemon.name}
				imageUrl={pokeApiImg}
				id={pokemon.id}
			/>

			<D.DetailCardBody>
				{
					pokemonSpecies ? (
						<div className='grid md:grid-cols-[repeat(2,50%)] grid-cols-[repeat(1,100%)] md:grid-rows-[repeat(2,290px)] grid-rows-[repeat(4,auto)] my-0'>
							<div className='w-full h-full flex justify-center items-center px-5 py-2 overflow-hidden'>
								<img
									src={`${BASE_IMAGE_URL}${pokemon.id}.png`}
									className='h-[calc(100%-10px)] shadow-lg xs:hover:scale-105 xs:duration-300'
								/>
							</div>
							<Carousel data={descriptions} />
							<div className='w-full h-full min-h-[250px] grid xs:grid-cols-2 xs:grid-rows-2 grid-cols-[repeat(1,150px)] grid-rows-4 gap-5 p-5'>
								<BasicInfo
									height={pokemon.height}
									weight={pokemon.weight}
									gender_rate={pokemonSpecies.gender_rate}
								/>
							</div>
							<div className='w-full h-full flex justify-center sm:p-5 p-1'>
								<Pie data={data} />
							</div>
						</div>
					) : (
						<LoadingIndicator />
					)
				}
				<CardAbilities pokemon={pokemon} />
				{pokemonSpecies && <EvolutionChain url={pokemonSpecies.evolution_chain.url} />}
			</D.DetailCardBody>

			<CardFooter imageUrl={pokeApiImg} />
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
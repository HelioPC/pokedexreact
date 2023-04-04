/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
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
import AnimatedCard from '../../../components/AnimatedCard'
import LoadingIndicator from '../../../components/LoadingIndicator'

type CardComponentProps = {
	pokemon: Pokemon
}

ChartJS.register(ArcElement, Tooltip, Legend)

const DetailCardComponent = ({ pokemon }: CardComponentProps) => {
	const { promiseInProgress } = usePromiseTracker()
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
					if (filteredDescriptions.length < 1) return
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
						<div className='grid md:grid-cols-[repeat(2,50%)] grid-cols-[repeat(1,100%)] md:grid-rows-[repeat(2,290px)] grid-rows-[repeat(4,300px)] my-0'>
							<div className='w-full h-full flex justify-center items-center p-5 overflow-hidden'>
								<img
									src={`${BASE_IMAGE_URL}${pokemon.id}.png`}
									className='h-full shadow-lg'
								/>
							</div>

							{
								descriptions.length > 0 ? (
									<Carousel id='dcc'>
										{
											descriptions.map((d, i) => (
												<p key={i} className='text-sm text-center font-bold md:my-auto my-8'>
													{d}
												</p>
											))
										}
									</Carousel>
								) : (
									<div className='flex justify-center items-center'>
										<p className='font-bold text-sm'>Without description</p>
									</div>
								)
							}

							<AnimatedCard
								id='bsinfo'
								layoutId01='bs01'
								layoutId02='bs02'
								classProps01='w-full h-full flex justify-center items-center p-4'
								classProps02='h-auto min-h-[50vh] md:w-2/3 w-[95%] absolute md:top-[50%] top-[90%] md:left-[20%] bg-white rounded-lg shadow-xl border-2 border-solid border-[#EDEDED] z-10'
								children1={
									<div className='w-full h-auto flex flex-wrap justify-center items-center shadow-lg gap-5 py-10'>
										<span className='text-sm font-bold bg-[#EDEDED] p-2 shadow-lg rounded-lg'>
											Dimensions
										</span>
										<span className='text-sm font-bold bg-[#EDEDED] p-2 shadow-lg rounded-lg'>
											Breeding
										</span>
										<span className='text-sm font-bold bg-[#EDEDED] p-2 shadow-lg rounded-lg'>
											Egg Info
										</span>
										<span className='text-sm font-bold bg-[#EDEDED] p-2 shadow-lg rounded-lg'>
											Training Info
										</span>
									</div>
								}
								children2={
									<BasicInfo
										height={pokemon.height}
										weight={pokemon.weight}
										hatch_counter={pokemonSpecies.hatch_counter}
										base_experience={pokemon.base_experience}
										growth_rate={pokemonSpecies.growth_rate}
										gender_rate={pokemonSpecies.gender_rate}
										capture_rate={pokemonSpecies.capture_rate}
										egg_groups={pokemonSpecies.egg_groups}
									/>
								}
							/>

							<div className='w-full h-full flex justify-center sm:p-5 p-1'>
								<Pie data={data} />
							</div>
						</div>
					) : (
						<LoadingIndicator promiseInProgress={promiseInProgress} />
					)
				}
				<CardAbilities pokemon={pokemon} />
				{
					(pokemonSpecies && pokemonSpecies.evolution_chain)
					&&
					<EvolutionChain
						species={pokemonSpecies}
						descriptions={descriptions}
						url={pokemonSpecies.evolution_chain.url}
					/>
				}
			</D.DetailCardBody>

			<CardFooter imageUrl={pokeApiImg} />
		</D.DetailCard>
	)
}

export default DetailCardComponent
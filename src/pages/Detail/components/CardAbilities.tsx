import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'

import { Pokemon, Type } from '../../../types/core'
import { api } from '../../../api'
import AnimatedCard from '../../../components/AnimatedCard'
import NatureCards from './NatureCards'
import Carousel from '../../../components/Carousel'

type Props = {
	pokemon: Pokemon
}

const CardAbilities = ({ pokemon }: Props) => {
	const [pokeType, setPokeType] = useState<Type[]>()
	const [fetched, setFetched] = useState(false)
	const [abilitiesDescription, setAbilitiesDescription] = useState<{ name: string; description: string }[]>([])

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const fetchedTypes = await Promise.all(
					pokemon.types.map(async (t) => {
						const data = await api.getPokemonType(t.type.url)

						if (data.status == 200) return data.data
						else throw Error
					})
				)
				if (Array.isArray(fetchedTypes)) setPokeType(fetchedTypes)
				else throw Error

				const abilities = await Promise.all(
					pokemon.abilities.map(async (a) => {
						const data = await api.getPokemonAbilityInfo(a.ability.url)
						if (data.status == 200) return data.data
					})
				)
				if (Array.isArray(abilities)) {
					abilities.map((a) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						a.effect_entries.map((e: any) => {
							if (e.language.name == 'en') {
								setAbilitiesDescription((abilitiesDescription => [...abilitiesDescription, { description: e.effect, name: a.name }]))
							}
						})
					})
				}
				else throw Error
			} catch (e) { throw Error }
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchResults()
				.then(() => setFetched(true))
				.catch(() => console.log('erro'))
		)
	}, [pokemon])

	return (
		fetched && pokeType != undefined ? (
			<div className='w-full grid lg:grid-cols-[48%,48%] grid-cols-1 lg:grid-rows-1 grid-rows-2 my-5 justify-center gap-2 lg:px-2 px-4'>
				<NatureCards types={pokeType} pokemon={pokemon} />
				<AnimatedCard
					id='ablt'
					classProps01='w-full h-full border-2 border-solid border-[#EDEDED] rounded-lg xs:shadow-lg shadow'
					classProps02='h-[50vh] min-h-[50vh] sm:w-2/3 w-[80%] absolute md:top-[70%] bg-white rounded-lg shadow-xl bg-white border-2 border-solid border-[#EDEDED]'
					layoutId01='c01'
					layoutId02='e02'
					children1={
						<div className='w-full h-full flex flex-col gap-5 items-center justify-center py-5 px-3'>
							<p className='font-bold'>Abilities</p>
							<div className='flex justify-center items-center flex-wrap gap-4'>
								{
									pokemon.abilities.map((a, i) => (
										<p key={i} className='text-sm font-bold bg-[#EDEDED] shadow-md p-2 rounded-lg'>
											{a.ability.name}
										</p>
									))
								}
							</div>
						</div>
					}
					children2={
						<Carousel id='ca'>
							{pokemon.abilities.map((a, i) => (
								<div key={i} className='w-full h-full flex flex-col justify-center items-center gap-5'>
									<p className='text font-bold bg-[#EDEDED] shadow-md p-2 rounded-lg'>
										{a.ability.name}
									</p>
									<p className='text-xs text-center font-bold'>
										{
											abilitiesDescription
												.find((ad) => ad.name == a.ability.name) != undefined ?
												(
													abilitiesDescription
														.find((ad) => ad.name == a.ability.name)?.description
												) : 'Without description'
										}
									</p>
								</div>
							))}
						</Carousel>
					}
				/>
			</div>
		) : <LoadingIndicator />
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

export default CardAbilities
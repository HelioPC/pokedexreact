import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import { Pokemon, Type } from '../../../types/core'
import { api } from '../../../api'
import NatureCards from './NatureCards'
import LoadingIndicator from '../../../components/LoadingIndicator'
import CardAbilitiesSection from './CardAbilitiesSection'

type Props = {
	pokemon: Pokemon
}

const CardAbilities = ({ pokemon }: Props) => {
	const { promiseInProgress } = usePromiseTracker()
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
				<CardAbilitiesSection pokemon={pokemon} abilitiesDescription={abilitiesDescription} />
			</div>
		) : <LoadingIndicator promiseInProgress={promiseInProgress} />
	)
}

export default CardAbilities
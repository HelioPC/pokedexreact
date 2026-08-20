import React, { useEffect, useState } from 'react'
import { Pokemon, Type, pokemonRepository } from '../../../data/pokeapi'
import NatureCards from './NatureCards'
import LoadingIndicator from '../../../shared/ui/LoadingIndicator'
import CardAbilitiesSection from './CardAbilitiesSection'
import { englishAbilityDescription } from '../domain/englishAbilityDescription'

type Props = {
	pokemon: Pokemon
}

const CardAbilities = ({ pokemon }: Props) => {
	const [pokeType, setPokeType] = useState<Type[]>()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [abilitiesDescription, setAbilitiesDescription] = useState<{ name: string; description: string }[]>([])

	useEffect(() => {
		const controller = new AbortController()

		const fetchResults = async () => {
			setLoading(true)
			setError(null)
			try {
				const fetchedTypes = await Promise.all(
					pokemon.types.map((t) => pokemonRepository.getType(t.type.url, controller.signal))
				)
				if (controller.signal.aborted) return
				setPokeType(fetchedTypes)

				const abilities = await Promise.all(
					pokemon.abilities.map((a) => pokemonRepository.getAbility(a.ability.url, controller.signal))
				)
				if (controller.signal.aborted) return

				const descriptions = abilities.flatMap((ability) => {
					const description = englishAbilityDescription(ability)
					return description ? [{ name: ability.name, description }] : []
				})
				setAbilitiesDescription(descriptions)
			} catch {
				if (!controller.signal.aborted) {
					setError('Could not load types and abilities.')
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false)
			}
		}

		fetchResults()
		return () => controller.abort()
	}, [pokemon])

	if (loading) {
		return <LoadingIndicator promiseInProgress />
	}

	if (error || pokeType == undefined) {
		return <p className='text-center text-sm my-4' role='alert'>{error ?? 'Could not load types and abilities.'}</p>
	}

	return (
		<div className='w-full grid lg:grid-cols-[48%,48%] grid-cols-1 lg:grid-rows-1 grid-rows-2 my-5 justify-center gap-2 lg:px-2 px-4 relative'>
			<NatureCards types={pokeType} pokemon={pokemon} />
			<CardAbilitiesSection pokemon={pokemon} abilitiesDescription={abilitiesDescription} />
		</div>
	)
}

export default CardAbilities

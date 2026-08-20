import React, { lazy, Suspense, useEffect, useState } from 'react'

import { BASE_IMAGE_URL, Pokemon, Species, pokemonRepository } from '../../../data/pokeapi'
import EvolutionChain from './EvolutionChain'
import BasicInfo from './BasicInfo'
import * as D from './style'
import pokeApiImg from '../../../assets/logo.png'
import Carousel from '../../../shared/ui/Carousel'
import CardHeader from './CardHeader'
import CardFooter from './CardFooter'
import CardAbilities from './CardAbilities'
import AnimatedCard from '../../../shared/ui/AnimatedCard'
import LoadingIndicator from '../../../shared/ui/LoadingIndicator'
import { usePokeContext } from '../../../app/providers/PokeContext'
import { useAppTheme } from '../../../app/providers/ThemeContext'
import { collectEnglishFlavorTexts, pairFlavorTexts } from '../domain/flavorText'
import { formatPokemonNumber } from '../../../shared/lib/formatPokemonNumber'
import { PageSeo } from '../../../shared/seo/PageSeo'

const StatsChart = lazy(() => import('./StatsChart'))

type CardComponentProps = {
	pokemon: Pokemon
}

const DetailCardComponent = ({ pokemon }: CardComponentProps) => {
	const { theme } = useAppTheme()
	const [pokemonSpecies, setPokemonSpecies] = useState<Species>()
	const [descriptions, setDescriptions] = useState<string[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { state, dispatch } = usePokeContext()

	useEffect(() => {
		const controller = new AbortController()

		const fetchResults = async () => {
			const pokeInfoState = state.pokemonsDetailInfo.find((d) => d.id == pokemon.id)
			if (pokeInfoState?.species) {
				setPokemonSpecies(pokeInfoState.species)
				setDescriptions(pokeInfoState.descriptions)
				setLoading(false)
				return
			}

			setLoading(true)
			setError(null)
			try {
				const data = await pokemonRepository.getSpecies(pokemon.id, controller.signal)
				if (controller.signal.aborted) return

				setPokemonSpecies(data)
				const paired = pairFlavorTexts(collectEnglishFlavorTexts(data.flavor_text_entries))
				setDescriptions(paired)
				dispatch({
					type: 'upsertDetail',
					payload: {
						id: pokemon.id,
						species: data,
						descriptions: paired,
					}
				})
			} catch {
				if (!controller.signal.aborted) {
					setError('Could not load Pokémon details.')
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false)
			}
		}

		fetchResults()
		return () => controller.abort()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pokemon.id])

	const typesLabel = pokemon.types.map((t) => t.type.name).join(', ')
	const artwork = `${BASE_IMAGE_URL}${pokemon.id}.png`

	return (
		<D.DetailCard className='shadow-xl'>
			<PageSeo
				title={`${pokemon.name} #${formatPokemonNumber(pokemon.id)} | Pokédex`}
				description={`${pokemon.name} is a ${typesLabel} Pokémon. Height, stats, abilities and evolution chain.`}
				path={`/pokemon/${pokemon.id}`}
				image={artwork}
			/>
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
									src={artwork}
									alt={pokemon.name}
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
								classProps02='h-auto min-h-[50vh] md:w-2/3 w-[95%] absolute md:top-[50%] top-[90%] md:left-[20%] rounded-lg shadow-xl z-10'
								children1={
									<div className='w-full h-auto flex flex-wrap justify-center items-center shadow-lg gap-5 py-10'>
										<span
											className='text-sm font-bold p-2 shadow-lg rounded-lg'
											style={{
												backgroundColor: `${theme.colors.cardSecundary}`,
												color: `${theme.colors.textPrimary}`
											}}
										>
											Dimensions
										</span>
										<span
											className='text-sm font-bold p-2 shadow-lg rounded-lg'
											style={{
												backgroundColor: `${theme.colors.cardSecundary}`,
												color: `${theme.colors.textPrimary}`
											}}
										>
											Breeding
										</span>
										<span
											className='text-sm font-bold p-2 shadow-lg rounded-lg'
											style={{
												backgroundColor: `${theme.colors.cardSecundary}`,
												color: `${theme.colors.textPrimary}`
											}}
										>
											Egg Info
										</span>
										<span
											className='text-sm font-bold p-2 shadow-lg rounded-lg'
											style={{
												backgroundColor: `${theme.colors.cardSecundary}`,
												color: `${theme.colors.textPrimary}`
											}}
										>
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
								<Suspense fallback={<LoadingIndicator promiseInProgress />}>
									<StatsChart pokemon={pokemon} />
								</Suspense>
							</div>
						</div>
					) : (
						loading ? <LoadingIndicator promiseInProgress /> : (
							<p className='text-center my-6' role='alert'>{error ?? 'Could not load Pokémon details.'}</p>
						)
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

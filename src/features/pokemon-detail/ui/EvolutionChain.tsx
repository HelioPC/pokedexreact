import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { Pokemon, Species, pokemonRepository } from '../../../data/pokeapi'
import { Tooltip } from 'react-tooltip'
import LoadingIndicator from '../../../shared/ui/LoadingIndicator'
import PokemonCard from '../../../shared/ui/PokemonCard'
import { usePokeContext } from '../../../app/providers/PokeContext'
import { collectEvolutionSpeciesUrls } from '../domain/collectEvolutionSpeciesUrls'
import { pokemonIdFromResourceUrl } from '../../../shared/lib/pokemonIdFromResourceUrl'

type ComponentProps = {
	url: string
	species: Species
	descriptions: string[]
}

const EvolutionChain = ({ url, species, descriptions }: ComponentProps) => {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [pokemons, setPokemons] = useState<Pokemon[]>([])
	const { dispatch, state } = usePokeContext()

	useEffect(() => {
		const controller = new AbortController()

		const fetchEvolutionChain = async () => {
			setLoading(true)
			setError(null)

			const storedState = state.pokemonsDetailInfo.find(
				(d) => d.id == species.id && d.evolution_chain.length > 0
			)

			if (storedState) {
				setPokemons(storedState.evolution_chain)
				setLoading(false)
				return
			}

			try {
				const result = await pokemonRepository.getEvolutionChain(url, controller.signal)
				const speciesUrls = collectEvolutionSpeciesUrls(result.chain)

				const dtg = await Promise.all(
					speciesUrls.map(async (speciesUrl) => {
						const id = pokemonIdFromResourceUrl(speciesUrl)
						return pokemonRepository.getPokemon(id, controller.signal)
					})
				)

				if (controller.signal.aborted) return
				setPokemons(dtg)

				dispatch({
					type: 'upsertDetail',
					payload: {
						id: species.id,
						species,
						evolution_chain: dtg,
						descriptions,
					}
				})
			} catch {
				if (!controller.signal.aborted) {
					setError('Could not load the evolution chain.')
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false)
			}
		}

		fetchEvolutionChain()
		return () => controller.abort()
		// Cache lookup uses the latest context; species.id + url identify the chain.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url, species.id])

	if (loading) {
		return <LoadingIndicator promiseInProgress />
	}

	if (error || pokemons.length === 0) {
		return <p className='text-center text-sm my-4' role='alert'>{error ?? 'No evolution data.'}</p>
	}

	return (
		<div className='w-full min-h-[200px] bg-transparent rounded-lg py-4'>
			<h2 className='text-center text-xl font-bold my-5'>Evolution chain</h2>
			<div className='flex md:flex-row flex-col justify-center items-center gap-5'>
				{
					pokemons.map((p, i, self) => (
						<div key={p.id} className='flex md:flex-row flex-col items-center gap-5'>
							<PokemonCard name={p.name} pokeData={p} />
							{
								i < pokemons.length - 1 && (
									<div
										data-tooltip-id={i.toString() + 'eh'}
									>
										<MdKeyboardArrowRight size={30} className='md:block hidden' />
									</div>
								)
							}
							{
								i < pokemons.length - 1 && (
									<Tooltip
										id={i.toString() + 'eh'}
										content={`${p.name} evolves into ${self[i + 1].name}`}
										place='top'
										style={{
											fontSize: '10px',
											padding: '4px',
											backgroundColor: '#666666'
										}}
									/>
								)
							}
							{
								i < pokemons.length - 1 && (
									<div
										data-tooltip-id={i.toString() + 'ep'}
									>
										<MdKeyboardArrowDown size={30} className='md:hidden block' />
									</div>
								)
							}
							{
								i < pokemons.length - 1 && (
									<Tooltip
										id={i.toString() + 'ep'}
										content={`${p.name} evolves into ${self[i + 1].name}`}
										place='bottom'
										style={{
											fontSize: '10px',
											padding: '4px',
											backgroundColor: '#666666'
										}}
									/>
								)
							}
						</div>
					))
				}
			</div>
		</div>
	)
}

export default EvolutionChain

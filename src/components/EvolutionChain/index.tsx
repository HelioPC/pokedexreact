import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { api } from '../../api'
import { Pokemon } from '../../types/core'
import PokemonEvolutionCard from '../PokemonEvolutionCard'
import { Tooltip } from 'react-tooltip'
import LoadingIndicator from '../LoadingIndicator'

type ComponentProps = {
	url: string
}

const EvolutionChain = ({ url }: ComponentProps) => {
	const { promiseInProgress } = usePromiseTracker()
	const [fetched, setFetched] = useState(false)
	const [pokemons, setPokemons] = useState<Pokemon[]>([])

	useEffect(() => {
		const fetchEvolutionChain = async () => {
			if (pokemons.length != 0) return
			try {
				const result = await api.getPokemonEvolutionChain(url)
				let evoData = result.data.chain
				const pokemonsNames: string[] = []

				pokemonsNames.push(evoData.species.url)

				do {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					evoData.evolves_to.map((p: any) => {
						pokemonsNames.push(p.species.url)
					})
					evoData = evoData.evolves_to[0]
				} while (evoData.evolves_to.length > 0 && Object.prototype.hasOwnProperty.call(evoData, 'evolves_to'))

				if (pokemonsNames.length != 0) {
					const dtg = await Promise.all(
						pokemonsNames.map(async (name) => {
							const id = name.slice(42)
							const data = await api.getPokemon(id.slice(0, id.length - 1))

							if (data.status !== 200) throw Error
							else return data.data
						})
					)
					setPokemons(dtg)
				}
				else throw Error
			} catch (error) {
				throw Error
			}
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchEvolutionChain().then(() => setFetched(true))
		)
	}, [])

	return (
		fetched && pokemons.length != 0 ? (
			<div className='w-full min-h-[200px] bg-transparent rounded-lg py-4'>
				<h1 className='text-center text-xl font-bold my-5'>Evolution chain</h1>
				<div className='flex md:flex-row flex-col justify-center items-center gap-5'>
					{
						pokemons.map((p, i, self) => (
							<div key={i} className='flex md:flex-row flex-col items-center gap-5'>
								<PokemonEvolutionCard pokemon={p} />
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
		) : (
			<LoadingIndicator promiseInProgress={promiseInProgress} />
		)
	)
}


export default EvolutionChain
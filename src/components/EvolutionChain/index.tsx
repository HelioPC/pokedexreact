import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { api } from '../../api'
import { Pokemon } from '../../types/core'
import { PokemonEvolutionCard } from '../PokemonCard'

type ComponentProps = {
	url: string
}

const EvolutionChain = ({ url }: ComponentProps) => {
	const [fetched, setFetched] = useState(false)
	const [pokemons, setPokemons] = useState<Pokemon[]>([])

	useEffect(() => {
		const fetchEvolutionChain = async () => {
			if (pokemons.length != 0) return
			try {
				const result = await api.getPokemonEvolutionChain(url)
				let evoData = result.data.chain
				const pokemonsNames: string[] = []

				pokemonsNames.push(evoData.species.name)

				do {
					pokemonsNames.push(evoData.evolves_to[0].species.name)
					evoData = evoData.evolves_to[0]
				} while (evoData.evolves_to.length > 0 && Object.prototype.hasOwnProperty.call(evoData, 'evolves_to'))

				if (pokemonsNames.length != 0) {
					pokemonsNames.map(async (name) => {
						const data = await api.getPokemon(name)

						if (data.status === 200) setPokemons((poke => [...poke, data.data]))
						else throw Error
					})
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
			<div className='w-full flex md:flex-row flex-col justify-center items-center gap-5 min-h-[200px] shadow-lg border-t-2 border-black py-4'>
				{
					pokemons.map((p, i) => (
						<div key={i} className='flex md:flex-row flex-col items-center gap-5'>
							<PokemonEvolutionCard pokemon={p} />
							{
								i < pokemons.length - 1 && (
									<MdKeyboardArrowRight size={30} className='md:block hidden' />
								)
							}
							{
								i < pokemons.length - 1 && (
									<MdKeyboardArrowDown size={30} className='md:hidden block' />
								)
							}
						</div>
					))
				}
			</div>
		) : (
			<LoadingIndicator />
		)
	)
}

const LoadingIndicator = () => {
	const { promiseInProgress } = usePromiseTracker()

	return (
		promiseInProgress ?
			(
				<div className='w-full flex justify-center items-center'>
					<ThreeDots
						height='80'
						width='80'
						radius='9'
						color='#282936'
						ariaLabel='three-dots-loading'
						wrapperStyle={{}}
						visible={true}
					/>
				</div>
			) : (
				<div className='hidden' />
			)
	)
}

export default EvolutionChain
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tilt } from 'react-tilt'

import { BASE_IMAGE_URL, Pokemon, pokemonRepository } from '../../../data/pokeapi'
import { formatPokemonNumber } from '../../lib/formatPokemonNumber'
import TypeLabel from '../TypeLabel'
import { useAppTheme } from '../../../app/providers/ThemeContext'

type PokemonCardProps = {
	name: string
	pokeData?: Pokemon
}

const PokemonCard = ({ name, pokeData }: PokemonCardProps) => {
	const { theme } = useAppTheme()
	const [pokemon, setPokemon] = useState<Pokemon | undefined>(pokeData)
	const [imageLoading, setImageLoading] = useState(true)
	const [tooManyRequests, setTooManyRequests] = useState(false)

	useEffect(() => {
		if (pokeData) {
			setPokemon(pokeData)
			return
		}

		const controller = new AbortController()

		const fetchPokemon = async () => {
			try {
				const data = await pokemonRepository.getPokemon(name, controller.signal)
				setPokemon(data)
			} catch {
				if (controller.signal.aborted) return
			}
		}

		fetchPokemon()

		return () => controller.abort()
	}, [name, pokeData])

	return (
		pokemon ? (
			<Tilt>
				<Link to={`/pokemon/${pokemon.id}`} state={{ pokemon }}>
					<div
						className='w-full h-full sm:max-w-[200px] rounded-md hover:shadow-xl shadow-lg duration-300 cursor-pointer pb-2'
						style={{
							backgroundColor: `${theme.colors.cardBackground}`
						}}
					>
						<div
							className='w-full flex justify-center h-auto rounded-t-md overflow-hidden'
							style={{
								backgroundColor: `${theme.colors.cardSecundary}`
							}}
						>
							<img
								src={`${BASE_IMAGE_URL}${pokemon.id}.png`}
								alt={pokemon.name}
								className='sm:w-full w-[60%] h-48 duration-300'
								onLoad={() => setImageLoading(false)}
								onError={() => setTooManyRequests(true)}
								style={
									tooManyRequests ? { display: 'none' } :
										imageLoading ? {} : { display: 'block' }
								}
							/>
						</div>
						<div className='w-full flex flex-col sm:items-start items-center sm:px-5 px-2 sm:py-2 py-1'>
							<p className='text-xs font-bold text-[#888]'>Nº: {formatPokemonNumber(pokemon.id)}</p>
							<div className='mt-1'>
								<p
									className='text-sm'
									style={{
										color: `${theme.colors.textPrimary}`
									}}
								>
									{pokemon.name}
								</p>
							</div>
							<div className='flex sm:gap-2 md:gap-1 lg:gap-4 gap-1 mt-2'>
								{
									pokemon.types.map((t, i) => (
										<TypeLabel key={i} name={t.type.name} />
									))
								}
							</div>
						</div>
					</div>
				</Link>
			</Tilt>
		) : (
			<div className='hidden' />
		)
	)
}

export default PokemonCard

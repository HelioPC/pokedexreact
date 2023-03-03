import React, { useEffect, useState } from 'react'

import { api } from '../../api'
import { Pokemon } from '../../types/core'
import { formatNumber } from '../../helpers/numbers'

type PokemonCardProps = {
	name: string
}

const PokemonCard = ({ name }: PokemonCardProps) => {
	const [pokemon, setPokemon] = useState<Pokemon>()
	const [imageLoading, setImageLoading] = useState(true)
	const [tooManyRequests, setTooManyRequests] = useState(false)

	useEffect(() => {
		const fetchPokemon = async () => {
			const data = await api.getPokemon(name)

			if (data.status === 200) setPokemon(data.data)
		}

		fetchPokemon()
	}, [])

	return (
		pokemon ? (
			<div className='w-full h-full rounded-md hover:shadow-xl shadow-lg duration-300 hover:scale-[1.02] cursor-pointer bg-white'>
				<div className='w-full flex justify-center h-auto bg-[#f5f5f5] rounded-t-md'>
					<img
						src={pokemon?.sprites.front_default}
						className='sm:w-full w-[60%] h-48'
						onLoad={() => setImageLoading(false)}
						onError={() => setTooManyRequests(true)}
						style={
							tooManyRequests ? { display: 'none' } :
								imageLoading ? {} : { display: 'block' }
						}
					/>
					{
						tooManyRequests ?
							(
								<h6 className='mx-auto'>
									<span className='p-2 bg-red-500 mt-2'>Too many requests</span>
								</h6>
							) : null
					}
				</div>
				<div className='w-full sm:px-5 px-2 sm:py-2 py-1'>
					<p className='text-xs font-bold text-[#888]'>Nº: {formatNumber(pokemon.id)}</p>
					<div className='w-full mt-1'>
						<p className='text-sm'>{pokemon.name}</p>
					</div>
				</div>
			</div>
		) : (
			<div className='hidden' />
		)
	)
}

export default PokemonCard
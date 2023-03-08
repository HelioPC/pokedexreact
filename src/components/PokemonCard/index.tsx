import React, { useEffect, useState } from 'react'

import { api } from '../../api'
import { Pokemon } from '../../types/core'
import { formatNumber } from '../../helpers/numbers'
import TypeLabel from '../TypeLabel'
import { Link } from 'react-router-dom'

type PokemonCardProps = {
	name: string
}

const PokemonCard = ({ name }: PokemonCardProps) => {
	const [pokemon, setPokemon] = useState<Pokemon>()
	const [imageLoading, setImageLoading] = useState(true)
	const [tooManyRequests, setTooManyRequests] = useState(false)

	useEffect(() => {
		const fetchPokemon = async () => {
			try {
				const data = await api.getPokemon(name)

				if (data.status === 200) setPokemon(data.data)
			} catch (error) { /* empty */ }
		}

		fetchPokemon()
	}, [])

	return (
		pokemon ? (
			<Link to={`/pokemon/${pokemon.id}`} state={{ fromApp: true, pokemon: pokemon }}>
				<div className='w-full h-full rounded-md hover:shadow-xl shadow-lg duration-300 hover:scale-[1.02] cursor-pointer bg-white pb-2'>
					<div className='w-full flex justify-center h-auto bg-[#f5f5f5] rounded-t-md overflow-hidden'>
						<img
							src={pokemon?.sprites.front_default}
							className='sm:w-full w-[60%] h-48 hover:scale-105 duration-300'
							onLoad={() => setImageLoading(false)}
							onError={() => setTooManyRequests(true)}
							style={
								tooManyRequests ? { display: 'none' } :
									imageLoading ? {} : { display: 'block' }
							}
						/>
					</div>
					<div className='w-full flex flex-col sm:items-start items-center sm:px-5 px-2 sm:py-2 py-1'>
						<p className='text-xs font-bold text-[#888]'>Nº: {formatNumber(pokemon.id)}</p>
						<div className='mt-1'>
							<p className='text-sm'>{pokemon.name}</p>
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
		) : (
			<div className='hidden' />
		)
	)
}

export default PokemonCard
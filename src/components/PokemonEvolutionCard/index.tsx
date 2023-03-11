import React, { useState } from 'react'

import { Pokemon } from '../../types/core'
import { formatNumber } from '../../helpers/numbers'
import TypeLabel from '../TypeLabel'
import { Link } from 'react-router-dom'
import { BASE_IMAGE_URL } from '../../api'

type PokemonEvolutioCardProps = {
	pokemon: Pokemon
}

const PokemonEvolutionCard = ({ pokemon }: PokemonEvolutioCardProps) => {
	const [imageLoading, setImageLoading] = useState(true)
	const [tooManyRequests, setTooManyRequests] = useState(false)

	return (
		<Link to={`/pokemon/${pokemon.id}`} state={{ fromApp: true, pokemon: pokemon }}>
			<div className='w-full h-full cursor-pointer pb-2 hover:shadow duration-300 rounded-md p-4'>
				<div className='w-full flex justify-center h-auto bg-[#f5f5f5] rounded-[50%] overflow-hidden'>
					<img
						src={`${BASE_IMAGE_URL}${pokemon.id}.png`}
						className='h-48'
						onLoad={() => setImageLoading(false)}
						onError={() => setTooManyRequests(true)}
						style={
							tooManyRequests ? { display: 'none' } :
								imageLoading ? {} : { display: 'block' }
						}
					/>
				</div>
				<div className='w-full flex flex-col justify-center items-center sm:py-2 py-1'>
					<p className='text-xs font-bold text-[#888]'>Nº: {formatNumber(pokemon.id)}</p>
					<div className='mt-1'>
						<p className='text-sm text-black'>{pokemon.name}</p>
					</div>
					<div className='flex sm:gap-2 md:gap-1 lg:gap-4 gap-1 mt-1'>
						{
							pokemon.types.map((t, i) => (
								<TypeLabel key={i} name={t.type.name} />
							))
						}
					</div>
				</div>
			</div>
		</Link>
	)
}

export default PokemonEvolutionCard

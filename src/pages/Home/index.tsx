import React, { useState } from 'react'
import { MdRepeat } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'

import { Pokemon } from '../../types/core'
import { api } from '../../api'
import { AlertError } from '../../utils/alert'

const LoadingIndicator = () => {
	const { promiseInProgress } = usePromiseTracker()

	return (
		promiseInProgress ?
			(
				<ThreeDots
					height='80'
					width='80'
					radius='9'
					color='#282936'
					ariaLabel='three-dots-loading'
					wrapperStyle={{}}
					visible={true}
				/>
			) : (
				<div className='hidden' />
			)
	)
}

const Home = () => {
	const [pokemon, setPokemon] = useState<Pokemon>()
	const [disable, setDisable] = useState(false)
	const [pokeId, setPokeId] = useState('')

	const fecthPokemon = async () => {
		setDisable(true)

		if (Number.isNaN(parseInt(pokeId))) {
			AlertError({
				title: 'Erro',
				description: 'Introduza um número válido'
			})
			return
		}

		const data = await api.getPokemon(pokeId.toLowerCase())

		if (data.status === 200) setPokemon({ ...data.data })
	}

	const handleClick = () => {
		trackPromise(
			fecthPokemon().then(() => setDisable(false))
		)
	}

	//if(pokemon != undefined) console.log(pokemon)

	return (
		<div className='w-screen min-h-screen flex justify-center items-center'>
			{
				!disable ? (
					pokemon ? (
						<div className='flex flex-col'>
							<img
								src={pokemon.sprites.front_default} alt='pokemon' className='w-40 h-40'
							/>
							<div className='flex gap-5'>
								<p className='font-bold'>Id:</p>
								<p>{pokemon.id}</p>
							</div>
							<div className='flex gap-5'>
								<p className='font-bold'>Name:</p>
								<p>{pokemon.name}</p>
							</div>
							<div className='flex gap-5'>
								<p className='font-bold'>Height:</p>
								<p>{pokemon.height} cm</p>
							</div>
							<div className='flex gap-5'>
								<p className='font-bold'>Weight:</p>
								<p>{pokemon.weight} kg</p>
							</div>
							<button
								className='text-white rounded-md p-3 hover:scale-105 duration-300 bg-black cursor-pointer mt-10 flex justify-center items-center'
								onClick={() => {
									setPokeId('')
									setPokemon(undefined)
								}}
							>
								<MdRepeat size={20} />
							</button>
						</div>
					) : (
						<div className='flex flex-col gap-20'>
							<input
								placeholder='Id do pokemon'
								value={pokeId}
								onChange={(e) => setPokeId(e.target.value)}
								disabled={disable}
								className={`
                                max-w-lg h-12 bg-transparent border-0 text-black
                                text-sm outline outline-2 focus:outline-green-600 p-5
                                rounded-md
                                ${disable && 'cursor-not-allowed'}
                            `}
							/>
							<button
								className={`
                                text-white rounded-md p-3 hover:scale-105 duration-300
                                ${disable ?
							'bg-[#AAA] cursor-not-allowed' :
							'bg-black cursor-pointer'
						}
                            `}
								disabled={disable}
								onClick={() => handleClick()}
							>
                                Get
							</button>
						</div>
					)
				) : (<LoadingIndicator />)
			}
		</div >
	)
}

export default Home
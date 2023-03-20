import React, { useEffect, useState } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'
import { Pokemon, Type } from '../../../types/core'
import { api } from '../../../api'
import TypeLabel from '../../../components/TypeLabel'

type Props = {
	pokemon: Pokemon
}

const CardAbilities = ({ pokemon }: Props) => {
	const [pokeType, setPokeType] = useState<Type>()
	const [fetched, setFetched] = useState(false)

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const data = await api.getPokemonType(pokemon.id.toString())

				if (data.status == 200) setPokeType(data.data)
				else console.log('erro')
			} catch (e) { /* empty */ }
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchResults().then(() => setFetched(true)).catch(() => console.log('erro'))
		)
	}, [])

	return (
		fetched && pokeType != undefined ? (
			<div className='w-full grid sm:grid-cols-2 grid-cols-1 sm:grid-rows-1 grid-rows-2'>
				<div className='w-full h-full flex justify-center p-2 gap-10 border-solid border-2 border-red-500'>
					<div className='flex flex-col items-center shadow-md p-2 rounded-lg'>
						<span className='font-bold'>Weakness</span>
						<span className='text-xs mb-4'>{'(Get damage from)'}</span>
						<div className='flex flex-col gap-2'>
							{
								pokeType.damage_relations.double_damage_from.map((w, i) => (
									<TypeLabel key={i} name={w.name} />
								))
							}
						</div>
					</div>
					<div className='flex flex-col items-center shadow-md p-2 rounded-lg'>
						<span className='font-bold'>Toughness</span>
						<span className='text-xs mb-4'>{'(Cause damage to)'}</span>
						<div className='flex flex-col gap-2'>
							{
								pokeType.damage_relations.double_damage_to.map((w, i) => (
									<TypeLabel key={i} name={w.name} />
								))
							}
						</div>
					</div>
				</div>

				<div className='w-full h-full flex flex-col border-solid border-2 border-blue-500'>
				</div>
			</div>
		) : (
			<LoadingIndicator />
		)
	)
}

const LoadingIndicator = () => {
	const { promiseInProgress } = usePromiseTracker()

	return (
		promiseInProgress ? (
			<ThreeDots
				height='80'
				width='80'
				radius='9'
				color='#282936'
				ariaLabel='three-dots-loading'
				wrapperStyle={{}}
				visible={true}
			/>
		) : null
	)
}

export default CardAbilities
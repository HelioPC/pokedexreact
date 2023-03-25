import React, { useEffect, useState } from 'react'
import { MdDoubleArrow, MdAdd, MdRemove } from 'react-icons/md'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { ThreeDots } from 'react-loader-spinner'
import { motion, LayoutGroup } from 'framer-motion'

import { Pokemon, Type } from '../../../types/core'
import { api } from '../../../api'
import TypeLabel from '../../../components/TypeLabel'

type Props = {
	pokemon: Pokemon
}

const CardAbilities = ({ pokemon }: Props) => {
	const [pokeType, setPokeType] = useState<Type[]>()
	const [fetched, setFetched] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const fetchedTypes = await Promise.all(
					pokemon.types.map(async (t) => {
						const data = await api.getPokemonType(t.type.url)

						if (data.status == 200) return data.data
						else throw Error
					})
				)
				if (Array.isArray(fetchedTypes)) setPokeType(fetchedTypes)
				else throw Error
				const abilities = await Promise.all(
					pokemon.abilities.map(async (a) => {
						const data = await api.getPokemonAbilityInfo(a.ability.url)
						if (data.status == 200) return data.data
					})
				)
				//console.log(abilities)
			} catch (e) { throw Error }
		}

		trackPromise(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			fetchResults()
				.then(() => setFetched(true))
				.catch(() => console.log('erro'))
		)
	}, [pokemon])

	return (
		fetched && pokeType != undefined ? (
			<div className='w-full my-10 sm:px-10 px-2'>
				<LayoutGroup
					id='ablt'
				>
					{!open ?
						(
							<motion.div
								layoutId='compactCard'
								className='w-full h-full p-2 cursor-pointer'
								onClick={() => setOpen(!open)}
							>
								<div className='w-full h-full flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5 px-3'>
									<p className='font-bold'>Abilities</p>
									<div className='flex justify-center items-center flex-wrap gap-4'>
										{
											pokemon.abilities.map((a, i) => (
												<p key={i} className='text-sm bg-[#EDEDED] shadow-md p-2 rounded-lg'>
													{a.ability.name}
												</p>
											))
										}
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div
								layoutId='expandableCard'
								className='sm:h-[50vh] h-auto sm:w-2/3 w-[80%] absolute md:top-[70%] bg-white rounded-lg shadow-xl cursor-pointer'
								style={{ border: 'solid 2px #EDEDED', left: '10%' }}
								onClick={() => setOpen(!open)}
							>
								<div className='w-full h-full flex sm:flex-row flex-col justify-center items-center p-2 gap-10'>
									<div className='flex flex-col items-center shadow-lg p-2 rounded-lg'>
										<span className='font-bold'>Type</span>
										<span className='text-xs text-center text-[#AAA] mb-4'>{'(Kind of nature)'}</span>
										<div className='flex flex-col gap-2'>
											{
												pokemon.types.map((t, i) => (
													<TypeLabel key={i} name={t.type.name} />
												))
											}
										</div>
									</div>
									<div className='flex flex-col items-center shadow-lg p-2 rounded-lg'>
										<span className='font-bold'>Weakness</span>
										<span className='text-xs text-[#AAA] mb-4'>{'(Get damage from)'}</span>
										<div className='flex xs:gap-4 gap-2'>
											{
												pokeType.map((t, i) => (
													<div className='flex flex-col gap-2' key={i}>

														<div className='flex items-center'>
															<span className='text-xs mr-1'>
																{`(${t.name})`}
															</span>
															<MdDoubleArrow
																size={12}
																className='rotate-90'
																color='#bb0000'
															/>
															<MdRemove size={12} />
														</div>
														{
															t.damage_relations.double_damage_from.length > 0 ?
																t.damage_relations.double_damage_from.map((w, j) => (
																	<TypeLabel key={j} name={w.name} />
																)) : (
																	<span className='text-center text-xs font-bold'>
																		None
																	</span>
																)
														}
													</div>
												))
											}
										</div>
									</div>
									<div className='flex flex-col items-center shadow-lg p-2 rounded-lg'>
										<span className='font-bold'>Toughness</span>
										<span className='text-xs text-[#AAA] mb-4'>{'(Cause damage to)'}</span>
										<div className='flex xs:gap-4 gap-2'>
											{
												pokeType.map((t, i) => (
													<div className='flex flex-col gap-2' key={i}>

														<div className='flex items-center'>
															<span className='text-xs mr-1'>
																{`(${t.name})`}
															</span>
															<MdDoubleArrow
																size={12}
																className='rotate-[270deg]'
																color='#00bb00'
															/>
															<MdAdd size={12} />
														</div>
														{
															t.damage_relations.double_damage_to.length > 0 ?
																t.damage_relations.double_damage_to.map((w, j) => (
																	<TypeLabel key={j} name={w.name} />
																)) : (
																	<span className='text-center text-xs font-bold'>
																		None
																	</span>
																)
														}
													</div>
												))
											}
										</div>
									</div>
								</div>
							</motion.div>
						)
					}
				</LayoutGroup>
			</div>
		) : <LoadingIndicator />
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
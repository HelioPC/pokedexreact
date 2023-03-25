import React from 'react'
import { MdDoubleArrow, MdRemove, MdAdd } from 'react-icons/md'
import AnimatedCard from '../../../components/AnimatedCard'

import TypeLabel from '../../../components/TypeLabel'
import { Pokemon, Type } from '../../../types/core'

type Props = {
	pokemon: Pokemon
	types: Type[]
}

const NatureCards = ({ pokemon, types }: Props) => {
	return (
		<AnimatedCard
			id='nclt'
			classProps01='w-full h-full border-2 border-solid border-[#EDEDED] rounded-lg xs:shadow-lg shadow'
			classProps02='h-auto min-h-[50vh] sm:w-2/3 w-[80%] py-4 absolute md:top-[70%] bg-white rounded-lg shadow-xl bg-white border-2 border-solid border-[#EDEDED]'
			layoutId01='nCompactCard'
			layoutId02='nExpandedCard'
			children1={<NatureCompactCard pokemon={pokemon} types={types} />}
			children2={<NatureExpandedCard pokemon={pokemon} types={types} />}
		/>
	)
}

const NatureCompactCard = ({ pokemon, types }: Props) => {
	return (
		<div className='w-full h-full flex flex-row flex-wrap justify-center p-2 gap-10'>
			<div className='flex flex-col items-center p-2'>
				<span className='font-bold'>Type</span>
				<span className='text-xs text-center text-[#AAA] mb-4'>{'(Kind of nature)'}</span>
				<TypeLabel name={pokemon.types[0].type.name} />
			</div>
			{types[0].damage_relations.double_damage_from.length > 1 ?
				(
					<div className='flex flex-col items-center p-2'>
						<span className='font-bold'>Weakness</span>
						<span className='text-xs text-[#AAA] mb-4'>{'(Get damage from)'}</span>
						<TypeLabel name={types[0].damage_relations.double_damage_from[0].name} />
					</div>
				) : null
			}
			{types[0].damage_relations.double_damage_to.length > 1 ?
				(
					<div className='flex flex-col items-center p-2'>
						<span className='font-bold'>Toughness</span>
						<span className='text-xs text-[#AAA] mb-4'>{'(Cause damage to)'}</span>
						<TypeLabel name={types[0].damage_relations.double_damage_to[0].name} />
					</div>
				) : null
			}
		</div>
	)
}

const NatureExpandedCard = ({ pokemon, types }: Props) => {
	return (
		<div className='w-full h-full flex flex-wrap justify-center items-center xs:gap-10 gap-4'>
			<div className='flex flex-col items-center p-5 bg-white shadow-lg rounded-lg'>
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
			<div className='flex flex-col items-center p-5 bg-white shadow-lg rounded-lg'>
				<span className='font-bold'>Weakness</span>
				<span className='text-xs text-[#AAA] mb-4'>{'(Get damage from)'}</span>
				<div className='flex xs:gap-4 gap-2'>
					{
						types.map((t, i) => (
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
			<div className='flex flex-col items-center p-5 bg-white shadow-lg rounded-lg'>
				<span className='font-bold'>Toughness</span>
				<span className='text-xs text-[#AAA] mb-4'>{'(Cause damage to)'}</span>
				<div className='flex xs:gap-4 gap-2'>
					{
						types.map((t, i) => (
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
	)
}

export default NatureCards

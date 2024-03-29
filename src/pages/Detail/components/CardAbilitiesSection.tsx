import React from 'react'
import AnimatedCard from '../../../components/AnimatedCard'
import Carousel from '../../../components/Carousel'
import { Pokemon } from '../../../types/core'
import { useAppTheme } from '../../../contexts/ThemeContext'

type Props = {
	pokemon: Pokemon
	abilitiesDescription: {
		name: string; description: string
	}[]
}

const CardAbilitiesSection = ({ pokemon, abilitiesDescription }: Props) => {
	const { theme } = useAppTheme()
	return (
		<AnimatedCard
			id='ablt'
			classProps01='w-full h-full rounded-lg xs:shadow-lg shadow'
			classProps02='h-[50vh] min-h-[50vh] sm:w-2/3 w-[80%] absolute bottom-[0px] right-0 bg-white rounded-lg shadow-xl bg-white border-2 border-solid border-[#EDEDED]'
			layoutId01='c01'
			layoutId02='e02'
			children1={
				<div className='w-full h-full flex flex-col gap-5 items-center justify-center py-5 px-3'>
					<p className='font-bold'>Abilities</p>
					<div className='flex justify-center items-center flex-wrap gap-4'>
						{
							pokemon.abilities.map((a, i) => (
								<p
									key={i}
									className='text-sm font-bold shadow-md p-2 rounded-lg'
									style={{
										backgroundColor: `${theme.colors.cardSecundary}`,
										color: `${theme.colors.textPrimary}`
									}}
								>
									{a.ability.name}
								</p>
							))
						}
					</div>
				</div>
			}
			children2={
				<Carousel id='ca'>
					{pokemon.abilities.map((a, i) => (
						<div key={i} className='w-full h-full flex flex-col justify-center items-center gap-5'>
							<p
								key={i}
								className='text-sm font-bold shadow-md p-2 rounded-lg'
								style={{
									backgroundColor: `${theme.colors.cardSecundary}`,
									color: `${theme.colors.textPrimary}`
								}}
							>
								{a.ability.name}
							</p>
							<p className='text-xs text-center font-bold'>
								{
									abilitiesDescription
										.find((ad) => ad.name == a.ability.name) != undefined ?
										(
											abilitiesDescription
												.find((ad) => ad.name == a.ability.name)?.description
										) : 'Without description'
								}
							</p>
						</div>
					))}
				</Carousel>
			}
		/>
	)
}

export default CardAbilitiesSection
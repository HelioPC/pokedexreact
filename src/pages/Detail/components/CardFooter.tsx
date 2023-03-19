import React from 'react'
import { Tooltip } from 'react-tooltip'

import { DetailCardFooter } from '../style'

type Props = {
	imageUrl: string
}

const CardFooter = ({ imageUrl }: Props) => {
	return (
		<DetailCardFooter>
			<img
				src={imageUrl}
				className='h-8 rounded-full'
				alt='api'
			/>
			<p className='text-xs'>
				Pokedex by
				<a
					target='_blank' rel='noreferrer'
					href='https://github.com/HelioPC'
					data-tooltip-id='link-me'
					className='font-bold text-blue-600'> HelioPC</a>
			</p>
			<Tooltip
				id='link-me'
				content='A brilliant software developer'
				place='top'
				style={{
					fontSize: '10px',
					padding: '4px',
					backgroundColor: '#666666'
				}}
			/>
		</DetailCardFooter>
	)
}

export default CardFooter
import React from 'react'
import Tooltip from '@mui/material/Tooltip'

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
				<Tooltip
					title='A brilliant software developer'
					placement='top'
					arrow
				>
					<a target='_blank' rel='noreferrer' href='https://github.com/HelioPC' className='font-bold text-blue-600'> HelioPC</a>
				</Tooltip>
			</p>
		</DetailCardFooter>
	)
}

export default CardFooter
import React from 'react'
import { Link } from 'react-router-dom'
import { formatNumber } from '../../../helpers/numbers'

import { DetailCardHeader } from '../style'

type Props = {
	imageUrl: string
	name: string
	id: number
}

const CardHeader = ({ imageUrl, name, id }: Props) => {
	return (
		<DetailCardHeader className='shadow xs:justify-between justify-center'>
			<Link to='/'>
				<img
					src={imageUrl}
					className='h-8 rounded-full'
					alt='api'
				/>
			</Link>
			<p className='text-sm xs:block hidden'>
				Name: <label className='text-sm font-bold'>{name}</label>
			</p>
			<p className='text-sm font-bold xs:block hidden'>
				{formatNumber(id)}
			</p>
		</DetailCardHeader>
	)
}

export default CardHeader
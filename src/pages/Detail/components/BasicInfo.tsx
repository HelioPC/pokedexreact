import React from 'react'
import { MdMale, MdFemale } from 'react-icons/md'

type Props = {
	height: number
	weight: number
	gender_rate: number
}

const BasicInfo = ({ height, weight, gender_rate }: Props) => {
	return (
		<React.Fragment>
			<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5'>
				<p className='font-bold'>Height</p>
				<p className='text-sm'>{height * 10} cm</p>
			</div>
			<div className='flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5'>
				<p className='font-bold'>Weight</p>
				<p className='text-sm'>{weight / 10} kg</p>
			</div>
			<div className='w-full flex flex-col gap-5 items-center justify-center xs:shadow-lg shadow rounded-lg py-5 px-3'>
				<p className='font-bold'>Gender</p>
				{
					gender_rate > 0 ? (
						<div className='flex gap-5'>
							<div className='flex items-center'>
								<MdMale className='text-lg' color='rgb(10,10,255)' />
								<span className='text-sm'>{12.5 * (8 - gender_rate)}%</span>
							</div>
							<div className='flex items-center'>
								<MdFemale className='text-lg' color='rgb(219,39,119)' />
								<span className='text-sm'>{12.5 * gender_rate}%</span>
							</div>
						</div>
					) : (
						<div>
							<p className='text-sm'>Genderless</p>
						</div>
					)
				}
			</div>
		</React.Fragment>
	)
}

export default BasicInfo
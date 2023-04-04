import React from 'react'
import { MdMale, MdFemale } from 'react-icons/md'

type Props = {
	height: number
	weight: number
	gender_rate: number
	capture_rate: number
	hatch_counter: number
	base_experience: number
	growth_rate: {
		name: string
		url: string
	}
	egg_groups: {
		name: string
		url: string
	}[]
}

const BasicInfo = ({ height, weight, gender_rate, capture_rate, hatch_counter, base_experience, growth_rate, egg_groups }: Props) => {
	return (
		<div className='w-full h-full grid xs:grid-cols-2 xs:grid-rows-2 grid-cols-[repeat(1,auto)] grid-rows-[repeat(4,auto)] gap-5 p-10'>
			<div className='flex flex-col justify-center items-center gap-4 xs:shadow-lg shadow rounded-lg py-5'>
				<p className='font-bold'>Dimension</p>
				<div className='flex flex-wrap justify-center items-center gap-2'>
					<div className='flex items-center gap-2'>
						<p className='text-xs font-bold'>Height:</p>
						<p className='text-xs text-[#7B7B7B] font-bold'>{height * 10} cm</p>
					</div>
					<div className='flex items-center gap-2'>
						<p className='text-xs font-bold'>Weight:</p>
						<p className='text-xs text-[#7B7B7B] font-bold'>{weight / 10} kg</p>
					</div>
				</div>
			</div>
			<div className='flex flex-col justify-center items-center gap-4 xs:shadow-lg shadow rounded-lg py-5'>
				<p className='font-bold'>Breeding</p>
				<div className='flex flex-wrap justify-center items-center gap-2'>
					<div className='flex flex-wrap items-center justify-center gap-2'>
						<p className='text-xs font-bold'>Gender:</p>
						{
							gender_rate > 0 ? (
								<div className='flex gap-2'>
									<div className='flex items-center'>
										<MdMale className='text-lg' color='rgb(10,10,255)' />
										<span className='text-xs text-[#7B7B7B] font-bold'>{12.5 * (8 - gender_rate)}%</span>
									</div>
									<div className='flex items-center'>
										<MdFemale className='text-lg' color='rgb(219,39,119)' />
										<span className='text-xs text-[#7B7B7B] font-bold'>{12.5 * gender_rate}%</span>
									</div>
								</div>
							) : (
								<div>
									<p className='text-xs text-[#7B7B7B] font-bold'>Genderless</p>
								</div>
							)
						}
					</div>
				</div>
			</div>
			<div className='flex flex-col justify-center items-center gap-4 xs:shadow-lg shadow rounded-lg py-5'>
				<p className='font-bold'>Egg info</p>
				<div className='flex flex-wrap justify-center items-center gap-2'>
					{
						(egg_groups && egg_groups.length > 0) ? <div className='flex flex-wrap items-center justify-center gap-2'>
							<p className='text-xs font-bold'>Egg groups:</p>
							<p className='text-xs text-[#7B7B7B] font-bold'>
								{egg_groups.map((eg) => eg.name).join(', ')}
							</p>
						</div> : null
					}
					{
						hatch_counter && <div className='flex flex-wrap items-center justify-center gap-2'>
							<p className='text-xs font-bold'>Egg cycles:</p>
							<p className='text-xs text-[#7B7B7B] font-bold'>
								{hatch_counter + ` cycles (${hatch_counter * 256} steps)`}
							</p>
						</div>
					}
				</div>
			</div>
			<div className='flex flex-col justify-center items-center gap-4 xs:shadow-lg shadow rounded-lg py-5'>
				<p className='font-bold'>Training</p>
				<div className='flex flex-wrap justify-center items-center gap-2'>
					<div className='flex flex-wrap items-center justify-center gap-2'>
						<p className='text-xs font-bold'>Catch Rate</p>
						<p className='text-xs text-[#7B7B7B] font-bold'>
							{((capture_rate * 100) / 255).toFixed(1)}%
						</p>
					</div>
					{
						base_experience && <div className='flex flex-wrap items-center justify-center gap-2'>
							<p className='text-xs font-bold'>Base exp.</p>
							<p className='text-xs text-[#7B7B7B] font-bold'>{base_experience}</p>
						</div>
					}
					{
						growth_rate && <div className='flex flex-wrap items-center justify-center gap-2'>
							<p className='text-xs font-bold'>Growth rate</p>
							<p className='text-xs text-[#7B7B7B] font-bold'>
								{growth_rate.name.split('-').join(', ')}
							</p>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

export default BasicInfo
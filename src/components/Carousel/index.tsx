import React, { useState } from 'react'
import { Tooltip as MuiTip } from '@mui/material'

type Props = {
	data: string[]
}

const Carousel = ({ data }: Props) => {
	const [index, setIndex] = useState(0)

	return (
		<div className='w-full h-full flex flex-col items-center xs:px-10 px-5'>
			<div className='w-full my-auto flex overflow-hidden'>
				{
					data.map((d, i) => (
						<div
							key={i}
							className='min-w-full flex'
							style={{
								transform: `translateX(-${index * 100}%)`,
								transition: 'transform .5s'
							}}
						>
							<p className='text-sm text-center font-bold md:my-auto my-8'>
								{d}
							</p>
						</div>
					))
				}
			</div>
			<div className='flex gap-4 md:my-auto my-8'>
				{
					data.map((d, i) => (
						<MuiTip
							key={i}
							title={d.slice(0, 20) + '...'}
							placement='top'
						>
							<div
								className={`
											h-3 w-3 rounded-[50%] cursor-pointer
											${i == index ? 'bg-white border-2 border-solid border-black' : 'bg-black'}
										`}
								onClick={() => setIndex(i)}
							/>
						</MuiTip>
					))
				}
			</div>
		</div>
	)
}

export default Carousel
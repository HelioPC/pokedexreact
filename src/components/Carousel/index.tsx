import React, { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'

type Props = {
	data: string[]
}

const Carousel = ({ data }: Props) => {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		if (data.length < 2) return
		let timer: number | undefined
		if (index < data.length - 1) {
			timer = setInterval(() => setIndex(index + 1), 5000)
		} else {
			setIndex(0)
		}
		return () => {
			clearInterval(timer)
		}
	}, [index])

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
					data.length > 1 ? data.map((d, i) => (
						<div
							key={i}
							data-tooltip-id={i.toString()}
							className={`
								h-3 w-3 rounded-[50%] cursor-pointer
								${i == index ? 'bg-white border-2 border-solid border-black' : 'bg-black'}
							`}
							onClick={() => setIndex(i)}
						/>
					)) : null
				}
				{
					data.length > 1 ? data.map((d, i) => (
						<Tooltip
							key={i}
							id={i.toString()}
							content={d.slice(0, 20) + '...'}
							place='top'
							style={{
								fontSize: '10px',
								padding: '4px',
								backgroundColor: '#666666'
							}}
						/>
					)) : null
				}
			</div>
		</div>
	)
}

export default Carousel
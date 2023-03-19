import React, { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'

type Props = {
	data: string[]
}

const Carousel = ({ data }: Props) => {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		setInterval(increment, 7000)
		const stop = data.length
		let i = 0

		function increment() {
			i = i + 1

			if (i === stop) {
				i = 0
			}

			setIndex(i)
		}
	}, [])

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
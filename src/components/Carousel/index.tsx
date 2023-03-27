import React, { useEffect, useState } from 'react'

type Props = {
	children: JSX.Element[]
	id: string
}

const Carousel = ({ children, id }: Props) => {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		if (children.length < 2) return

		let timer: number | undefined

		if (index <= children.length - 1) {
			timer = setInterval(() => setIndex(index + 1), 6500)
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
					children.map((child, i) => (
						<div
							key={i}
							className='min-w-full'
							style={{
								transform: `translateX(-${index * 100}%)`,
								transition: 'transform .5s'
							}}
						>
							{child}
						</div>
					))
				}
			</div>
			<div className='flex gap-4 md:my-auto my-8'>
				{
					children.length > 1 ? children.map((_, i) => (
						<div
							key={i}
							data-tooltip-id={i.toString() + id}
							className={`
								h-3 w-3 rounded-[50%] cursor-pointer
								${i == index ? 'bg-white border-2 border-solid border-black' : 'bg-black'}
							`}
							onClick={() => setIndex(i)}
						/>
					)) : null
				}
			</div>
		</div>
	)
}

export default Carousel
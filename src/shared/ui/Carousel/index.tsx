import React, { useEffect, useState } from 'react'
import { useAppTheme } from '../../../app/providers/ThemeContext'

type Props = {
	children: JSX.Element[]
	id: string
}

const Carousel = ({ children, id }: Props) => {
	const [index, setIndex] = useState(0)
	const { theme } = useAppTheme()

	useEffect(() => {
		if (children.length < 2) return

		if (index >= children.length) {
			setIndex(0)
			return
		}

		const timer = window.setInterval(() => {
			setIndex((current) => (current + 1) % children.length)
		}, 6500)

		return () => {
			window.clearInterval(timer)
		}
	}, [index, children.length])

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
						<button
							type='button'
							key={i}
							aria-label={`Go to slide ${i + 1}`}
							data-tooltip-id={i.toString() + id}
							className={`
								h-3 w-3 rounded-[50%] cursor-pointer
								border-2 border-black border-solid
								${i == index ? 'bg-white' : 'bg-black'}
							`}
							style={{
								backgroundColor: `${i == index ? theme.colors.textPrimary : theme.colors.mainBg}`,
							}}
							onClick={() => setIndex(i)}
						/>
					)) : null
				}
			</div>
		</div>
	)
}

export default Carousel

import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { motion, LayoutGroup } from 'framer-motion'

type Props = {
	id: string
	layoutId01: string
	layoutId02: string
	classProps01: string
	classProps02: string
	children1: JSX.Element
	children2: JSX.Element
}

const AnimatedCard = ({ id, layoutId01, layoutId02, classProps01, classProps02, children1, children2 }: Props) => {
	const [open, setOpen] = useState(false)

	return (
		<LayoutGroup id={id}>
			{
				open ? (
					<motion.div
						layoutId={layoutId02}
						className={classProps02}
					>
						<MdClose
							className='absolute right-5 top-4 cursor-pointer'
							onClick={() => setOpen(!open)}
						/>
						{children2}
					</motion.div>
				) : (
					<motion.div
						layoutId={layoutId01}
						className={classProps01 + ' cursor-pointer'}
						onClick={() => setOpen(!open)}
					>
						{children1}
					</motion.div>
				)
			}
		</LayoutGroup>
	)
}

export default AnimatedCard
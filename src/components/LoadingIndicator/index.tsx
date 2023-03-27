import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

type Props = {
	promiseInProgress: boolean
}

const LoadingIndicator = ({ promiseInProgress }: Props) => {
	return (
		promiseInProgress ?
			(
				<ThreeDots
					height='80'
					width='80'
					radius='9'
					color='#282936'
					ariaLabel='three-dots-loading'
					wrapperStyle={{}}
					visible={true}
				/>
			) : (
				<div className='hidden' />
			)
	)
}

export default LoadingIndicator

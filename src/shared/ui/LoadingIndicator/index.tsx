import React from 'react'

type Props = {
	promiseInProgress: boolean
}

const LoadingIndicator = ({ promiseInProgress }: Props) => {
	if (!promiseInProgress) {
		return <div className='hidden' />
	}

	return (
		<div
			className='flex items-center justify-center py-4'
			role='status'
			aria-label='Loading'
		>
			<span className='loading-dots' aria-hidden />
		</div>
	)
}

export default LoadingIndicator

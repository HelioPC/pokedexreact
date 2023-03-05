import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Detail = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!location.state?.fromApp) {
			navigate('/')
		}
	}, [])

	return (
		<div>Detail</div>
	)
}

export default Detail
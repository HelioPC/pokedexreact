import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DetailCardComponent from './components/DetailCardComponent'

import * as D from './style'
import 'react-tooltip/dist/react-tooltip.css'

const Detail = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!location.state) {
			navigate('/')
			return
		} else {
			if (!location.state.fromApp) {
				navigate('/')
			}
			if (!location.state.pokemon) {
				navigate('/')
			}
		}
	}, [])

	return (
		location.state?.pokemon ? (
			<D.DetailScreen>
				<DetailCardComponent pokemon={location.state.pokemon} />
			</D.DetailScreen>
		) : (
			<div>Erro</div>
		)
	)
}

export default Detail

import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import DetailCardComponent from './DetailCardComponent'
import NotFoundPage from '../../not-found/NotFoundPage'
import { Pokemon, pokemonRepository } from '../../../data/pokeapi'
import LoadingIndicator from '../../../shared/ui/LoadingIndicator'
import * as D from './style'
import 'react-tooltip/dist/react-tooltip.css'

type LocationState = {
	pokemon?: Pokemon
}

const DetailPage = () => {
	const { id } = useParams()
	const location = useLocation()
	const statePokemon = (location.state as LocationState | null)?.pokemon
	const [pokemon, setPokemon] = useState<Pokemon | undefined>()
	const [loading, setLoading] = useState(true)
	const [notFound, setNotFound] = useState(false)

	useEffect(() => {
		if (!id) {
			setNotFound(true)
			setLoading(false)
			return
		}

		if (statePokemon && String(statePokemon.id) === id) {
			setPokemon(statePokemon)
			setNotFound(false)
			setLoading(false)
			return
		}

		const controller = new AbortController()
		setLoading(true)
		setNotFound(false)

		pokemonRepository.getPokemon(id, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setPokemon(data)
					setLoading(false)
				}
			})
			.catch(() => {
				if (!controller.signal.aborted) {
					setPokemon(undefined)
					setNotFound(true)
					setLoading(false)
				}
			})

		return () => controller.abort()
	}, [id, statePokemon])

	if (loading) {
		return (
			<D.DetailScreen>
				<div className='w-full min-h-screen flex justify-center items-center'>
					<LoadingIndicator promiseInProgress />
				</div>
			</D.DetailScreen>
		)
	}

	if (notFound || !pokemon) {
		return <NotFoundPage />
	}

	return (
		<D.DetailScreen>
			<DetailCardComponent pokemon={pokemon} />
		</D.DetailScreen>
	)
}

export default DetailPage

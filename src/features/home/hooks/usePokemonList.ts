import { useCallback, useEffect, useRef, useState } from 'react'
import { Pokemon, PokemonName, pokemonRepository } from '../../../data/pokeapi'
import { POKEMON_LIST_LIMIT, POKEMONS_PER_PAGE, SEARCH_RESULT_LIMIT } from '../../../shared/lib/constants'
import {
	filterPokemonNamesByQuery,
	filterPokemonsByQuery,
	typeQueriesFrom,
} from '../domain/filterPokemonsByQuery'

const uniqueById = (pokemons: Pokemon[]): Pokemon[] => {
	const map = new Map<number, Pokemon>()
	for (const pokemon of pokemons) {
		map.set(pokemon.id, pokemon)
	}
	return Array.from(map.values())
}

export const usePokemonList = () => {
	const [allPokemonNames, setAllPokemonNames] = useState<PokemonName[]>([])
	const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [loading, setLoading] = useState(false)
	const [listError, setListError] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [searchResults, setSearchResults] = useState<Pokemon[] | null>(null)
	const [searching, setSearching] = useState(false)
	const sentinelRef = useRef<HTMLDivElement | null>(null)
	const loadingRef = useRef(false)
	const currentIndexRef = useRef(0)
	const namesRef = useRef<PokemonName[]>([])

	currentIndexRef.current = currentIndex
	namesRef.current = allPokemonNames

	const loadMorePokemons = useCallback(async (signal?: AbortSignal) => {
		if (loadingRef.current) return

		const names = namesRef.current
		const start = currentIndexRef.current
		if (start >= names.length) return

		loadingRef.current = true
		setLoading(true)
		setListError(null)

		try {
			const nextBatch = names.slice(start, start + POKEMONS_PER_PAGE)
			const detailedData = await Promise.all(
				nextBatch.map((pokemon) => pokemonRepository.getPokemon(
					pokemon.name,
					signal,
				))
			)

			if (signal?.aborted) return

			setDisplayedPokemons((prev) => [...prev, ...detailedData])
			setCurrentIndex((prev) => prev + POKEMONS_PER_PAGE)
		} catch (error) {
			if (signal?.aborted) return
			setListError('Could not load Pokémon. Try again by scrolling.')
		} finally {
			loadingRef.current = false
			if (!signal?.aborted) {
				setLoading(false)
			}
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()

		const fetchAllNames = async () => {
			try {
				const results = await pokemonRepository.getPokemonList(POKEMON_LIST_LIMIT, controller.signal)
				setAllPokemonNames(results)
			} catch {
				if (!controller.signal.aborted) {
					setListError('Could not load the Pokémon list.')
				}
			}
		}

		fetchAllNames()
		return () => controller.abort()
	}, [])

	useEffect(() => {
		if (allPokemonNames.length === 0 || displayedPokemons.length > 0) return

		const controller = new AbortController()
		loadMorePokemons(controller.signal)
		return () => controller.abort()
	}, [allPokemonNames, displayedPokemons.length, loadMorePokemons])

	useEffect(() => {
		const trimmed = query.trim()
		if (trimmed.length === 0) {
			setSearchResults(null)
			setSearching(false)
			return
		}

		const controller = new AbortController()
		const handle = window.setTimeout(async () => {
			setSearching(true)
			try {
				const localMatches = filterPokemonsByQuery(trimmed, displayedPokemons)
				const nameMatches = filterPokemonNamesByQuery(trimmed, allPokemonNames)
				const typeNames = typeQueriesFrom(trimmed)

				const typePokemon = await Promise.all(
					typeNames.map(async (typeName) => {
						const type = await pokemonRepository.getType(typeName, controller.signal)
						return type.pokemon.slice(0, SEARCH_RESULT_LIMIT).map((entry) => entry.pokemon)
					})
				)

				const toFetch = [
					...nameMatches,
					...typePokemon.flat(),
				].filter((entry, index, self) => self.findIndex((item) => item.name === entry.name) === index)
					.slice(0, SEARCH_RESULT_LIMIT)

				const fetched = await Promise.all(
					toFetch.map((entry) => pokemonRepository.getPokemon(entry.name, controller.signal))
				)

				if (controller.signal.aborted) return
				setSearchResults(uniqueById([...localMatches, ...fetched]))
			} catch {
				if (!controller.signal.aborted) {
					setSearchResults(filterPokemonsByQuery(trimmed, displayedPokemons))
				}
			} finally {
				if (!controller.signal.aborted) setSearching(false)
			}
		}, 300)

		return () => {
			controller.abort()
			window.clearTimeout(handle)
		}
	}, [query, displayedPokemons, allPokemonNames])

	const isSearching = query.trim().length > 0
	const pokemons = isSearching ? (searchResults ?? []) : displayedPokemons
	const hasMore = !isSearching && currentIndex < allPokemonNames.length

	useEffect(() => {
		if (!hasMore || loading) return

		const node = sentinelRef.current
		if (!node) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					loadMorePokemons()
				}
			},
			{ rootMargin: '200px' },
		)

		observer.observe(node)
		return () => observer.disconnect()
	}, [hasMore, loading, loadMorePokemons, pokemons.length])

	return {
		query,
		setQuery,
		pokemons,
		loading: loading || searching,
		listError,
		hasMore,
		sentinelRef,
		isSearching,
	}
}

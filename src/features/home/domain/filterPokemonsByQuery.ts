import { Pokemon, PokemonName } from '../../../data/pokeapi/types'
import { formatPokemonNumber } from '../../../shared/lib/formatPokemonNumber'
import { pokemonIdFromResourceUrl } from '../../../shared/lib/pokemonIdFromResourceUrl'
import { POKEMON_TYPES } from '../../../shared/lib/constants'

const splitQuery = (query: string): string[] =>
	query
		.split(',')
		.map((part) => part.trim())
		.filter((part) => part.length > 0)

export const isPokemonTypeQuery = (value: string): boolean =>
	POKEMON_TYPES.includes(value.toLowerCase() as (typeof POKEMON_TYPES)[number])

export const filterPokemonsByQuery = (query: string, pokemons: Pokemon[]): Pokemon[] => {
	if (query.trim().length === 0) return pokemons

	const params = splitQuery(query)
	const matches = new Map<number, Pokemon>()

	for (const param of params) {
		const lower = param.toLowerCase()

		for (const pokemon of pokemons) {
			const byName = pokemon.name.toLowerCase().includes(lower)
			const byId = formatPokemonNumber(pokemon.id).includes(param) || String(pokemon.id) === param
			const byType = pokemon.types.some((t) => t.type.name.toLowerCase() === lower)

			if (byName || byId || byType) {
				matches.set(pokemon.id, pokemon)
			}
		}
	}

	return Array.from(matches.values())
}

export const filterPokemonNamesByQuery = (query: string, names: PokemonName[]): PokemonName[] => {
	if (query.trim().length === 0) return names

	const params = splitQuery(query).filter((param) => !isPokemonTypeQuery(param))
	const matches = new Map<string, PokemonName>()

	for (const param of params) {
		const lower = param.toLowerCase()

		for (const entry of names) {
			const id = pokemonIdFromResourceUrl(entry.url)
			const padded = formatPokemonNumber(Number(id))
			const byName = entry.name.toLowerCase().includes(lower)
			const byId = padded.includes(param) || id === param

			if (byName || byId) {
				matches.set(entry.name, entry)
			}
		}
	}

	return Array.from(matches.values())
}

export const typeQueriesFrom = (query: string): string[] =>
	splitQuery(query)
		.map((param) => param.toLowerCase())
		.filter(isPokemonTypeQuery)

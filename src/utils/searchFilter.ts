import { formatNumber } from '../helpers/numbers'
import { Pokemon } from '../types/core'

export const handlePokemonsFilterByQuery = (query: string, pokemons: Pokemon[]): Pokemon[] => {
	if (query.length == 0) return pokemons

	const filteredPokemons: Pokemon[] = []
	const params = query.split(',').sort((a, b) => a > b ? 1 : -1)
	
	params.map((s) => {
		pokemons.filter(
			(p) =>
				p.name.toLowerCase().includes(s.toLowerCase()) ||
				formatNumber(p.id).includes(s) ||
				p.types.find((t) => t.type.name == s) != undefined
		).map((f) => filteredPokemons.push(f))
	})

	return filteredPokemons
}

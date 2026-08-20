import { describe, expect, it } from 'vitest'
import { pokemonIdFromResourceUrl } from './pokemonIdFromResourceUrl'

describe('pokemonIdFromResourceUrl', () => {
	it('reads the id from a species url', () => {
		expect(pokemonIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon-species/133/'))
			.toBe('133')
	})

	it('reads the id from a pokemon url without trailing slash', () => {
		expect(pokemonIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon/25'))
			.toBe('25')
	})

	it('throws on a url without an id segment', () => {
		expect(() => pokemonIdFromResourceUrl('https://pokeapi.co/api/v2/')).toThrow()
	})
})

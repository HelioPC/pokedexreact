import { describe, expect, it } from 'vitest'
import { Pokemon, PokemonName } from '../../../data/pokeapi/types'
import {
	filterPokemonNamesByQuery,
	filterPokemonsByQuery,
	isPokemonTypeQuery,
	typeQueriesFrom,
} from './filterPokemonsByQuery'

const pikachu = {
	id: 25,
	name: 'pikachu',
	types: [{ type: { name: 'electric', url: '' } }],
} as Pokemon

const charizard = {
	id: 6,
	name: 'charizard',
	types: [
		{ type: { name: 'fire', url: '' } },
		{ type: { name: 'flying', url: '' } },
	],
} as Pokemon

describe('filterPokemonsByQuery', () => {
	it('returns the full list when the query is empty', () => {
		expect(filterPokemonsByQuery('  ', [pikachu, charizard])).toEqual([pikachu, charizard])
	})

	it('matches by name, padded id and type without duplicates', () => {
		const result = filterPokemonsByQuery('pika, 0025, electric', [pikachu, charizard])
		expect(result).toEqual([pikachu])
	})

	it('matches a type across several pokemon', () => {
		const result = filterPokemonsByQuery('fire', [pikachu, charizard])
		expect(result).toEqual([charizard])
	})
})

describe('filterPokemonNamesByQuery', () => {
	const names: PokemonName[] = [
		{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
		{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
	]

	it('matches name and id, ignoring type tokens', () => {
		expect(filterPokemonNamesByQuery('pika, fire', names)).toEqual([names[1]])
	})
})

describe('type query helpers', () => {
	it('detects known types', () => {
		expect(isPokemonTypeQuery('Fire')).toBe(true)
		expect(isPokemonTypeQuery('pika')).toBe(false)
	})

	it('extracts type tokens from a comma-separated query', () => {
		expect(typeQueriesFrom('pika, fire, water')).toEqual(['fire', 'water'])
	})
})

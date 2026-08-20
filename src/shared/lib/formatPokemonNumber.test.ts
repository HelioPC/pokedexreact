import { describe, expect, it } from 'vitest'
import { formatPokemonNumber } from './formatPokemonNumber'

describe('formatPokemonNumber', () => {
	it('pads ids below 10 with three zeros', () => {
		expect(formatPokemonNumber(1)).toBe('0001')
	})

	it('pads ids below 100 with two zeros', () => {
		expect(formatPokemonNumber(25)).toBe('0025')
	})

	it('pads ids below 1000 with one zero', () => {
		expect(formatPokemonNumber(151)).toBe('0151')
	})

	it('does not pad ids from 1000', () => {
		expect(formatPokemonNumber(1008)).toBe('1008')
	})
})

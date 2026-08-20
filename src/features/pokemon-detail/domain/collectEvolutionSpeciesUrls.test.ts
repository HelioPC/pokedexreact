import { describe, expect, it } from 'vitest'
import { EvolutionChainLink } from '../../../data/pokeapi/types'
import { collectEvolutionSpeciesUrls } from './collectEvolutionSpeciesUrls'

const link = (url: string, evolvesTo: EvolutionChainLink[] = []): EvolutionChainLink => ({
	species: { name: url, url },
	evolves_to: evolvesTo,
})

describe('collectEvolutionSpeciesUrls', () => {
	it('walks a linear chain', () => {
		const chain = link('1/', [link('2/', [link('3/')])])
		expect(collectEvolutionSpeciesUrls(chain)).toEqual(['1/', '2/', '3/'])
	})

	it('includes every branch (e.g. Eevee)', () => {
		const chain = link('133/', [
			link('134/'),
			link('135/'),
			link('136/'),
		])
		expect(collectEvolutionSpeciesUrls(chain)).toEqual(['133/', '134/', '135/', '136/'])
	})

	it('includes later stages on non-first branches (Gloom)', () => {
		const chain = link('43/', [
			link('44/', [link('45/'), link('182/')]),
		])
		expect(collectEvolutionSpeciesUrls(chain)).toEqual(['43/', '44/', '45/', '182/'])
	})
})

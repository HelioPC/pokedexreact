import { describe, expect, it } from 'vitest'
import { collectEnglishFlavorTexts, pairFlavorTexts } from './flavorText'

describe('collectEnglishFlavorTexts', () => {
	it('keeps unique english entries, normalized, up to the cap', () => {
		const entries = [
			{ flavor_text: 'ONE', language: { name: 'en' } },
			{ flavor_text: 'uno', language: { name: 'es' } },
			{ flavor_text: 'One', language: { name: 'en' } },
			{ flavor_text: 'TWO', language: { name: 'en' } },
		]

		expect(collectEnglishFlavorTexts(entries, 11)).toEqual(['One', 'Two'])
	})
})

describe('pairFlavorTexts', () => {
	it('pairs consecutive texts and keeps a trailing odd one', () => {
		expect(pairFlavorTexts(['a', 'b', 'c'])).toEqual(['a b', 'c'])
	})

	it('returns an empty list for no texts', () => {
		expect(pairFlavorTexts([])).toEqual([])
	})
})

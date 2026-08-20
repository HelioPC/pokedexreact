import { describe, expect, it } from 'vitest'
import { englishAbilityDescription } from './englishAbilityDescription'

describe('englishAbilityDescription', () => {
	it('returns the english effect', () => {
		expect(englishAbilityDescription({
			name: 'static',
			effect_entries: [
				{ effect: 'paraliza', language: { name: 'es' } },
				{ effect: 'May paralyze', language: { name: 'en' } },
			],
		})).toBe('May paralyze')
	})

	it('returns undefined when there is no english entry', () => {
		expect(englishAbilityDescription({
			name: 'static',
			effect_entries: [{ effect: 'paraliza', language: { name: 'es' } }],
		})).toBeUndefined()
	})
})

import { describe, expect, it } from 'vitest'
import { describeGender } from './describeGender'

describe('describeGender', () => {
	it('treats -1 as genderless', () => {
		expect(describeGender(-1)).toEqual({ kind: 'genderless' })
	})

	it('treats 0 as always male', () => {
		expect(describeGender(0)).toEqual({
			kind: 'ratio',
			malePercent: 100,
			femalePercent: 0,
		})
	})

	it('treats 8 as always female', () => {
		expect(describeGender(8)).toEqual({
			kind: 'ratio',
			malePercent: 0,
			femalePercent: 100,
		})
	})

	it('computes mixed ratios from gender_rate', () => {
		expect(describeGender(1)).toEqual({
			kind: 'ratio',
			malePercent: 87.5,
			femalePercent: 12.5,
		})
	})
})

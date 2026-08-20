export type GenderDescription =
	| { kind: 'genderless' }
	| { kind: 'ratio'; malePercent: number; femalePercent: number }

export const describeGender = (genderRate: number): GenderDescription => {
	if (genderRate === -1) {
		return { kind: 'genderless' }
	}

	return {
		kind: 'ratio',
		malePercent: 12.5 * (8 - genderRate),
		femalePercent: 12.5 * genderRate,
	}
}

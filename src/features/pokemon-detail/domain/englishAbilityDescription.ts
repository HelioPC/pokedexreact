import { Ability } from '../../../data/pokeapi/types'

export const englishAbilityDescription = (ability: Ability): string | undefined =>
	ability.effect_entries.find((entry) => entry.language.name === 'en')?.effect

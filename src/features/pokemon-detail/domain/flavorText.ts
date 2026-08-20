import { Species } from '../../../data/pokeapi/types'

export const collectEnglishFlavorTexts = (
	entries: Species['flavor_text_entries'],
	max = 11,
): string[] => {
	const seen = new Set<string>()
	const result: string[] = []

	for (const entry of entries) {
		if (entry.language.name !== 'en') continue

		const normalized = entry.flavor_text.charAt(0).toUpperCase() + entry.flavor_text.slice(1).toLowerCase()
		if (seen.has(normalized)) continue

		seen.add(normalized)
		result.push(normalized)
		if (result.length >= max) break
	}

	return result
}

export const pairFlavorTexts = (texts: string[]): string[] => {
	if (texts.length === 0) return []

	const pairs: string[] = []
	for (let i = 0; i < texts.length - 1; i += 2) {
		pairs.push(`${texts[i]} ${texts[i + 1]}`)
	}

	if (texts.length % 2 === 1) {
		pairs.push(texts[texts.length - 1])
	}

	return pairs
}

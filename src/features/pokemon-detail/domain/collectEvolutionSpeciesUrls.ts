import { EvolutionChainLink } from '../../../data/pokeapi/types'

export const collectEvolutionSpeciesUrls = (chain: EvolutionChainLink): string[] => {
	const urls: string[] = []
	const queue: EvolutionChainLink[] = [chain]

	while (queue.length > 0) {
		const node = queue.shift()
		if (!node) continue

		urls.push(node.species.url)
		queue.push(...node.evolves_to)
	}

	return urls
}

export const pokemonIdFromResourceUrl = (url: string): string => {
	const path = new URL(url).pathname.replace(/\/+$/, '')
	const id = path.split('/').pop()

	if (!id || !/^\d+$/.test(id)) {
		throw new Error('Invalid Pokémon resource URL')
	}

	return id
}

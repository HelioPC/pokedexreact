import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2/'
const POKEMON_URL = 'pokemon/'
const POKEMON_SPECIES_URL = 'pokemon-species/'

type CustomReturn = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
	status: number
	error: string
}

export const api = {
	getPokemon: async (id: string) => {
		return await axios.get(`${BASE_URL}${POKEMON_URL}${id}`)
	},
	getPokemons: async (limit?: number) => {
		const size = limit ?? 10000

		return await axios.get(`${BASE_URL}${POKEMON_URL}?limit=${size}`)
	},
	getPokemonSpecies: async (id: string) => {
		return await axios.get(`${BASE_URL}${POKEMON_SPECIES_URL}${id}`)
	},
	getPokemonEvolutionChain: async (url: string): Promise<CustomReturn> => {
		if(!url.includes(BASE_URL)) return { data: null, status: 404, error: 'Invalid url' }

		const response = await axios.get(url)

		if(response.status != 200) return { data: null, status: 404, error: 'Bad response' }

		return { data: response.data, status: 200, error: '' }
	}
}

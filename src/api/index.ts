import axios from 'axios'

const BASE_URL = 'https://pokeapi.co/api/v2/'
const POKEMON_URL = 'pokemon/'
const POKEMON_SPECIES_URL = 'pokemon-species/'

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
}

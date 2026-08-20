import axios, { AxiosInstance } from 'axios'
import {
	Ability,
	EvolutionChainResponse,
	Pokemon,
	PokemonName,
	Species,
	Type,
} from './types'

export const BASE_URL = 'https://pokeapi.co/api/v2/'
export const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'

const assertPokeApiUrl = (url: string) => {
	if (!url.startsWith(BASE_URL) && !url.startsWith('https://pokeapi.co/api/v2/')) {
		throw new Error('Invalid PokeAPI url')
	}
}

export type PokemonRepository = {
	getPokemonList: (limit?: number, signal?: AbortSignal) => Promise<PokemonName[]>
	getPokemon: (idOrName: string, signal?: AbortSignal) => Promise<Pokemon>
	getSpecies: (id: string | number, signal?: AbortSignal) => Promise<Species>
	getType: (urlOrName: string, signal?: AbortSignal) => Promise<Type>
	getAbility: (url: string, signal?: AbortSignal) => Promise<Ability>
	getEvolutionChain: (url: string, signal?: AbortSignal) => Promise<EvolutionChainResponse>
}

const createClient = (): AxiosInstance => axios.create({ baseURL: BASE_URL })

export const createPokemonRepository = (client: AxiosInstance = createClient()): PokemonRepository => ({
	async getPokemonList(limit = 916, signal) {
		const { data } = await client.get<{ results: PokemonName[] }>('pokemon/', {
			params: { limit },
			signal,
		})
		return data.results
	},

	async getPokemon(idOrName, signal) {
		const { data } = await client.get<Pokemon>(`pokemon/${idOrName}`, { signal })
		return data
	},

	async getSpecies(id, signal) {
		const { data } = await client.get<Species>(`pokemon-species/${id}`, { signal })
		return data
	},

	async getType(urlOrName, signal) {
		if (urlOrName.startsWith('http')) {
			assertPokeApiUrl(urlOrName)
			const { data } = await client.get<Type>(urlOrName, { signal })
			return data
		}

		const { data } = await client.get<Type>(`type/${urlOrName}`, { signal })
		return data
	},

	async getAbility(url, signal) {
		assertPokeApiUrl(url)
		const { data } = await client.get<Ability>(url, { signal })
		return data
	},

	async getEvolutionChain(url, signal) {
		assertPokeApiUrl(url)
		const { data } = await client.get<EvolutionChainResponse>(url, { signal })
		return data
	},
})

export const pokemonRepository = createPokemonRepository()

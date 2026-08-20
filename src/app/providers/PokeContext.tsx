import React, { createContext, ReactNode, useContext, useReducer } from 'react'
import { Pokemon, Species } from '../../data/pokeapi'

type PokemonDetailInfo = {
	id: number
	species: Species
	evolution_chain: Pokemon[]
	descriptions: string[]
}

type State = {
	pokemonsDetailInfo: PokemonDetailInfo[]
}

type Action =
	| { type: 'upsertDetail'; payload: Partial<PokemonDetailInfo> & { id: number } }

type ContextType = {
	state: State
	dispatch: (action: Action) => void
}

type PokeProviderProps = {
	children: ReactNode
}

const initialData: State = {
	pokemonsDetailInfo: [],
}

const PokeContext = createContext<ContextType | undefined>(undefined)

const upsertDetail = (list: PokemonDetailInfo[], payload: Action['payload']): PokemonDetailInfo[] => {
	const index = list.findIndex((item) => item.id === payload.id)
	if (index === -1) {
		return [
			...list,
			{
				id: payload.id,
				species: payload.species as Species,
				evolution_chain: payload.evolution_chain ?? [],
				descriptions: payload.descriptions ?? [],
			},
		]
	}

	return list.map((item, i) => i === index ? { ...item, ...payload } : item)
}

const pokeReducer = (state: State, action: Action): State => {
	switch (action.type) {
	case 'upsertDetail':
		return { ...state, pokemonsDetailInfo: upsertDetail(state.pokemonsDetailInfo, action.payload) }
	default:
		return state
	}
}

export const PokeProvider = ({ children }: PokeProviderProps) => {
	const [state, dispatch] = useReducer(pokeReducer, initialData)
	const value = { state, dispatch }

	return (
		<PokeContext.Provider value={value}>
			{children}
		</PokeContext.Provider>
	)
}

export const usePokeContext = () => {
	const context = useContext(PokeContext)
	if (context === undefined) {
		throw new Error('usePokeContext must be used within a PokeProvider')
	}
	return context
}

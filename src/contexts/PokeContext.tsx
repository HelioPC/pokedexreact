/* eslint-disable @typescript-eslint/no-explicit-any */
// Context, Reducer, Provider, Hook
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'
import { Pokemon, Species } from '../types/core'

type State = {
    pokemons: Pokemon[]
	pokemonsDetailInfo: {
		id: number
		species: Species
		evolution_chain: Pokemon[]
		descriptions: string[]
	}[]
}

type Action = {
    type: PokeContextActions;
    payload: any;
}

type ContextType = {
    state: State;
    dispatch: (action: Action) => void;
}

type PokeProviderProps = {
    children: ReactNode;
}

const initialData: State = {
	pokemons: [],
	pokemonsDetailInfo: []
}

// Context
const PokeContext = createContext<ContextType | undefined>(undefined)

// Reducer
export enum PokeContextActions {
    setPokemon,
    setPokemons,
	setPokemonDetailInfo,
	setPokemonsDetailInfo,
    clearPokemons
}

const pokeReducer = (state: State, action: Action) => {
	switch (action.type) {
	case PokeContextActions.setPokemon:
		return { ...state, pokemons: [...state.pokemons, action.payload] }
	case PokeContextActions.setPokemons:
		return { ...state, pokemons: action.payload }
	case PokeContextActions.setPokemonDetailInfo:
		return { ...state, pokemonsDetailInfo: [...state.pokemonsDetailInfo, action.payload] }
	case PokeContextActions.setPokemonsDetailInfo:
		return { ...state, pokemonsDetailInfo: action.payload }
	case PokeContextActions.clearPokemons:
		return initialData
	default:
		return state
	}
}

// Provider
export const PokeProvider = ({ children }: PokeProviderProps) => {
	const [state, dispatch] = useReducer(pokeReducer, initialData)
	const value = { state, dispatch }

	useEffect(() => { console.log(state) }, [state])

	return (
		<PokeContext.Provider value={value} >
			{children}
		</PokeContext.Provider>
	)
}

// Context Hook
export const usePokeContext = () => {
	const context = useContext(PokeContext)
	if (context === undefined) {
		throw new Error('useForm precisa ser usado dentro do FormProvider')
	}
	return context
}
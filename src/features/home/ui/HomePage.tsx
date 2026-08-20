import React from 'react'
import { MdOutlineSearch } from 'react-icons/md'
import * as H from './style'
import PokemonCard from '../../../shared/ui/PokemonCard'
import LoadingIndicator from '../../../shared/ui/LoadingIndicator'
import { useAppTheme } from '../../../app/providers/ThemeContext'
import ThemeSwitcher from '../../../shared/ui/ThemeSwitcher'
import { PageSeo } from '../../../shared/seo/PageSeo'
import { usePokemonList } from '../hooks/usePokemonList'

const HomePage = () => {
	const { theme, switchTheme } = useAppTheme()
	const {
		query,
		setQuery,
		pokemons,
		loading,
		listError,
		hasMore,
		sentinelRef,
		isSearching,
	} = usePokemonList()

	return (
		<H.HomeScreen theme={{ theme: theme, switchTheme: switchTheme }}>
			<PageSeo
				title='Pokédex'
				description='Browse Pokémon, search by name, id or type, and open shareable detail pages.'
				path='/'
			/>
			<div className='absolute top-2 right-10'>
				<ThemeSwitcher />
			</div>

			<main>
				<h1 className='sr-only'>Pokédex</h1>
				<H.HomeInputArea>
					<div>
						<MdOutlineSearch
							size={24}
							className='mr-2 ml-5'
							aria-hidden
						/>
						<input
							type='search'
							id='pokemon-search'
							aria-label='Find Pokémon by name, id or type'
							placeholder='Find by name, id or type'
							value={query}
							onChange={(event) => setQuery(event.target.value)}
						/>
					</div>
				</H.HomeInputArea>

				{pokemons.length !== 0 ? (
					<H.HomeMain>
						<H.HomeGrid length={pokemons.length}>
							{pokemons.map((p) => (
								<PokemonCard key={p.id} name={p.name} pokeData={p} />
							))}
						</H.HomeGrid>
					</H.HomeMain>
				) : (
					<div className='w-full flex flex-col gap-5 justify-center items-center mt-5'>
						{!loading && <div>{isSearching ? 'No Pokémon found' : 'No pokemons'}</div>}
						<LoadingIndicator promiseInProgress={loading && pokemons.length === 0} />
					</div>
				)}

				{listError ? (
					<p className='text-center text-sm my-3' role='alert'>{listError}</p>
				) : null}

				<div
					ref={sentinelRef}
					className='w-full flex justify-center items-center my-3 min-h-[48px]'
					aria-live='polite'
				>
					<LoadingIndicator promiseInProgress={loading && hasMore} />
				</div>
			</main>
		</H.HomeScreen>
	)
}

export default HomePage

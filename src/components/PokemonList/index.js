import axios from 'axios';
import React, { Component } from 'react';

import PokemonCard from '../PokemonCard';

export default class PokemonList extends Component {
	state = {
		url: 'https://pokeapi.co/api/v2/pokemon?limit=949',
		pokemon: null
	};

	async componentDidMount() {
		const res = await axios.get(this.state.url);
		this.setState({ pokemon: res.data['results'] });
	}

	render() {
		return (
			<React.Fragment>
				{this.state.pokemon ?
					(
					<div className='row'>
						{this.state.pokemon.map((pokemon, key) => (
							<PokemonCard
								key={key}
								name={pokemon.name}
								url={pokemon.url}
							/>
						))}
					</div>
					)
					:
					(<h1>Loading Pokemons</h1>)
				}
			</React.Fragment>
		)
	}
}

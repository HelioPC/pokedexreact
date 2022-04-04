import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Sprite = styled.img`
	width: 5em;
	height: 5em;
`

const Card = styled.div`
	box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24);
	transition: all .3s cubic-bezier(.25, .8, .25, 1);
	cursor: pointer;
	user-select: none;
	-website-user-select: none;
	-o-user-select: none;
	-moz-user-select: none;
	-webkit-user-drag: none;
	
	&:hover {
		box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);
		transform: scale(1.05);
	}
`

const StyledLink = styled(Link)`
	text-decoration: none;
	color: black;

	&:focus,
	&:hover,
	&:visited,
	&:active {
		text-decoration: none;
		color: black;
	}
`

export default class PokemonCard extends Component {
	state = {
		name: '',
		imageURL: '',
		pokemonIndex: '',
		imageLoading: true,
		tooManyRequests: false
	}

	componentDidMount() {
		const {name, url} = this.props;
		const pokemonIndex = url.split('/')[url.split('/').length - 2];
		const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`

		this.setState({
			name,
			imageURL,
			pokemonIndex
		});
	}

	render() {
		return (
			<div className='col-md-3 col-sm6 mb-5'>
				<StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
					<Card className='card'>
						<h5 className='card-header'>{this.state.pokemonIndex}</h5>
						{this.state.imageLoading ? (
							<img
								src='https://monophy.com/media/N256GFy1u6M6Y/monophy.gif'
								alt='Loading'
								style={{width: '5em', height: '5em'}}
								className='card-img-top rounded mx-auto d-block mt-2'
							/>
						) : null}
						<Sprite
							className='card-img-top rounded mx-auto mt-2'
							src={this.state.imageURL}
							onLoad={() => this.setState({ imageLoading: false })}
							onError={() => this.setState({ tooManyRequests: true })}
							style={
								this.state.tooManyRequests ? { display: 'none' } :
								this.state.imageLoading ? null : { display: 'block' }
							}
						/>
						{this.state.tooManyRequests ?
						(
							<h6 className='mx-auto'>
								<span className='badge badge-danger mt-2'>Too many requests</span>
							</h6>
						) : null
						}
						<div className='card-body mx-auto'>
							<h6 className='card-title'>
								{this.state.name
									.toLowerCase()
									.split(' ')
									.map(letter => (
										letter.charAt(0).toUpperCase() + letter.substring(1)
										)
									).join(' ')
								}
							</h6>
						</div>
					</Card>
				</StyledLink>
			</div>
		)
	}
}

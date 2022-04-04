import React, { Component } from 'react';

import './style.css';

export default class NavBar extends Component {
	render() {
		return (
			<div>
				<nav className='navbar navbar-expand-md navbar-dark fixed-top'>
					<a className='navbar-brand col-sm-3 col-md-2 mr-0 align-items-center' href='https://github.com/HelioPC'>
						Pokedex
					</a>
				</nav>
			</div>
		)
	}
}

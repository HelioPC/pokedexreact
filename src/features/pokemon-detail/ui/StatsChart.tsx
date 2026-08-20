import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import PieChartColors from './pieChartColors'
import { Pokemon } from '../../../data/pokeapi'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
	pokemon: Pokemon
}

const StatsChart = ({ pokemon }: Props) => {
	const data = {
		labels: pokemon.stats.map((s) => s.stat.name),
		datasets: [
			{
				label: 'Raw value',
				data: pokemon.stats.map((s) => s.base_stat),
				...PieChartColors,
				borderWidth: 2,
			},
		],
	}

	const summary = pokemon.stats.map((s) => `${s.stat.name} ${s.base_stat}`).join(', ')

	return (
		<Pie
			data={data}
			aria-label={`Base stats for ${pokemon.name}: ${summary}`}
		/>
	)
}

export default StatsChart

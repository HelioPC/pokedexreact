export const getColor = (type: string): string => {
	switch (type.toLowerCase()) {
	case 'grass':
		return '126,200,80'
	case 'fire':
		return '255,0,0'
	case 'water':
		return '0,221,255'
	case 'electric':
		return '255,238,0'
	case 'ice':
		return '67,141,252'
	case 'fighting':
		return '138,245,158'
	case 'poison':
		return '185,81,255'
	case 'ground':
		return '255,198,141'
	case 'flying':
		return '92,255,209'
	case 'psychic':
		return '254,61,187'
	case 'bug':
		return '32,255,47'
	case 'rock':
		return '222,184,135'
	case 'ghost':
		return '173,173,173'
	case 'dark':
		return '149,149,149'
	case 'dragon':
		return '240,81,81'
	case 'steel':
		return '131,139,205'
	case 'fairy':
		return '249,70,130'
	default:
		return '156,156,156'
	}
}
  
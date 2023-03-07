export const formatNumber = (n: number): string => {
	if(n < 10) {
		return `000${n}`
	} else if(n < 100) {
		return `00${n}`
	} else if(n < 1000) {
		return `0${n}`
	}

	return `${n}`
}
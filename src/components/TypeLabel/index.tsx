import React from 'react'
import styled from 'styled-components'
import { getColor } from '../../utils/color'

type ComponentProps = {
    name: string
}

const StyledLabel = styled.div<{ color: string }>`
    background: rgba(${props => props.color},.9);
    padding: 4px 8px;
    border-radius: 8px;
`

const TypeLabel = ({ name }: ComponentProps) => {
	return (
		<StyledLabel color={getColor(name)}>
			<p className='text-xs text-center text-black'>{name}</p>
		</StyledLabel>
	)
}

export default TypeLabel
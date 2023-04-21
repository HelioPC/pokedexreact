import styled, { DefaultTheme } from 'styled-components'

export const HomeScreen = styled.div<{ theme: DefaultTheme }>`
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.theme.colors.mainBg};
    color: ${props => props.theme.theme.colors.textPrimary};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 50px 20px;

    @media (max-width: 350px) {
        padding: 50px 10px;
    }
`

export const HomeInputArea = styled.div<{ theme: DefaultTheme }>`
    display: flex;
    flex-direction: column;
    gap: 35px;
    margin: 0 0 40px 0;
    
    &:has(> div input:focus) {
        box-shadow: 0px 0px 34px -5px rgba(0,0,0,0.2);
    }

    div {
        width: 100%;
        height: 46px;
        background-color: ${props => props.theme.theme.colors.barBackground};
        color: ${props => props.theme.theme.colors.textPrimary};
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        
        svg {
            color: ${props => props.theme.theme.colors.textPrimary};
        }

        input {
            width: 100%;
            background-color: transparent;
            border: 0;
            height: 46px;
            color: ${props => props.theme.theme.colors.textPrimary};
            outline: none;
            font-size: 14px;
        }
    }

    button {
        width: 100px;
        padding: 5px;
        color: white;
        background-color: black;
        border-radius: 10px;
    }
`

export const HomeFilterArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    @media (max-width: 767px) {
        flex-wrap: wrap;
    }
`

export const HomeMain = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const HomeMainHeader = styled.div`
    max-width: 1280px;
    background-color: white;
`

export const HomeButton = styled.button<{ theme: DefaultTheme }>`
    width: 128px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.theme.colors.button};
    color: ${props => props.theme.theme.colors.textButton};
    border-radius: 8px;
    padding: 8px;
`

export const HomeSelectOption = styled.select<{ theme: DefaultTheme }>`
    width: 128px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.theme.colors.button};
    color: ${props => props.theme.theme.colors.textButton};
    border-radius: 8px;
    padding: 8px;
    margin: 12px;
    text-align: center;
    font-size: 14px;
`

export const HomeGrid = styled.div<{ length: number }>`
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    place-items: center;
    gap: 20px;
    grid-template-columns: repeat(1, calc(100vw - 10vw));
    grid-template-rows: repeat(${props => props.length}, auto);
    
    @media (min-width: 576px) {
        max-width: 540px;
        grid-template-columns: repeat(2, 205px);
        grid-template-rows: repeat(${props => Math.ceil(props.length/2)}, auto);
    }

    @media (min-width: 768px) {
        max-width: 720px;
        grid-template-columns: repeat(3, 205px);
        grid-template-rows: repeat(${props => Math.ceil(props.length/3)}, auto);
    }

    @media (min-width: 1024px) {
        max-width: 992px;
        grid-template-columns: repeat(4, 205px);
        grid-template-rows: repeat(${props => Math.ceil(props.length/4)}, auto);
    }
`

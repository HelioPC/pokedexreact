import styled from 'styled-components'

export const HomeScreen = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 50px 20px;

    @media (max-width: 350px) {
        padding: 50px 10px;
    }
`

export const HomeInputArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin: 0 0 80px 0;
    transition-duration: 500ms;

    &:hover {
        box-shadow: 1px 1px 3px 0px black;
    }

    div {
        width: 100%;
        height: 46px;
        background-color: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;

        svg {
            margin: 0 8px;
        }

        input {
            width: 100%;
            background-color: transparent;
            border: 0;
            height: 46px;
            color: #000;
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

export const HomeMain = styled.div`
    display: flex;
    flex-direction: column;
`

export const HomeMainHeader = styled.div`
    max-width: 1280px;
    background-color: white;
`

export const HomeGrid = styled.div<{ length: number }>`
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(1, calc(100vw - 30px));
    grid-template-rows: repeat(${props => props.length}, 286px);
    
    @media (min-width: 576px) {
        max-width: 540px;
        grid-template-columns: repeat(2, 205px);
    }

    @media (min-width: 768px) {
        max-width: 720px;
        grid-template-columns: repeat(3, 205px);
    }

    @media (min-width: 1024px) {
        max-width: 992px;
        grid-template-columns: repeat(4, 205px);
    }
`
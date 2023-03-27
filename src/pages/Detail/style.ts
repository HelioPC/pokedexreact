import styled from 'styled-components'

export const DetailScreen = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 50px 20px;

    @media (max-width: 444px) {
        padding: 0;
    }
`

export const DetailCard = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 4px;
`

export const DetailCardHeader = styled.div`
    width: 100%;
    height: 50px;
    padding: 16px;
    display: flex;
    align-items: center;
    background-color: #FAFAFA;
`

export const DetailCardBody = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
`

export const DetailCardFooter = styled.div`
    width: 100%;
    height: 80px;
    padding: 0 20px;
    gap: 10px;
    display: flex;
    align-items: center;
    background-color: #EAEAEA;
`

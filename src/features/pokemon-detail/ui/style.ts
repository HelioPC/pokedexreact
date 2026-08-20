import styled, { DefaultTheme } from 'styled-components'

export const DetailScreen = styled.div<{ theme: DefaultTheme }>`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.theme.colors.mainBg};
    color: ${props => props.theme.theme.colors.textPrimary};
    padding: 0;
`

export const DetailCard = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

export const DetailCardHeader = styled.div<{ theme: DefaultTheme }>`
    width: 100%;
    height: 50px;
    padding: 16px;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.theme.colors.barBackground};
`

export const DetailCardBody = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
`

export const DetailCardFooter = styled.div<{ theme: DefaultTheme }>`
    width: 100%;
    height: 80px;
    padding: 0 20px;
    gap: 10px;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.theme.colors.barBackground};
`

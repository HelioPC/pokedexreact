import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        theme: {
            name: string;
            colors: {
                primary: string;
                mainBg: string;
                button: string
                textButton: string;
                barBackground: string;
                cardBackground: string;
                cardSecundary: string;
                textPrimary: string;
            };
        };
        switchTheme: () => void;
    }
}

import 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {
        theme: {
            name: string;
            colors: {
                primary: string;
                mainBg: string;
                sideBarBg: string;
                sideBarLabelBg: string;
                textPrimary: string;
                textSecundary: string;
                active: string;
            };
        };
        switchTheme: () => void;
    }
}

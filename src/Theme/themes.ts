import { createTheme } from '@mui/material';


//creating my theme
export const theme = createTheme({
    typography: {
        fontFamily: 'Fragment Mono, Roboto, monospace',
    },
    palette: {
        primary: {
            main: '#241E39' // dark eggplant purple
        },
        secondary: {
            main: '#62606D' // gray purple
        },
        info: {
            main: '#BDB6C9' //lilac gray purple
        }
    }

})
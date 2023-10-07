import 'styled-components';
import { theme } from '@mui/material/styles';


//override theme, palette colors, etc
declare module 'style-components' {
    export interface DefaultTheme extends Theme {}
}
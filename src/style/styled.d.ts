import 'styled-components'; 
import { Theme } from './theme'; // theme.ts type

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat'
  },
  shadows: {
    elevation_1: '0 0px 1px rgb(0 0 0 / 0.1)'
  },
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      background: 'white'
    }
  }
})
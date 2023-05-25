import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
    small: {
      fontSize: '0.8rem'
    },
    h1: {
      fontSize: '1.2rem',
      color: '#555',
    }
  },
  shadows: {
    elevation_1: '0 0px 1px rgb(0 0 0 / 0.1)'
  },
  borders: {
    color: '#333',
    disabled: '#ddd'
  },
  palette: {
    primary: {
      light: '#29c50d',
      main: '#248d12',
      accent: '#ffc50d',
      dark: '#002884',
      background: 'white',
    }
  }
})
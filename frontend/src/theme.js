import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
    small: {
      fontSize: '0.8rem'
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
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      background: 'white',
    }
  }
})
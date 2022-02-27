import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: "Helvetica Neue",
  h1: {
      fontWeight: '400',
      fontSize: '87px',
  },
  body1: {
      fontWeight: 'regular',
      fontSize: '18px',
  },
  h2: { 
      fontWeight: 'bold',
      fontSize: '65px',
  }, 
  h5: { 
    fontWeight: '400',
    fontSize: '15px',
  }
}
});
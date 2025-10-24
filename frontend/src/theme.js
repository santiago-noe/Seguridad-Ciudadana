// Paleta inspirada en GitHub (modo claro y oscuro)
import { createTheme } from '@mui/material/styles';

const githubLight = {
  palette: {
    mode: 'light',
    primary: {
      main: '#2d6cdf', // azul github
      contrastText: '#fff',
    },
    secondary: {
      main: '#6e7781', // gris github
    },
    background: {
      default: '#f6f8fa', // fondo claro github
      paper: '#fff',
    },
    text: {
      primary: '#24292f', // texto principal github
      secondary: '#57606a',
    },
    success: {
      main: '#2ea043', // verde github
    },
    error: {
      main: '#cf222e', // rojo github
    },
    warning: {
      main: '#e3b341', // amarillo github
    },
    info: {
      main: '#0969da', // azul info github
    },
    divider: '#d0d7de',
  },
};

const githubDark = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#539bf5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6e7681',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e',
    },
    success: {
      main: '#2ea043',
    },
    error: {
      main: '#f85149',
    },
    warning: {
      main: '#e3b341',
    },
    info: {
      main: '#58a6ff',
    },
    divider: '#21262d',
  },
};

export const themeLight = createTheme(githubLight);
export const themeDark = createTheme(githubDark);

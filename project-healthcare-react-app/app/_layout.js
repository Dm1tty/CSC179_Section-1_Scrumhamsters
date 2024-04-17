import { Stack } from 'expo-router';
import { ThemeProvider, createTheme } from '@rneui/themed';

const theme = createTheme({
  lightColors: {
    primary: '#1eb6b9'
  },
  darkColors: {
    primary: '#000',
  },
  mode: 'light'
});

export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack />
    </ThemeProvider>
  );
}

import Map from "./Map/map";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Map />
      </div>
    </ThemeProvider>
  );
}

export default App;

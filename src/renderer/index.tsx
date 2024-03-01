import { createRoot } from 'react-dom/client';
import App from './App';
import { InitializeCountryData } from 'data/countries';

InitializeCountryData();

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
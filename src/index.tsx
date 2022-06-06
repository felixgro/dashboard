import './styles/globals.css';
import ReactDOM from 'react-dom/client';
import { hydrate } from "react-dom";
import Dashboard from './views/Dashboard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const rootElement = document.getElementById("root")!;
if (rootElement.hasChildNodes()) {
  hydrate(<Dashboard />, rootElement);
} else {
  root.render(<Dashboard />);
}
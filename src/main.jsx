import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CSS_THEME_COLORS } from './config/colors';
import STRINGS from './config/strings';

document.title = STRINGS.BROWSER_TITLE;

const themeStyles = document.createElement('style');
themeStyles.textContent = Object.entries(CSS_THEME_COLORS)
  .map(([theme, colors]) => {
    const selector = theme === 'light' ? ':root, :root[data-theme="light"]' : ':root[data-theme="dark"]';
    return `${selector} { ${Object.entries(colors).map(([name, value]) => `${name}: ${value};`).join(' ')} }`;
  }).join('\n');
document.head.appendChild(themeStyles);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

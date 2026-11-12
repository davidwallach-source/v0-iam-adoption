import React from 'react';
import ReactDOM from 'react-dom/client';
import { Agentation } from 'agentation';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';

const params = new URLSearchParams(window.location.search);
const isPresenter = params.has('present');
const isEmbedded = params.has('embed');

// The presenter shell (public/present.js) owns the page in ?present and loads the app in an iframe.
if (!isPresenter) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
      {!isEmbedded && <Agentation endpoint="http://localhost:4747" />}
      {!isEmbedded && <Analytics />}
    </React.StrictMode>
  );
}

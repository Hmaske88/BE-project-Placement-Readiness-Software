import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as process from 'process';
import reportWebVitals from "./reportWebVitals";
import { SocketProvider } from "./context/SocketProvider";

(window).global = window;
(window).process = process;
(window).Buffer = [];

// const root = ReactDOM.createRoot(document.getElementById("root"));


// Create a root and render the application
const container = document.getElementById("root");
const root = createRoot(container);

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//     <SocketProvider>
//       <App />
//     </SocketProvider>
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
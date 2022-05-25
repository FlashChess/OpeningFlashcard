import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Test from './Test';

ReactDOM.render(
    <BrowserRouter>
      <Routes>
        <Route path = "/openingflashcard" element = { <App /> } />
        <Route path = "/Test" element = { <Test /> } />
      </Routes>
    </BrowserRouter>,
    document.getElementById("root")
);
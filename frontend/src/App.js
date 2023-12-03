// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home.js';
import Chats from '../src/pages/Chats.js';
import "./App.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chats" element={<Chats />} />
      </Routes>

    </div>
  );
}

export default App;

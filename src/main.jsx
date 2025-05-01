import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import ReactDom from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

//import './index.css';
import App from './App.jsx';
import CreateUser from './CreateUser.jsx';
import ShowUser from './ShowUser.jsx';

const root = document.getElementById("root");


ReactDom.createRoot(root).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
       <Routes>
            <Route path="/" element={ <App /> } />
            <Route path="user/:id" element={ <ShowUser /> } />
            <Route path="create" element={<CreateUser />} />
       </Routes>
    </BrowserRouter>
    
)

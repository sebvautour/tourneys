import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Overview from './Overview.tsx'
import Games from './Games.tsx'
import Nav from './components/Nav.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav />
    <BrowserRouter>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="games" element={<Games />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

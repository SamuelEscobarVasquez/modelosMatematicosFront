import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // Importo los estilos de Bootstrap
import * as bootstrap from 'bootstrap' // Importo Bootstrap como módulo
import './index.css'
import App from './App.tsx'

// Expongo Bootstrap en window para que esté disponible globalmente
(window as any).bootstrap = bootstrap;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

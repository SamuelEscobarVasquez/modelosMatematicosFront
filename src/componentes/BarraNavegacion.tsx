// BarraNavegacion.tsx
// Barra superior de navegación para controlar la aplicación

import type { MetodoInicial } from '../tipos/tipos';

// Propiedades del componente
interface BarraNavegacionProps {
  onNuevoProblema: () => void;              // Función para crear nuevo problema
  onEditarProblema: () => void;             // Función para editar problema actual
  onCambiarMetodo: () => void;              // Función para cambiar método
  onVerPasos: () => void;                   // Función para ver pasos explicativos
  hayProblema: boolean;                     // Si hay un problema cargado
  haySolucion: boolean;                     // Si hay una solución calculada
  metodoActual: MetodoInicial | null;       // Método actualmente seleccionado
  mostrandoPasos: boolean;                  // Si se están mostrando los pasos
}

/**
 * Barra de navegación superior
 * Permite controlar todo el flujo de la aplicación desde un solo lugar
 */
export function BarraNavegacion({
  onNuevoProblema,
  onEditarProblema,
  onCambiarMetodo,
  onVerPasos,
  hayProblema,
  haySolucion,
  metodoActual,
  mostrandoPasos
}: BarraNavegacionProps) {
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4 sticky-top">
      <div className="container-fluid px-2 px-md-3">
        <a className="navbar-brand fw-bold d-flex align-items-center" href="#" style={{ fontSize: '0.9rem' }}>
          <span className="d-none d-md-inline">🎓 Investigación de Operaciones - Método Multiplicadores</span>
          <span className="d-inline d-md-none">🎓 IO - Multiplicadores</span>
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto navbar_nav_bar">
            <li className="nav-item">
              <button 
                className="btn btn-light btn-sm mx-1 my-1 w-100 w-lg-auto"
                onClick={onNuevoProblema}
              >
                <span className="d-none d-sm-inline">➕ Nuevo Problema</span>
                <span className="d-inline d-sm-none">➕ Nuevo</span>
              </button>
            </li>
            
            {hayProblema && (
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm mx-1 my-1 w-100 w-lg-auto"
                  onClick={onEditarProblema}
                >
                  <span className="d-none d-sm-inline">✏️ Editar Valores</span>
                  <span className="d-inline d-sm-none">✏️ Editar</span>
                </button>
              </li>
            )}
            
            {hayProblema && !haySolucion && (
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm mx-1 my-1 w-100 w-lg-auto"
                  onClick={onCambiarMetodo}
                >
                  <span className="d-none d-sm-inline">🔧 Cambiar Método</span>
                  <span className="d-inline d-sm-none">🔧 Cambiar</span>
                </button>
              </li>
            )}
            
            {haySolucion && (
              <>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm mx-1 my-1 w-100 w-lg-auto"
                    onClick={onCambiarMetodo}
                  >
                    <span className="d-none d-sm-inline">🔄 Resolver con Otro Método</span>
                    <span className="d-inline d-sm-none">🔄 Otro Método</span>
                  </button>
                </li>
                
                <li className="nav-item">
                  <button 
                    className={`btn btn-sm mx-1 my-1 w-100 w-lg-auto ${mostrandoPasos ? 'btn-warning' : 'btn-success'}`}
                    onClick={onVerPasos}
                  >
                    📚 {mostrandoPasos ? 'Ocultar' : 'Ver'} Pasos
                  </button>
                </li>
              </>
            )}
            
            {metodoActual && (
              <li className="nav-item d-flex align-items-center justify-content-center">
                <span className="navbar-text text-white ms-lg-3 my-2 my-lg-0">
                  <small className="d-block d-lg-inline">
                    Método: <strong className="d-block d-sm-inline">
                      {metodoActual === 'esquina-noroeste' ? 'Esquina Noroeste' : 'Costo Mínimo'}
                    </strong>
                  </small>
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

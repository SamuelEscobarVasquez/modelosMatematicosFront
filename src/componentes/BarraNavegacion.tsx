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
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#">
          🎓 Investigación de Operaciones - Método Multiplicadores
        </a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button 
                className="btn btn-light btn-sm mx-1"
                onClick={onNuevoProblema}
              >
                ➕ Nuevo Problema
              </button>
            </li>
            
            {hayProblema && (
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm mx-1"
                  onClick={onEditarProblema}
                >
                  ✏️ Editar Valores
                </button>
              </li>
            )}
            
            {hayProblema && !haySolucion && (
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm mx-1"
                  onClick={onCambiarMetodo}
                >
                  🔧 Cambiar Método
                </button>
              </li>
            )}
            
            {haySolucion && (
              <>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm mx-1"
                    onClick={onCambiarMetodo}
                  >
                    🔄 Resolver con Otro Método
                  </button>
                </li>
                
                <li className="nav-item">
                  <button 
                    className={`btn btn-sm mx-1 ${mostrandoPasos ? 'btn-warning' : 'btn-success'}`}
                    onClick={onVerPasos}
                  >
                    📚 {mostrandoPasos ? 'Ocultar' : 'Ver'} Pasos
                  </button>
                </li>
              </>
            )}
            
            {metodoActual && (
              <li className="nav-item">
                <span className="navbar-text text-white ms-3">
                  <small>
                    Método: <strong>
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

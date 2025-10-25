// App.tsx
// Componente principal de mi aplicación de Investigación de Operaciones
// Aquí coordino todos los componentes y manejo el flujo principal de la aplicación

import { useState, useEffect } from 'react';
import type { ProblemaTransporte, MetodoInicial, Celda, PasoExplicacion } from './tipos/tipos';
import { EntradaMatrizModal } from './componentes/EntradaMatrizModal';
import { BarraNavegacion } from './componentes/BarraNavegacion';
import { SelectorMetodo } from './componentes/SelectorMetodo';
import { esquinaNoroeste, costoMinimo } from './utilidades/metodosIniciales';
import { metodoMODI, calcularCostoTotal } from './utilidades/metodoMODI';
import './App.css';
import { VisualizadorMatriz } from './componentes/VisualizadorMatriz';
import { PasosExplicativos } from './componentes/PasosExplicativos';

/**
 * Componente principal de la aplicación
 * Interfaz de una sola página con barra de navegación superior
 */
function App() {
  
  // Estados principales
  const [problema, setProblema] = useState<ProblemaTransporte | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoInicial | null>(null);
  const [solucionInicial, setSolucionInicial] = useState<Celda[][] | null>(null);
  const [solucionOptima, setSolucionOptima] = useState<Celda[][] | null>(null);
  const [pasos, setPasos] = useState<PasoExplicacion[]>([]);
  const [mostrandoPasos, setMostrandoPasos] = useState<boolean>(false);
  const [resolviendo, setResolviendo] = useState<boolean>(false);
  
  // Estados para controlar los modales
  const [mostrarModalProblema, setMostrarModalProblema] = useState<boolean>(false);
  const [mostrarSelectorMetodo, setMostrarSelectorMetodo] = useState<boolean>(false);
  
  // Inicializo tooltips de Bootstrap cuando cambia el estado
  useEffect(() => {
    // Verifico que Bootstrap esté cargado
    if (typeof (window as any).bootstrap === 'undefined') {
      console.warn('Bootstrap no está disponible. Los tooltips no funcionarán.');
      return;
    }
    
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = Array.from(tooltipTriggerList).map(
      (el) => {
        try {
          return new (window as any).bootstrap.Tooltip(el);
        } catch (error) {
          console.error('Error al inicializar tooltip:', error);
          return null;
        }
      }
    );
    
    return () => {
      tooltips.forEach(t => {
        if (t && typeof t.dispose === 'function') {
          try {
            t.dispose();
          } catch (error) {
            console.error('Error al destruir tooltip:', error);
          }
        }
      });
    };
  }, [solucionInicial, solucionOptima, pasos, mostrandoPasos]);
  
  // Al inicio, muestro el modal para crear un problema
  useEffect(() => {
    if (!problema) {
      setMostrarModalProblema(true);
    }
  }, [problema]);
  
  /**
   * Cuando el usuario crea un problema, lo guardo y reinicio el proceso
   */
  const handleProblemaCreado = (nuevoProblema: ProblemaTransporte) => {
    setProblema(nuevoProblema);
    setMetodoSeleccionado(null);
    setSolucionInicial(null);
    setSolucionOptima(null);
    setPasos([]);
    setMostrandoPasos(false);
    setMostrarSelectorMetodo(true);
  };
  
  /**
   * Cuando el usuario selecciona un método, calculo la solución
   */
  const handleMetodoSeleccionado = (metodo: MetodoInicial) => {
    if (!problema) return;
    
    setResolviendo(true);
    setMetodoSeleccionado(metodo);
    setMostrandoPasos(false);
    setMostrarSelectorMetodo(false);
    
    // Uso setTimeout para que el UI se actualice antes de realizar cálculos pesados
    setTimeout(() => {
      // Obtengo la solución inicial según el método seleccionado
      let solucionInicialCalculada: Celda[][];
      
      if (metodo === 'esquina-noroeste') {
        solucionInicialCalculada = esquinaNoroeste(problema);
      } else {
        solucionInicialCalculada = costoMinimo(problema);
      }
      
      setSolucionInicial(solucionInicialCalculada);
      
      // Aplico el método MODI para optimizar
      const resultado = metodoMODI(problema, solucionInicialCalculada, metodo, false);
      setSolucionOptima(resultado.solucion);
      
      setResolviendo(false);
    }, 100);
  };
  
  /**
   * Genero los pasos explicativos del método MODI
   */
  const generarPasosExplicativos = () => {
    if (!problema || !solucionInicial || !metodoSeleccionado) return;
    
    setResolviendo(true);
    
    setTimeout(() => {
      // Ahora sí genero los pasos
      const resultado = metodoMODI(problema, solucionInicial, metodoSeleccionado, true);
      setPasos(resultado.pasos);
      setMostrandoPasos(true);
      setResolviendo(false);
    }, 100);
  };
  
  /**
   * Reinicio toda la aplicación
   */
  const reiniciar = () => {
    setProblema(null);
    setMetodoSeleccionado(null);
    setSolucionInicial(null);
    setSolucionOptima(null);
    setPasos([]);
    setMostrandoPasos(false);
    setMostrarModalProblema(true);
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Barra de navegación superior */}
      <BarraNavegacion
        onNuevoProblema={reiniciar}
        onEditarProblema={() => setMostrarModalProblema(true)}
        onCambiarMetodo={() => {setMostrarSelectorMetodo(true); setMostrandoPasos(false);}}
        onVerPasos={() => {
          if (!mostrandoPasos) {
            generarPasosExplicativos();
          } else {
            setMostrandoPasos(false);
          }
        }}
        hayProblema={problema !== null}
        haySolucion={solucionOptima !== null}
        metodoActual={metodoSeleccionado}
        mostrandoPasos={mostrandoPasos}
      />
      
      {/* Contenido principal */}
      <div className="container-fluid px-4 pb-4">
        
        {/* Selector de método (si es necesario) */}
        {problema && mostrarSelectorMetodo && (
          <div className="row mb-3">
            <div className="col-12">
              <SelectorMetodo 
                onMetodoSeleccionado={handleMetodoSeleccionado}
                metodoActual={metodoSeleccionado}
              />
            </div>
          </div>
        )}
        
        {/* Indicador de carga */}
        {resolviendo && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Calculando...</span>
            </div>
            <p className="mt-3 text-muted">
              {mostrandoPasos ? 'Generando explicación paso a paso...' : 'Resolviendo el problema...'}
            </p>
          </div>
        )}
        
        {/* Resultados */}
        {!resolviendo && solucionInicial && solucionOptima && problema && !mostrandoPasos && (
          <>
            {/* Comparación lado a lado */}
            <div className="row mb-3">
              <div className="col-lg-6">
                <VisualizadorMatriz
                  matriz={solucionInicial}
                  oferta={problema.oferta}
                  demanda={problema.demanda}
                  nombresOrigenes={problema.nombresOrigenes}
                  nombresDestinos={problema.nombresDestinos}
                  titulo={`📊 Solución Inicial - ${
                    metodoSeleccionado === 'esquina-noroeste' ? 'Esquina Noroeste' : 'Costo Mínimo'
                  }`}
                  mostrarCostoTotal={true}
                />
              </div>
              
              <div className="col-lg-6">
                <VisualizadorMatriz
                  matriz={solucionOptima}
                  oferta={problema.oferta}
                  demanda={problema.demanda}
                  nombresOrigenes={problema.nombresOrigenes}
                  nombresDestinos={problema.nombresDestinos}
                  titulo="✅ Solución Óptima - Método Multiplicadores"
                  mostrarCostoTotal={true}
                />
              </div>
            </div>
            
            {/* Comparación de resultados */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm mb-3">
                  <div className="card-body p-2 p-md-3">
                    <h5 className="card-title text-primary mb-2 mb-md-3 fs-6 fs-md-5">📈 Comparación de Resultados</h5>
                    
                    <div className="row text-center g-2 g-md-3">
                      <div className="col-12 col-sm-4">
                        <div className="p-2 p-md-3 bg-light rounded">
                          <h6 className="text-muted small">Costo Inicial</h6>
                          <p className="fs-4 fs-md-2 fw-bold text-warning mb-0">
                            ${calcularCostoTotal(solucionInicial).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-12 col-sm-4">
                        <div className="p-2 p-md-3 bg-light rounded">
                          <h6 className="text-muted small">Costo Óptimo</h6>
                          <p className="fs-4 fs-md-2 fw-bold text-success mb-0">
                            ${calcularCostoTotal(solucionOptima).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-12 col-sm-4">
                        <div className="p-2 p-md-3 bg-light rounded">
                          <h6 className="text-muted small">Ahorro</h6>
                          <p className="fs-4 fs-md-2 fw-bold text-primary mb-0">
                            ${(calcularCostoTotal(solucionInicial) - calcularCostoTotal(solucionOptima)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Pasos explicativos */}
        {!resolviendo && mostrandoPasos && pasos.length > 0 && problema && (
          <div className="row">
            <div className="col-12">
              <PasosExplicativos
                pasos={pasos}
                oferta={problema.oferta}
                demanda={problema.demanda}
                nombresOrigenes={problema.nombresOrigenes}
                nombresDestinos={problema.nombresDestinos}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de entrada de datos */}
      <EntradaMatrizModal
        mostrar={mostrarModalProblema}
        onCerrar={() => setMostrarModalProblema(false)}
        onProblemaCreado={handleProblemaCreado}
        problemaActual={problema}
      />
      
      {/* Footer */}
      <footer className="bg-white border-top py-3 py-md-4 mt-4 mt-md-5">
        <div className="container text-center text-muted px-2">
          <p className="mb-2 fw-bold fs-6 fs-md-5">
            💡 Sistema de Investigación de Operaciones - Método Multiplicadores
          </p>
          <div className="row justify-content-center g-1">
            <div className="col-12 col-md-8">
              <small className="d-block mb-1" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
                <strong>Jeferson David Espina Zabala</strong> - 5190-23-2907
              </small>
              <small className="d-block mb-1" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
                <strong>Luis Alejandro Corado Castellanos</strong> - 5190-23-4073
              </small>
              <small className="d-block" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
                <strong>Samuel Isaac Escobar Vasquez</strong> - 5190-23-1952
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

// App.tsx
// Componente principal de mi aplicación de Investigación de Operaciones
// Aquí coordino todos los componentes y manejo el flujo principal de la aplicación

import { useState, useEffect } from 'react';
import type { ProblemaTransporte, MetodoInicial, Celda, PasoExplicacion } from './tipos/tipos';
import { EntradaMatrizModal } from './componentes/EntradaMatrizModal';
import { BarraNavegacion } from './componentes/BarraNavegacion';
import { SelectorMetodo } from './componentes/SelectorMetodo';
import { VisualizadorMatrizMejorado } from './componentes/VisualizadorMatrizMejorado';
import { PasosExplicativosMejorados } from './componentes/PasosExplicativosMejorados';
import { esquinaNoroeste, costoMinimo, vogel } from './utilidades/metodosIniciales';
import { metodoMODI, calcularCostoTotal } from './utilidades/metodoMODI';
import './App.css';

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
      
      switch (metodo) {
        case 'esquina-noroeste':
          solucionInicialCalculada = esquinaNoroeste(problema);
          break;
        case 'costo-minimo':
          solucionInicialCalculada = costoMinimo(problema);
          break;
        case 'vogel':
          solucionInicialCalculada = vogel(problema);
          break;
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
                <VisualizadorMatrizMejorado
                  matriz={solucionInicial}
                  oferta={problema.oferta}
                  demanda={problema.demanda}
                  nombresOrigenes={problema.nombresOrigenes}
                  nombresDestinos={problema.nombresDestinos}
                  titulo={`📊 Solución Inicial - ${
                    metodoSeleccionado === 'esquina-noroeste' ? 'Esquina Noroeste' :
                    metodoSeleccionado === 'costo-minimo' ? 'Costo Mínimo' :
                    'Vogel (VAM)'
                  }`}
                  mostrarCostoTotal={true}
                />
              </div>
              
              <div className="col-lg-6">
                <VisualizadorMatrizMejorado
                  matriz={solucionOptima}
                  oferta={problema.oferta}
                  demanda={problema.demanda}
                  nombresOrigenes={problema.nombresOrigenes}
                  nombresDestinos={problema.nombresDestinos}
                  titulo="✅ Solución Óptima - Método MODI"
                  mostrarCostoTotal={true}
                />
              </div>
            </div>
            
            {/* Comparación de resultados */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm mb-3">
                  <div className="card-body">
                    <h5 className="card-title text-primary mb-3">📈 Comparación de Resultados</h5>
                    
                    <div className="row text-center g-3">
                      <div className="col-md-4">
                        <div className="p-3 bg-light rounded">
                          <h6 className="text-muted">Costo Inicial</h6>
                          <p className="display-6 fw-bold text-warning mb-0">
                            ${calcularCostoTotal(solucionInicial).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="p-3 bg-light rounded">
                          <h6 className="text-muted">Costo Óptimo</h6>
                          <p className="display-6 fw-bold text-success mb-0">
                            ${calcularCostoTotal(solucionOptima).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="p-3 bg-light rounded">
                          <h6 className="text-muted">Ahorro</h6>
                          <p className="display-6 fw-bold text-primary mb-0">
                            ${(calcularCostoTotal(solucionInicial) - calcularCostoTotal(solucionOptima)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center">
                      <h5 className="text-success">
                        Mejora del {
                          (((calcularCostoTotal(solucionInicial) - calcularCostoTotal(solucionOptima)) / 
                          calcularCostoTotal(solucionInicial)) * 100).toFixed(2)
                        }%
                      </h5>
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
              <PasosExplicativosMejorados
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
      <footer className="bg-white border-top py-3 mt-5">
        <div className="container text-center text-muted">
          <p className="mb-1">
            💡 Sistema de Investigación de Operaciones - Método MODI
          </p>
          <small>Desarrollado con React + TypeScript + Bootstrap</small>
        </div>
      </footer>
    </div>
  );
}

export default App;

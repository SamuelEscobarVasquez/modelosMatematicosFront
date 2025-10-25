// App.tsx
// Componente principal de mi aplicación de Investigación de Operaciones
// Aquí coordino todos los componentes y manejo el flujo principal de la aplicación

import { useState } from 'react';
import type { ProblemaTransporte, MetodoInicial, Celda, PasoExplicacion } from './tipos/tipos';
import { EntradaMatriz } from './componentes/EntradaMatriz';
import { SelectorMetodo } from './componentes/SelectorMetodo';
import { VisualizadorMatriz } from './componentes/VisualizadorMatriz';
import { PasosExplicativos } from './componentes/PasosExplicativos';
import { esquinaNoroeste, costoMinimo, vogel } from './utilidades/metodosIniciales';
import { metodoMODI, calcularCostoTotal } from './utilidades/metodoMODI';
import './App.css';

/**
 * Componente principal de la aplicación
 * Manejo el flujo completo: entrada de datos → método inicial → optimización MODI
 */
function App() {
  
  // Estados para controlar el flujo de la aplicación
  const [problema, setProblema] = useState<ProblemaTransporte | null>(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoInicial | null>(null);
  const [solucionInicial, setSolucionInicial] = useState<Celda[][] | null>(null);
  const [solucionOptima, setSolucionOptima] = useState<Celda[][] | null>(null);
  const [pasos, setPasos] = useState<PasoExplicacion[]>([]);
  const [mostrandoPasos, setMostrandoPasos] = useState<boolean>(false);
  const [resolviendo, setResolviendo] = useState<boolean>(false);
  
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
    
    // Hago scroll hacia el selector de método
    setTimeout(() => {
      const selector = document.getElementById('selector-metodo');
      selector?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };
  
  /**
   * Cuando el usuario selecciona un método, calculo la solución
   */
  const handleMetodoSeleccionado = (metodo: MetodoInicial) => {
    if (!problema) return;
    
    setResolviendo(true);
    setMetodoSeleccionado(metodo);
    setMostrandoPasos(false);
    
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
      // Primera vez sin generar pasos (para mostrar resultado rápido)
      const resultado = metodoMODI(problema, solucionInicialCalculada, false);
      setSolucionOptima(resultado.solucion);
      
      setResolviendo(false);
      
      // Hago scroll hacia los resultados
      setTimeout(() => {
        const resultados = document.getElementById('resultados');
        resultados?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 100);
  };
  
  /**
   * Genero los pasos explicativos del método MODI
   */
  const generarPasosExplicativos = () => {
    if (!problema || !solucionInicial) return;
    
    setResolviendo(true);
    
    setTimeout(() => {
      // Ahora sí genero los pasos
      const resultado = metodoMODI(problema, solucionInicial, true);
      setPasos(resultado.pasos);
      setMostrandoPasos(true);
      setResolviendo(false);
      
      // Hago scroll hacia los pasos
      setTimeout(() => {
        const pasosDiv = document.getElementById('pasos-explicativos');
        pasosDiv?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="container py-5">
      {/* Encabezado de la aplicación */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          🎓 Investigación de Operaciones
        </h1>
        <h2 className="h4 text-secondary mb-4">
          Método de Multiplicadores (MODI)
        </h2>
        <p className="lead text-muted">
          Sistema para resolver problemas de transporte usando el Método de Distribución Modificada
        </p>
      </div>
      
      {/* Entrada de datos del problema */}
      {!problema && (
        <EntradaMatriz onProblemaCreado={handleProblemaCreado} />
      )}
      
      {/* Selector de método inicial */}
      {problema && !solucionInicial && (
        <div id="selector-metodo">
          <SelectorMetodo 
            onMetodoSeleccionado={handleMetodoSeleccionado}
            metodoActual={metodoSeleccionado}
          />
          
          {resolviendo && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Calculando...</span>
              </div>
              <p className="mt-3 text-muted">Resolviendo el problema...</p>
            </div>
          )}
        </div>
      )}
      
      {/* Resultados */}
      {solucionInicial && solucionOptima && problema && (
        <div id="resultados">
          {/* Solución Inicial */}
          <div className="mb-4">
            <VisualizadorMatriz
              matriz={solucionInicial}
              oferta={problema.oferta}
              demanda={problema.demanda}
              titulo={`📊 Solución Inicial - Método: ${
                metodoSeleccionado === 'esquina-noroeste' ? 'Esquina Noroeste' :
                metodoSeleccionado === 'costo-minimo' ? 'Costo Mínimo' :
                'Vogel (VAM)'
              }`}
              mostrarCostoTotal={true}
            />
          </div>
          
          {/* Solución Óptima */}
          <div className="mb-4">
            <VisualizadorMatriz
              matriz={solucionOptima}
              oferta={problema.oferta}
              demanda={problema.demanda}
              titulo="✅ Solución Óptima - Método MODI"
              mostrarCostoTotal={true}
            />
          </div>
          
          {/* Comparación de costos */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h4 className="card-title text-primary mb-3">📈 Comparación de Resultados</h4>
              
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-muted">Costo Inicial</h5>
                    <p className="display-6 fw-bold text-warning mb-0">
                      ${calcularCostoTotal(solucionInicial).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-muted">Costo Óptimo</h5>
                    <p className="display-6 fw-bold text-success mb-0">
                      ${calcularCostoTotal(solucionOptima).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h5 className="text-muted">Ahorro</h5>
                    <p className="display-6 fw-bold text-primary mb-0">
                      ${(calcularCostoTotal(solucionInicial) - calcularCostoTotal(solucionOptima)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Porcentaje de mejora */}
              <div className="mt-4 text-center">
                <h5>
                  Mejora del {
                    (((calcularCostoTotal(solucionInicial) - calcularCostoTotal(solucionOptima)) / 
                    calcularCostoTotal(solucionInicial)) * 100).toFixed(2)
                  }%
                </h5>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="row mb-4">
            <div className="col-md-6">
              <button 
                className="btn btn-success btn-lg w-100"
                onClick={generarPasosExplicativos}
                disabled={resolviendo || mostrandoPasos}
              >
                📚 Ver Solución Paso a Paso
              </button>
            </div>
            
            <div className="col-md-6">
              <button 
                className="btn btn-secondary btn-lg w-100"
                onClick={reiniciar}
              >
                🔄 Resolver Otro Problema
              </button>
            </div>
          </div>
          
          {resolviendo && mostrandoPasos === false && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Generando pasos...</span>
              </div>
              <p className="mt-3 text-muted">Generando explicación paso a paso...</p>
            </div>
          )}
          
          {/* Pasos explicativos */}
          {mostrandoPasos && pasos.length > 0 && (
            <div id="pasos-explicativos">
              <PasosExplicativos
                pasos={pasos}
                oferta={problema.oferta}
                demanda={problema.demanda}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <footer className="mt-5 pt-4 border-top text-center text-muted">
        <p>
          💡 Sistema de Investigación de Operaciones - Método MODI
        </p>
        <p className="small">
          Desarrollado con React + TypeScript + Bootstrap
        </p>
      </footer>
    </div>
  );
}

export default App;

# 📊 Sistema de Investigación de Operaciones - Método Multiplicadores# React + TypeScript + Vite



## Manual de UsuarioThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

**Aplicación:** Métodos de Solución Inicial del Problema de Transporte  

**Métodos incluidos:** Esquina Noroeste (North-West) y Costo Mínimo  Currently, two official plugins are available:

**Lenguaje:** TypeScript  

**Framework:** React 19 + Vite- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## React Compiler

## 📋 Tabla de Contenidos

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

1. [Objetivo](#1-objetivo)

2. [Requisitos](#2-requisitos)## Expanding the ESLint configuration

3. [Instalación y Ejecución](#3-instalación-y-ejecución)

4. [Flujo de Uso](#4-flujo-de-uso)If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

5. [Pantallas y Controles](#5-pantallas-y-controles)

6. [Métodos Implementados](#6-métodos-implementados)```js

7. [Formato de Entrada](#7-formato-de-entrada)export default defineConfig([

8. [Ejemplo de Corrida de Programa](#8-ejemplo-de-corrida-de-programa)  globalIgnores(['dist']),

9. [Interpretación de Resultados](#9-interpretación-de-resultados)  {

10. [Errores y Soluciones](#10-errores-y-cómo-resolverlos)    files: ['**/*.{ts,tsx}'],

11. [Preguntas Frecuentes](#11-preguntas-frecuentes)    extends: [

12. [Descripción del Proyecto](#12-descripción-del-proyecto)      // Other configs...

13. [Tecnologías Usadas](#13-tecnologías-usadas)

      // Remove tseslint.configs.recommended and replace with this

---      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules

## 1. 🎯 Objetivo      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

Esta aplicación permite resolver **Problemas de Transporte** utilizando dos métodos iniciales de asignación (Esquina Noroeste y Costo Mínimo) y optimizarlos mediante el **Método de Multiplicadores (MODI - Modified Distribution Method)**.      tseslint.configs.stylisticTypeChecked,



### Objetivos específicos:      // Other configs...

- ✅ Calcular una solución inicial factible para problemas de transporte    ],

- ✅ Optimizar la solución inicial mediante el Método de Multiplicadores    languageOptions: {

- ✅ Visualizar paso a paso el proceso de optimización      parserOptions: {

- ✅ Comparar costos entre la solución inicial y la óptima        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- ✅ Proporcionar una interfaz intuitiva y educativa        tsconfigRootDir: import.meta.dirname,

      },

---      // other options...

    },

## 2. 💻 Requisitos  },

])

### Requisitos del Sistema```



| Componente | Versión Mínima | Recomendada |You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

|------------|----------------|-------------|

| **Node.js** | 18.0.0 | 20.0.0 o superior |```js

| **npm** | 9.0.0 | 10.0.0 o superior |// eslint.config.js

| **Navegador** | Chrome 90+ | Chrome/Edge/Firefox (última versión) |import reactX from 'eslint-plugin-react-x'

| **RAM** | 4 GB | 8 GB |import reactDom from 'eslint-plugin-react-dom'

| **Resolución** | 1280x720 | 1920x1080 |

export default defineConfig([

### Dependencias Principales  globalIgnores(['dist']),

```json  {

{    files: ['**/*.{ts,tsx}'],

  "react": "^19.1.1",    extends: [

  "react-dom": "^19.1.1",      // Other configs...

  "typescript": "~5.9.3",      // Enable lint rules for React

  "bootstrap": "^5.3.8",      reactX.configs['recommended-typescript'],

  "vite": "npm:rolldown-vite@7.1.14"      // Enable lint rules for React DOM

}      reactDom.configs.recommended,

```    ],

    languageOptions: {

---      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

## 3. ⚙️ Instalación y Ejecución        tsconfigRootDir: import.meta.dirname,

      },

### A. Modo Desarrollo (TypeScript)      // other options...

    },

#### Paso 1: Clonar o descargar el proyecto  },

```bash])

# Si tienes Git instalado```

git clone <url-del-repositorio>
cd InvestigacionOperacionesModelosMatematicos

# O descargar el ZIP y extraer
```

#### Paso 2: Instalar dependencias
```bash
npm install
```

#### Paso 3: Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

#### Comandos adicionales
```bash
# Verificar errores de TypeScript
npm run lint

# Compilar TypeScript
npm run build

# Previsualizar build de producción
npm run preview
```

### B. Modo Ejecutable/Entrega

#### Opción 1: Build para producción
```bash
npm run build
```
Los archivos compilados estarán en la carpeta `dist/`. Para servir:
```bash
npm run preview
```

#### Opción 2: Despliegue web
Los archivos en `dist/` pueden ser desplegados en:
- **Netlify**: Arrastrar carpeta `dist/`
- **Vercel**: Conectar repositorio GitHub
- **GitHub Pages**: Configurar workflow de CI/CD

#### Opción 3: Servidor local simple
```bash
# Instalar servidor HTTP global
npm install -g http-server

# Servir desde dist/
cd dist
http-server -p 8080
```

Acceder en: `http://localhost:8080`

---

## 4. 🔄 Flujo de Uso

### Diagrama de Flujo

```
[Inicio]
   ↓
[Crear/Cargar Problema]
   ↓
[Ingresar Matriz de Costos + Oferta + Demanda]
   ↓
[Seleccionar Método Inicial]
   ├─→ Esquina Noroeste
   └─→ Costo Mínimo
         ↓
[Calcular Solución Inicial]
         ↓
[Aplicar Método Multiplicadores (MODI)]
         ↓
[Mostrar Solución Óptima]
         ↓
     ¿Ver Pasos?
    Sí ↓     ↓ No
[Paso a Paso] [Comparar Resultados]
         ↓
    ¿Nuevo Problema?
    Sí ↓     ↓ No
[Reiniciar]  [Fin]
```

### Pasos detallados:

1. **Inicio**: Al cargar la aplicación, se muestra un modal para crear un nuevo problema
2. **Configuración**: Definir número de orígenes y destinos (2-10 cada uno)
3. **Entrada de Datos**: Ingresar costos unitarios, oferta y demanda
4. **Selección de Método**: Elegir entre Esquina Noroeste o Costo Mínimo
5. **Cálculo Automático**: El sistema calcula la solución inicial y la optimiza
6. **Visualización**: Se muestran ambas soluciones lado a lado con comparación de costos
7. **Análisis Detallado**: Opcionalmente, ver el proceso paso a paso con fórmulas

---

## 5. 🖥️ Pantallas y Controles

### 5.1 Barra de Navegación Superior

![Barra de Navegación](docs/images/barra-navegacion.png)
<!-- Insertar imagen aquí -->

| Botón | Función | Disponibilidad |
|-------|---------|----------------|
| **➕ NUEVO PROBLEMA** | Crear un problema desde cero | Siempre |
| **✏️ EDITAR VALORES** | Modificar el problema actual | Cuando hay problema cargado |
| **🔄 RESOLVER CON OTRO MÉTODO** | Cambiar método inicial | Cuando hay solución |
| **👁️ VER PASOS / OCULTAR PASOS** | Mostrar/ocultar explicación detallada | Cuando hay solución |

### 5.2 Modal de Entrada de Datos

![Modal de Entrada](docs/images/modal-entrada.png)
<!-- Insertar imagen aquí -->

**Controles:**
- **Orígenes (Filas)**: Selector numérico 2-10
- **Destinos (Columnas)**: Selector numérico 2-10
- **Cargar Ejemplo**: Menú desplegable con 4 ejemplos predefinidos
  - Ejemplo (a)
  - Ejemplo (b)
  - Ejemplo (c)
  - Silos y Molinos
- **Nombres Personalizados**: Campos editables para cada origen/destino
- **Matriz de Costos**: Tabla con inputs numéricos para costos unitarios
- **Oferta**: Columna amarilla con disponibilidad de cada origen
- **Demanda**: Fila verde con requerimiento de cada destino

### 5.3 Selector de Método

![Selector de Método](docs/images/selector-metodo.png)
<!-- Insertar imagen aquí -->

Dos tarjetas interactivas:
- **↖️ Esquina Noroeste** (Básico)
- **💰 Costo Mínimo** (Intermedio)

### 5.4 Visualización de Resultados

![Comparación de Resultados](docs/images/comparacion-resultados.png)
<!-- Insertar imagen aquí -->

**Elementos visuales:**
- **Matriz de Solución Inicial**: Muestra asignaciones con método seleccionado
- **Matriz de Solución Óptima**: Resultado optimizado con Método Multiplicadores
- **Código de colores**:
  - 🟢 Verde: Celdas con asignación (variables básicas)
  - ⬜ Blanco: Celdas sin asignación
  - 🟡 Amarillo: Columna de oferta
  - 🔵 Azul: Fila de demanda, columna de ui
  - 🔴 Rojo: Variables no básicas (valores positivos)

### 5.5 Vista Paso a Paso

![Vista Paso a Paso](docs/images/vista-paso-a-paso.png)
<!-- Insertar imagen aquí -->

**Componentes:**
- Barra de progreso (Paso X de Y)
- Botones de navegación ← Anterior / Siguiente →
- Título y descripción del paso actual
- Matriz con estado en cada iteración
- Fórmulas matemáticas con explicaciones
- Tooltips informativos al pasar el mouse

---

## 6. 🔢 Métodos Implementados

### 6.1 Método de la Esquina Noroeste (North-West Corner)

**Descripción:**  
Método heurístico simple que comienza en la celda superior izquierda (esquina noroeste) y asigna la máxima cantidad posible, moviéndose hacia la derecha o hacia abajo según se agote la oferta o se satisfaga la demanda.

**Algoritmo:**
```
1. Iniciar en celda (1,1) - esquina superior izquierda
2. Asignar: min(oferta[i], demanda[j])
3. Actualizar oferta y demanda disponibles
4. SI oferta[i] = 0 ENTONCES mover a fila i+1
5. SI demanda[j] = 0 ENTONCES mover a columna j+1
6. Repetir hasta satisfacer toda la oferta y demanda
```

**Características:**
- ✅ Muy rápido y simple de implementar
- ✅ Siempre genera una solución factible
- ❌ No considera los costos, por lo que puede dar soluciones costosas
- ⚠️ Genera exactamente m + n - 1 variables básicas

**Complejidad:** O(m + n)

### 6.2 Método del Costo Mínimo (Minimum Cost)

**Descripción:**  
Método heurístico que selecciona iterativamente la celda con el menor costo unitario disponible y asigna la máxima cantidad posible, buscando minimizar el costo total desde el inicio.

**Algoritmo:**
```
1. Identificar celda (i,j) con menor costo no asignada
2. Asignar: min(oferta[i], demanda[j])
3. Actualizar oferta[i] y demanda[j]
4. SI oferta[i] = 0 ENTONCES eliminar fila i
5. SI demanda[j] = 0 ENTONCES eliminar columna j
6. Repetir hasta satisfacer toda la oferta y demanda
```

**Características:**
- ✅ Considera los costos en cada asignación
- ✅ Generalmente produce mejores soluciones iniciales que Esquina Noroeste
- ✅ Mantiene m + n - 1 variables básicas
- ⚠️ Ligeramente más complejo que Esquina Noroeste

**Complejidad:** O((m × n)²) en el peor caso

### 6.3 Método de Multiplicadores (MODI)

**Descripción:**  
Método de optimización que mejora iterativamente una solución inicial factible hasta encontrar la solución óptima. Utiliza multiplicadores (ui, vj) para evaluar si se puede reducir el costo.

**Algoritmo:**
```
REPETIR:
  1. Calcular multiplicadores ui y vj
     Para cada celda básica: ui + vj = Cij
     Comenzar con u1 = 0
  
  2. Calcular variables no básicas
     Para cada celda no básica: θij = Ui + Vj - Cij
  
  3. Verificar optimalidad
     SI todas θij ≤ 0 ENTONCES SOLUCIÓN ÓPTIMA
  
  4. Seleccionar celda entrante
     Celda con mayor θij positivo
  
  5. Formar ciclo cerrado
     Encontrar camino desde celda entrante
  
  6. Calcular theta (θ)
     θ = mínimo de celdas negativas en el ciclo
  
  7. Ajustar asignaciones
     Sumar θ en celdas (+)
     Restar θ en celdas (-)
HASTA encontrar solución óptima
```

**Características:**
- ✅ Garantiza encontrar la solución óptima
- ✅ Método eficiente para problemas de transporte
- ✅ Maneja casos degenerados (variables básicas con valor 0)
- ℹ️ Número de iteraciones varía según el problema

---

## 7. 📝 Formato de Entrada

### 7.1 Validaciones Automáticas

El sistema valida automáticamente:

| Validación | Regla | Mensaje de Error |
|------------|-------|------------------|
| **Dimensiones** | 2 ≤ orígenes, destinos ≤ 10 | "Las dimensiones deben estar entre 2 y 10" |
| **Balance** | Σ oferta = Σ demanda | "La oferta total (X) debe ser igual a la demanda total (Y)" |
| **Valores no negativos** | Todos ≥ 0 | "No puede haber valores negativos" |
| **Valores numéricos** | Tipo `number` | "Ingrese solo números válidos" |
| **Completitud** | Todos los campos llenos | "Complete todos los campos" |

### 7.2 Estructura de Datos

```typescript
interface ProblemaTransporte {
  costos: number[][];           // Matriz m×n de costos
  oferta: number[];             // Vector de m elementos
  demanda: number[];            // Vector de n elementos
  filas: number;                // Número de orígenes (m)
  columnas: number;             // Número de destinos (n)
  nombresOrigenes: string[];    // Etiquetas personalizadas
  nombresDestinos: string[];    // Etiquetas personalizadas
}
```

### 7.3 Ejemplo de Entrada Válida

```json
{
  "filas": 3,
  "columnas": 4,
  "costos": [
    [10, 2, 20, 11],
    [12, 7, 9, 20],
    [4, 14, 16, 18]
  ],
  "oferta": [15, 25, 10],
  "demanda": [5, 15, 15, 15],
  "nombresOrigenes": ["Silo 1", "Silo 2", "Silo 3"],
  "nombresDestinos": ["Molino 1", "Molino 2", "Molino 3", "Molino 4"]
}
```

**Verificación:** Σ oferta = 15+25+10 = 50 = Σ demanda = 5+15+15+15 ✅

---

## 8. 🎬 Ejemplo de Corrida de Programa

### 8.1 Problema Ejemplo: Silos y Molinos

**Contexto:** Una empresa de alimentos tiene 3 silos de almacenamiento que deben abastecer a 4 molinos. Se busca minimizar el costo de transporte.

#### Datos del Problema

| | Molino 1 | Molino 2 | Molino 3 | Molino 4 | **Oferta** |
|---------|----------|----------|----------|----------|------------|
| **Silo 1** | 10 | 2 | 20 | 11 | **15** |
| **Silo 2** | 12 | 7 | 9 | 20 | **25** |
| **Silo 3** | 4 | 14 | 16 | 18 | **10** |
| **Demanda** | **5** | **15** | **15** | **15** | **50** |

---

### 8.2 Método Esquina Noroeste - Asignaciones

![Esquina Noroeste - Proceso](docs/images/esquina-noroeste-proceso.png)
<!-- Insertar imagen del proceso paso a paso -->

#### Solución Inicial - Esquina Noroeste

| | Molino 1 | Molino 2 | Molino 3 | Molino 4 | Oferta |
|---------|----------|----------|----------|----------|--------|
| **Silo 1** | **5** | **10** | - | - | 15 |
| **Silo 2** | - | **5** | **15** | **5** | 25 |
| **Silo 3** | - | - | - | **10** | 10 |
| **Demanda** | 5 | 15 | 15 | 15 | 50 |

**Costo Total:**
```
Costo = (5×10) + (10×2) + (5×7) + (15×9) + (5×20) + (10×18)
      = 50 + 20 + 35 + 135 + 100 + 180
      = $520.00
```

![Resultado Esquina Noroeste](docs/images/resultado-esquina-noroeste.png)
<!-- Insertar captura de pantalla del resultado -->

---

### 8.3 Método Costo Mínimo - Asignaciones

![Costo Mínimo - Proceso](docs/images/costo-minimo-proceso.png)
<!-- Insertar imagen del proceso paso a paso -->

#### Solución Inicial - Costo Mínimo

| | Molino 1 | Molino 2 | Molino 3 | Molino 4 | Oferta |
|---------|----------|----------|----------|----------|--------|
| **Silo 1** | - | **15** | - | - | 15 |
| **Silo 2** | - | - | **15** | **10** | 25 |
| **Silo 3** | **5** | - | - | **5** | 10 |
| **Demanda** | 5 | 15 | 15 | 15 | 50 |

**Costo Total:**
```
Costo = (15×2) + (15×9) + (10×20) + (5×4) + (5×18)
      = 30 + 135 + 200 + 20 + 90
      = $475.00
```

![Resultado Costo Mínimo](docs/images/resultado-costo-minimo.png)
<!-- Insertar captura de pantalla del resultado -->

---

### 8.4 Optimización con Método Multiplicadores

![Iteraciones MODI](docs/images/iteraciones-modi.png)
<!-- Insertar capturas de las iteraciones -->

#### Iteración 1: Cálculo de Multiplicadores

**Ecuaciones para variables básicas:**
```
u₁ = 0 (valor inicial)
v₂ = C₁₂ - u₁ = 2 - 0 = 2
u₂ = C₂₂ - v₂ = 7 - 2 = 5
v₃ = C₂₃ - u₂ = 9 - 5 = 4
v₄ = C₂₄ - u₂ = 20 - 5 = 15
u₃ = C₃₄ - v₄ = 18 - 15 = 3
v₁ = C₃₁ - u₃ = 4 - 3 = 1
```

**Resumen:**
- ui: u₁=0, u₂=5, u₃=3
- vj: v₁=1, v₂=2, v₃=4, v₄=15

![Multiplicadores Calculados](docs/images/multiplicadores.png)
<!-- Insertar captura de los multiplicadores -->

#### Iteración 2: Variables No Básicas

**Fórmula:** θij = Ui + Vj - Cij

```
θ₁₁ = u₁ + v₁ - C₁₁ = 0 + 1 - 10 = -9
θ₁₃ = u₁ + v₃ - C₁₃ = 0 + 4 - 20 = -16
θ₁₄ = u₁ + v₄ - C₁₄ = 0 + 15 - 11 = +4  ← Positivo!
θ₂₁ = u₂ + v₁ - C₂₁ = 5 + 1 - 12 = -6
θ₂₂ = u₂ + v₂ - C₂₂ = 5 + 2 - 7 = 0
θ₃₂ = u₃ + v₂ - C₃₂ = 3 + 2 - 14 = -9
θ₃₃ = u₃ + v₃ - C₃₃ = 3 + 4 - 16 = -9
```

![Variables No Básicas](docs/images/variables-no-basicas.png)
<!-- Insertar captura con las variables calculadas -->

#### Solución Óptima Final

| | Molino 1 | Molino 2 | Molino 3 | Molino 4 | Oferta |
|---------|----------|----------|----------|----------|--------|
| **Silo 1** | - | **5** | - | **10** | 15 |
| **Silo 2** | - | **10** | **15** | **0** | 25 |
| **Silo 3** | **5** | - | - | **5** | 10 |
| **Demanda** | 5 | 15 | 15 | 15 | 50 |

**Costo Óptimo:**
```
Costo = (5×2) + (10×11) + (10×7) + (15×9) + (5×4) + (5×18)
      = 10 + 110 + 70 + 135 + 20 + 90
      = $435.00
```

![Solución Óptima](docs/images/solucion-optima.png)
<!-- Insertar captura de la solución final -->

### 8.5 Comparación de Resultados

![Comparación Final](docs/images/comparacion-final.png)
<!-- Insertar captura de la comparación -->

| Método | Costo Total | Mejora vs Anterior | % Mejora |
|--------|-------------|-------------------|----------|
| **Esquina Noroeste** | $520.00 | - | - |
| **Costo Mínimo** | $475.00 | $45.00 | 8.65% |
| **Método Multiplicadores** | $435.00 | $40.00 | 8.42% |
| **Mejora Total** | - | **$85.00** | **16.35%** |

---

## 9. 📊 Interpretación de Resultados

### 9.1 Elementos de la Matriz de Solución

#### Celdas con Asignación (Variables Básicas)
```
┌─────────────┐
│ Costo: 2    │  ← Costo unitario de transporte
│ ════════════ │
│ Asig: 15    │  ← Cantidad asignada (xij)
└─────────────┘
```

- **Verde claro:** Indica que esta ruta está activa
- **Número superior:** Costo por unidad transportada
- **Número inferior:** Unidades asignadas

### 9.2 Indicadores en la Vista Paso a Paso

| Símbolo | Significado | Interpretación |
|---------|-------------|----------------|
| **ui** | Multiplicador de fila | Valor dual asociado a la oferta del origen i |
| **vj** | Multiplicador de columna | Valor dual asociado a la demanda del destino j |
| **θij** | Variable no básica | Mejora potencial al asignar a la celda (i,j) |
| **[+θ]** | Incremento en el ciclo | Celda donde se suma theta |
| **[-θ]** | Decremento en el ciclo | Celda donde se resta theta |
| **→ ← ↑ ↓** | Dirección del ciclo | Flujo de ajuste en la iteración |

### 9.3 Interpretación Económica

#### Costo Total
```
Costo Total = Σ Σ (Cij × Xij)
              i j
```
Representa el costo total de transportar todas las unidades.

#### Porcentaje de Mejora
```
% Mejora = (Ahorro / Costo Inicial) × 100
```
Indica qué tan buena era la solución inicial comparada con la óptima.

---

## 10. ❌ Errores y Cómo Resolverlos

### 10.1 Errores de Entrada

#### Error: "La oferta total debe ser igual a la demanda total"

**Solución:**
1. Verificar que Σ oferta = Σ demanda
2. Si el problema es real y desbalanceado, agregar origen o destino ficticio

#### Error: "No puede haber valores negativos"

**Solución:**
- Revisar todos los inputs
- Asegurar que todos los valores sean ≥ 0

### 10.2 Errores de Ejecución

#### Error: "No se pudieron calcular todos los valores ui/vj"

**Solución:**
- El sistema maneja automáticamente la degeneración
- Si persiste, recargar la página e intentar nuevamente

---

## 11. ❓ Preguntas Frecuentes

**P: ¿Cuál método inicial debo elegir?**  
R: 
- **Esquina Noroeste:** Para entender el concepto básico
- **Costo Mínimo:** Para obtener mejores soluciones iniciales
- Ambos llegarán a la misma solución óptima tras aplicar MODI

**P: ¿Por qué hay variables básicas con valor 0?**  
R: Es un caso de **degeneración** en programación lineal. Es normal y el algoritmo lo maneja correctamente.

**P: ¿Puedo exportar los resultados?**  
R: Recomendamos captura de pantalla (Win + Shift + S)

---

## 12. 📚 Descripción del Proyecto

Este proyecto fue desarrollado como parte del curso de **Investigación de Operaciones**. Proporciona una herramienta educativa para resolver **Problemas de Transporte** usando métodos de optimización clásicos.

### Alcance del Sistema

#### ✅ Métodos Iniciales
- Método de la Esquina Noroeste (North-West Corner)
- Método del Costo Mínimo (Minimum Cost)

#### ✅ Métodos de Optimización
- Método de Multiplicadores (MODI)

#### ✅ Visualización
- Matrices interactivas con código de colores
- Tooltips informativos
- Comparación lado a lado de soluciones
- Progreso paso a paso con explicaciones

---

## 13. 🛠️ Tecnologías Usadas

### Stack Completo

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 19.1.1 | Framework de UI |
| **TypeScript** | 5.9.3 | Lenguaje principal |
| **Vite** | 7.1.14 | Build tool |
| **Bootstrap** | 5.3.8 | Framework CSS |
| **Node.js** | 20+ | Runtime |

### Estructura del Proyecto

```
src/
├── componentes/              # Componentes React
│   ├── BarraNavegacion.tsx
│   ├── EntradaMatrizModal.tsx
│   ├── SelectorMetodo.tsx
│   ├── VisualizadorMatrizMejorado.tsx
│   └── PasosExplicativosMejorados.tsx
│
├── utilidades/               # Lógica de negocio
│   ├── metodosIniciales.ts
│   └── metodoMODI.ts
│
├── tipos/                    # Definiciones TypeScript
│   └── tipos.ts
│
├── App.tsx                   # Componente principal
└── main.tsx                  # Entry point
```

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│        CAPA DE PRESENTACIÓN                 │
│     (React Components + Bootstrap UI)       │
├─────────────────────────────────────────────┤
│        CAPA DE LÓGICA DE NEGOCIO            │
│   - metodosIniciales.ts                     │
│   - metodoMODI.ts                           │
├─────────────────────────────────────────────┤
│            CAPA DE TIPOS                    │
│   - tipos.ts (TypeScript Interfaces)        │
└─────────────────────────────────────────────┘
```

---

## 👥 Equipo de Desarrollo

| Nombre | Carné | Rol |
|--------|-------|-----|
| **Jeferson David Espina Zabala** | 5190-23-2907 | Desarrollador |
| **Luis Alejandro Corado Castellanos** | 5190-23-4073 | Desarrollador |
| **Samuel Isaac Escobar Vasquez** | 5190-23-1952 | Desarrollador |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de Investigación de Operaciones.

---

**Versión del Manual:** 1.0  
**Última actualización:** Octubre 2025  
**Versión de la Aplicación:** 1.0.0

---

*Desarrollado con ❤️ para la Universidad*

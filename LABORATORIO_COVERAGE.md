# Laboratorio Práctico - GitHub Actions con Coverage 80%

## 📋 Descripción del Proyecto

Este proyecto implementa un workflow de GitHub Actions con un coverage mínimo del 80% para una aplicación de gestión de tareas (Todo App) construida con Node.js, Express y MongoDB.

## 🎯 Objetivos Cumplidos

✅ Configurar un workflow de GitHub Actions  
✅ Implementar pruebas de integración con Jest  
✅ Alcanzar un coverage del 80% en todas las métricas  
✅ Configurar status checks automáticos  

## 📊 Resultados de Coverage

El proyecto alcanza los siguientes niveles de cobertura:

```
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |   91.83 |      100 |   83.33 |   93.61 |                   
 src             |    87.5 |      100 |       0 |     100 |                   
  app.js         |    87.5 |      100 |       0 |     100 |                   
 src/models      |     100 |      100 |     100 |     100 |                   
  tarea.model.js |     100 |      100 |     100 |     100 |                   
 src/routes      |    92.1 |      100 |     100 |   91.89 |                   
  tareas.js      |    92.1 |      100 |     100 |   91.89 |                   
-----------------|---------|----------|---------|---------|-------------------
```

### Métricas Alcanzadas:
- **Statements**: 91.83% ✅ (Objetivo: 80%)
- **Branches**: 100% ✅ (Objetivo: 80%)
- **Functions**: 83.33% ✅ (Objetivo: 80%)
- **Lines**: 93.61% ✅ (Objetivo: 80%)

## 🔧 Configuración del Proyecto

### 1. Dependencias

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.18.2"
  },
  "devDependencies": {
    "jest": "^30.1.3",
    "mongodb-memory-server": "^10.2.1",
    "supertest": "^7.1.4"
  }
}
```

### 2. Configuración de Jest

En `package.json`:

```json
{
  "scripts": {
    "test": "jest --detectOpenHandles --forceExit",
    "test:coverage": "jest --coverage --detectOpenHandles --forceExit"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### 3. GitHub Actions Workflow

Archivo: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests with coverage
      run: npm run test:coverage
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      if: matrix.node-version == '20.x'
      with:
        files: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: false
```

## 🧪 Pruebas Implementadas

### Endpoints Cubiertos:

1. **POST /api/tareas** - Crear tarea
   - ✅ Creación exitosa
   - ✅ Validación de campos requeridos

2. **GET /api/tareas** - Obtener todas las tareas
   - ✅ Lista con tareas
   - ✅ Lista vacía

3. **GET /api/tareas/:id** - Obtener tarea específica
   - ✅ Tarea existente
   - ✅ Tarea inexistente (404)

4. **PUT /api/tareas/:id** - Actualizar tarea
   - ✅ Actualización exitosa
   - ✅ Tarea inexistente (404)

5. **DELETE /api/tareas/:id** - Eliminar tarea
   - ✅ Eliminación exitosa
   - ✅ Tarea inexistente (404)

### Total de Pruebas: 15 tests

```
Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
```

## 🚀 Cómo Ejecutar

### Instalación

```bash
npm install
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con reporte de coverage
npm run test:coverage
```

### Ver el Workflow en GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña "Actions"
3. Verás los workflows ejecutándose automáticamente en cada push/PR

## 📸 Capturas de Pantalla Requeridas

Para completar el laboratorio, debes incluir capturas de pantalla de:

1. **GitHub Actions Dashboard** mostrando el workflow ejecutándose
2. **Detalles del Workflow** mostrando todos los pasos completados exitosamente
3. **Logs del Coverage** mostrando que se alcanzó el 80%
4. **Status Checks** en un Pull Request (opcional pero recomendado)

## 🔗 Enlaces

- **Repositorio**: https://github.com/Pablotechedu/LaboratorioTesting
- **GitHub Actions**: https://github.com/Pablotechedu/LaboratorioTesting/actions

## 📝 Notas Importantes

1. El workflow se ejecuta automáticamente en:
   - Cada push a la rama `main`
   - Cada Pull Request hacia `main`

2. El workflow prueba el código en dos versiones de Node.js:
   - Node.js 18.x
   - Node.js 20.x

3. Si el coverage cae por debajo del 80%, el workflow fallará automáticamente

4. Los reportes de coverage se suben a Codecov para análisis detallado

## 👨‍💻 Autor

Pablo Aguilar - Universidad Galileo

## 📅 Fecha

Noviembre 2025

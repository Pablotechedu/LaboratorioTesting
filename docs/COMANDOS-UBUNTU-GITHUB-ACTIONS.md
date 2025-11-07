# Guía de Comandos Importantes en Ubuntu y GitHub Actions

Esta guía resume los comandos más útiles que se utilizan tanto en **entornos Ubuntu/Linux** como dentro de los **pipelines de GitHub Actions**.  
Ideal para desarrolladores que comienzan a automatizar pruebas y despliegues.

---

## Comandos Básicos del Shell

| **Comando** | **Definición / Propósito** | **Ejemplo Práctico** |
|--------------|----------------------------|------------------------|
| `pwd` | Muestra el directorio actual. | `pwd` → `/home/runner/work/myproject` |
| `ls` | Lista los archivos y carpetas en el directorio actual. | `ls -la` (muestra archivos ocultos también) |
| `cd` | Cambia de directorio. | `cd src` |
| `mkdir` | Crea un nuevo directorio. | `mkdir tests` |
| `rm` | Elimina archivos o carpetas. | `rm file.txt` o `rm -rf dist/` |
| `cat` | Muestra el contenido de un archivo. | `cat package.json` |
| `echo` | Imprime texto o variables en la terminal. | `echo "Hola Mundo"` |
| `touch` | Crea un archivo vacío. | `touch app.js` |
| `cp` | Copia archivos o carpetas. | `cp index.js backup.js` |
| `mv` | Mueve o renombra archivos. | `mv old.js new.js` |
| `clear` | Limpia la pantalla del terminal. | `clear` |

---

## Comandos de Búsqueda y Filtrado

| **Comando** | **Definición / Propósito** | **Ejemplo Práctico** |
|--------------|----------------------------|------------------------|
| `grep` | Busca texto dentro de archivos o variables. | `grep "test" index.js` |
| `grep -E` | Usa expresiones regulares extendidas (más potentes). | `grep -E "[0-9]+" file.txt` |
| `grep -o` | Muestra **solo** las coincidencias encontradas, no la línea completa. | `grep -oE "[0-9]+"` |
| `tail` | Muestra las últimas líneas de un archivo. | `tail -n 10 log.txt` |
| `head` | Muestra las primeras líneas. | `head -5 README.md` |
| `cut` | Recorta texto según un delimitador. | `echo "92.50" | cut -d'.' -f1` → `92` |
| `awk` | Procesa texto por columnas o patrones. | `awk '{print $4}'` → imprime la 4ta columna |
| `sort` | Ordena texto o números. | `sort nombres.txt` |
| `uniq` | Elimina líneas duplicadas. | `sort data.txt | uniq` |
| `wc` | Cuenta líneas, palabras y caracteres. | `wc -l logs.txt` → cuenta líneas |

---

## Comandos para Automatización (CI/CD)

| **Comando** | **Definición / Propósito** | **Ejemplo Práctico** |
|--------------|----------------------------|------------------------|
| `npm run` | Ejecuta scripts definidos en `package.json`. | `npm run test:coverage` |
| `2>&1` | Redirige errores (stderr) hacia la salida estándar (stdout). | `npm run test 2>&1` |
| `$( ... )` | Ejecuta un comando y guarda su resultado en una variable. | `RESULT=$(ls -la)` |
| `export VAR=value` | Define una variable de entorno. | `export NODE_ENV=production` |
| `if [ condición ]; then ... fi` | Estructura condicional en bash. | `if [ "$x" -gt 10 ]; then echo "OK"; fi` |
| `exit 1` | Termina el script con error (fallo del pipeline). | `exit 1` → marca el job como “failed” |
| `chmod` | Cambia permisos de archivos. | `chmod +x script.sh` |
| `which` | Muestra la ruta de un comando. | `which node` → `/usr/bin/node` |
| `printenv` | Muestra todas las variables de entorno. | `printenv | grep COVERAGE` |

---

## Comandos Útiles en GitHub Actions

| **Comando / Función** | **Definición / Propósito** | **Ejemplo Práctico** |
|------------------------|----------------------------|------------------------|
| `${{ env.VAR }}` | Accede a una variable definida en `env:`. | `${{ env.COVERAGE_THRESHOLD }}` |
| `if: always()` | Hace que un paso se ejecute siempre, incluso si los anteriores fallan. | `if: always()` |
| `runs-on` | Define el sistema operativo en el que se ejecuta el job. | `runs-on: ubuntu-latest` |
| `uses:` | Ejecuta una acción predefinida. | `uses: actions/checkout@v4` |
| `with:` | Pasa parámetros a una acción. | `with: node-version: '18'` |
| `run:` | Define comandos de shell a ejecutar. | `run: npm ci` |
| `jobs:` | Agrupa pasos (`steps`) de un flujo de trabajo. | `jobs: build:` |
| `steps:` | Lista de acciones o comandos que se ejecutarán. | `steps: - name: Build` |
| `name:` | Título descriptivo de una acción o paso. | `name: Ejecutar pruebas` |
| `env:` | Define variables de entorno globales o locales. | `env: NODE_ENV: test` |

---

## Ejemplo de Uso Combinado en un Workflow

```yaml
- name: "Verificar cobertura"
  run: |
    COVERAGE_OUTPUT=$(npm run test:coverage -- --silent 2>&1)
    COVERAGE_LINE=$(echo "$COVERAGE_OUTPUT" | grep "All files")
    COVERAGE_PERCENT=$(echo "$COVERAGE_LINE" | grep -oE '[0-9]+\.[0-9]+' | head -1)
    COVERAGE_INT=$(echo "$COVERAGE_PERCENT" | cut -d'.' -f1)
    THRESHOLD=${{ env.COVERAGE_THRESHOLD }}

    echo "Coverage detectado: $COVERAGE_INT%"
    if [ "$COVERAGE_INT" -lt "$THRESHOLD" ]; then
      echo "Cobertura insuficiente ($COVERAGE_INT% < $THRESHOLD%)"
      exit 1
    else
      echo "Cobertura aceptable ($COVERAGE_INT% >= $THRESHOLD%)"
    fi
```

---

## Conclusión

Con estos comandos dominarás la ejecución de scripts dentro de **pipelines CI/CD** en GitHub Actions.  

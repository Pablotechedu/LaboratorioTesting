const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app");
const Tarea = require("../../src/models/tarea.model");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Tarea.deleteMany();
});

describe("EJEMPLOS PRACTICOS DE PRUEBAS DE INTEGRACION", () => {
  // EJERCICIO 1: Implementar la prueba para crear una tarea

  test("POST /api/tareas crea una tarea", async () => {
    const nuevaTarea = {
      title: "Mi primera tarea",
    };

    const res = await request(app).post("/api/tareas").send(nuevaTarea);

    expect(res.statusCode).toBe(201);

    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe("Mi primera tarea");

    // Verificar en la base de datos
    const tareasEnDB = await Tarea.find();
    expect(tareasEnDB).toHaveLength(1);
  });

  // test("TODO: POST /api/tareas crea una tarea", async () => {
  //   // PISTA:
  //   // 1. Define el objeto `nuevaTarea` con el `title`.
  //   const newTask = {
  //     title: "Tarea de prueba",
  //   };
  //   // 2. Haz una petición `POST` usando `supertest`.
  //   const res = await request(app).post("/api/tareas").send(newTask);
  //   // 3. Verifica el `statusCode` de la respuesta (debe ser 201).
  //   expect(res.statusCode).toBe(201);
  //   // 4. Asegúrate de que el cuerpo de la respuesta contenga el título y un `_id`.
  //   expect(res.body._id).toBeDefined();
  //   expect(res.body.title).toBe(newTask.title);
  //   expect(res.body.title).toBe("Tarea de prueba");

  //   const tareaInDB = await Tarea.find();
  //   console.log("👨🏻‍💻 Revisión de datos creados en la prueba", tareaInDB);

  //   // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
  //   // - POST se usa para crear nuevos recursos
  //   // - Código 201 Created indica que el recurso fue creado exitosamente
  //   // - Verificar que el _id esté definido confirma que se guardó en BD
  //   // - Siempre verificar tanto la respuesta HTTP como la base de datos
  // });

  // EJERCICIO 2: Implementar la prueba para obtener todas las tareas
  test("TODO: GET /api/tareas devuelve todas las tareas", async () => {
    // PISTA:
    // 1. Crea varias tareas directamente en la base de datos usando `Tarea.create()`.
    await Tarea.create({ title: "Tarea 1" });
    await Tarea.create({ title: "Tarea finalizada", completed: true });

    // 2. Haz una petición `GET` a la API.
    const res = await request(app).get("/api/tareas");
    // 3. Verifica el `statusCode` (200) y que el array devuelto tenga la longitud correcta.
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body).toHaveLength(2);
    // 4. Asegúrate de que los títulos de las tareas en la respuesta coincidan con los que creaste.
    expect(res.body[0].title).toBe("Tarea 1");
    expect(res.body[1].title).toBe("Tarea finalizada");

    const TareaInDB = await Tarea.find();
    console.log(
      "👨🏻‍💻 GET - Revisión de datos en la BD antes de la prueba",
      TareaInDB
    );

    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - GET se usa para obtener recursos
    // - Código 200 OK indica éxito con datos
    // - Verificar longitud del array con .length o .toHaveLength()
    // - Verificar contenido específico de cada elemento del array
    // - Crear datos de prueba directamente en BD con Tarea.create()
  });

  // EJERCICIO 3: Implementar la prueba para obtener una tarea específica
  test("TODO: GET /api/tareas/:id devuelve una tarea específica", async () => {
    // PISTA:
    // 1. Crea una tarea en la base de datos para obtener su `_id`.
    // 2. Haz una petición `GET` a la ruta dinámica `/api/tareas/:id`.
    // 3. Verifica el `statusCode` (200) y que el `title` de la respuesta coincida con el de la tarea que creaste.

    const tarea = await Tarea.create({
      title: "Tarea específica",
      completed: false,
    });
    const res = await request(app).get(`/api/tareas/${tarea._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarea específica");
    expect(res.body._id).toBe(tarea._id.toString());

    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - GET con parámetro dinámico :id en la URL
    // - Usar template literals para construir URLs dinámicas
    // - Convertir ObjectId a string con .toString() para comparación
    // - Verificar que se devuelve exactamente la tarea solicitada
  });

  // ✅ EJERCICIO 4: Implementar la prueba para un ID inexistente
  test("TODO: GET /api/tareas/:id devuelve 404 para un ID inexistente", async () => {
    // PISTA:
    // 1. Crea un ID válido pero que no exista en la base de datos (por ejemplo, `new mongoose.Types.ObjectId()`).
    // 2. Haz una petición `GET` a la API con este ID.
    // 3. Verifica que la respuesta tenga un `statusCode` de 404.

    const idInexistente = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tareas/${idInexistente}`);

    expect(res.statusCode).toBe(404);

    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - Diferencia entre ID inválido vs ID inexistente
    // - new mongoose.Types.ObjectId() crea un ID válido pero que no existe en BD
    // - Código 404 Not Found indica que el recurso no existe
    // - ID válido pero inexistente: 404
    // - ID inválido (formato incorrecto): 500
  });

  // EJERCICIO 5: Implementar la prueba para un campo requerido
  test("TODO: POST /api/tareas valida campos requeridos", async () => {
    // PISTA:
    // 1. Haz una petición `POST` con un objeto vacío o sin el campo `title`.
    // 2. Verifica el `statusCode` de error y que el cuerpo de la respuesta contenga un mensaje de validación.

    const res = await request(app).post("/api/tareas").send({});

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");

    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - Validación de campos requeridos
    // - Sin validación del servidor, devuelve 500 (error interno)
    // - .toHaveProperty() verifica que existe una propiedad en el objeto
    // - Lo ideal sería que el servidor validara y devolviera 400
    // - Mismo concepto que ejercicios.test.js Ejercicio 3
  });

  // EJERCICIO 6: Implementar la prueba para una lista vacía
  test("TODO: GET /api/tareas devuelve un array vacío cuando no hay tareas", async () => {
    // PISTA:
    // 1. Asegúrate de que no haya tareas en la base de datos (`afterEach` se encarga de esto).
    // 2. Haz una petición `GET`.
    // 3. Verifica que la respuesta tenga un `statusCode` de 200 y que el cuerpo sea un array vacío.

    const res = await request(app).get("/api/tareas");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
    expect(res.body).toHaveLength(0);

    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - Probar casos cuando no hay datos (edge case)
    // - afterEach limpia la BD, garantizando que esté vacía
    // - .toEqual([]) verifica que sea exactamente un array vacío
    // - Código 200 OK es correcto incluso con array vacío
    // - Diferencia entre "no hay datos" (200 + []) vs "no encontrado" (404)
  });

  // NUEVAS PRUEBAS PARA ALCANZAR 80% DE COBERTURA

  // Prueba para actualizar una tarea (PUT)
  test("PUT /api/tareas/:id actualiza una tarea existente", async () => {
    const tarea = await Tarea.create({
      title: "Tarea original",
      completed: false,
    });

    const actualizacion = {
      title: "Tarea actualizada",
      completed: true,
    };

    const res = await request(app)
      .put(`/api/tareas/${tarea._id}`)
      .send(actualizacion);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarea actualizada");
    expect(res.body.completed).toBe(true);

    // Verificar en la base de datos
    const tareaActualizada = await Tarea.findById(tarea._id);
    expect(tareaActualizada.title).toBe("Tarea actualizada");
    expect(tareaActualizada.completed).toBe(true);
  });

  // Prueba para actualizar una tarea inexistente (PUT)
  test("PUT /api/tareas/:id devuelve 404 para una tarea inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const actualizacion = {
      title: "Tarea actualizada",
      completed: true,
    };

    const res = await request(app)
      .put(`/api/tareas/${idInexistente}`)
      .send(actualizacion);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  // Prueba para eliminar una tarea (DELETE)
  test("DELETE /api/tareas/:id elimina una tarea existente", async () => {
    const tarea = await Tarea.create({
      title: "Tarea a eliminar",
      completed: false,
    });

    const res = await request(app).delete(`/api/tareas/${tarea._id}`);

    expect(res.statusCode).toBe(204);

    // Verificar que la tarea fue eliminada de la base de datos
    const tareaEliminada = await Tarea.findById(tarea._id);
    expect(tareaEliminada).toBeNull();
  });

  // Prueba para eliminar una tarea inexistente (DELETE)
  test("DELETE /api/tareas/:id devuelve 404 para una tarea inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId();

    const res = await request(app).delete(`/api/tareas/${idInexistente}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

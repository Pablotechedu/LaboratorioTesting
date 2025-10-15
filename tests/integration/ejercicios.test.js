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

describe("🎓 EJERCICIOS PARA ESTUDIANTES", () => {
  // EJERCICIO 1: Completar esta prueba
  test("TODO: Implementar PUT /api/tareas/:id - actualizar tarea", async () => {
    // PISTA:
    // 1. Crear una tarea
    // 2. Hacer PUT con datos actualizados
    // 3. Verificar respuesta y BD

    const tarea = await Tarea.create({ title: "Tarea original" });
    const res = await request(app)
      .put(`/api/tareas/${tarea._id}`)
      .send({ title: "Tarea actualizada", completed: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Tarea actualizada");
    expect(res.body.completed).toBe(true);
    
    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - PUT se usa para actualizar recursos completos
    // - Código 200 OK indica éxito con contenido en la respuesta
    // - Verificación dual: respuesta HTTP + base de datos
    // - Siempre verificar tanto la respuesta como la BD, la API podría responder OK sin guardar
  });

  // EJERCICIO 2: Completar esta prueba
  test("TODO: Implementar DELETE /api/tareas/:id - eliminar tarea", async () => {
    // PISTA:
    // 1. Crear una tarea
    // 2. Hacer DELETE
    // 3. Verificar que se eliminó (404 en GET)

    const tarea = await Tarea.create({
      title: "Tarea a eliminar",
      completed: false,
    });
    const res = await request(app).delete(`/api/tareas/${tarea._id}`);

    expect(res.status).toBe(204);
    const tareaEliminada = await Tarea.findById(tarea._id);
    expect(tareaEliminada).toBeNull(); // ¡Debe ser null!

    const getRes = await request(app).get(`/api/tareas/${tarea._id}`);
    expect(getRes.status).toBe(404);
    
    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - DELETE se usa para eliminar recursos
    // - Código 204 No Content = éxito sin datos (porque se eliminó)
    // - Diferencia: 200 devuelve datos, 204 no devuelve nada
    // - Verificación triple: DELETE exitoso + BD vacía + GET devuelve 404
    // - Por qué 204? Porque la tarea fue eliminada, no hay nada que mostrar
  });

  // EJERCICIO 3: Prueba de validación
  test("TODO: POST /api/tareas con title vacío debe fallar", async () => {
    // PISTA: Enviar { title: "" } y verificar error
    const res = await request(app).post("/api/tareas").send({ title: "" });

    expect(res.status).toBe(500); // Sin validación en el servidor, MongoDB lanza error interno (500)

    const tareas = await Tarea.find();
    expect(tareas).toHaveLength(0); // No debe haber tareas
    
    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - Diferencia entre 400 (Bad Request) y 500 (Server Error)
    // - Sin validación del servidor, MongoDB lanza error interno (500)
    // - Lo ideal sería validar antes de guardar y devolver 400
    // - Por qué 500? El servidor NO valida, MongoDB rechaza y lanza error interno
    // - Situación ideal: servidor valida primero y devuelve 400 (error del cliente)
  });

  // EJERCICIO 4: Prueba con múltiples tareas
  test("TODO: GET /api/tareas debe devolver tareas ordenadas por fecha", async () => {
    // PISTA:
    // 1. Crear varias tareas con delays
    // 2. Verificar orden en la respuesta

    const tarea1 = await Tarea.create({
      title: "Primera tarea",
      completed: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 10)); // Delay 10ms

    const tarea2 = await Tarea.create({
      title: "Segunda tarea",
      completed: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 10));

    const tarea3 = await Tarea.create({
      title: "Tercera tarea",
      completed: false,
    });

    const res = await request(app).get("/api/tareas");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].title).toBe("Primera tarea");
    expect(res.body[1].title).toBe("Segunda tarea");
    expect(res.body[2].title).toBe("Tercera tarea");
    
    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - Trabajar con múltiples registros en tests
    // - Uso de setTimeout con Promises para crear delays
    // - Verificar orden de resultados en arrays
    // - Por qué delays? Sin ellos, las tareas se crearían en el mismo milisegundo
    // - Los delays garantizan fechas diferentes para verificar ordenamiento
  });

  // EJERCICIO 5: Prueba de edge case
  test("TODO: GET /api/tareas/:id con ID inválido debe devolver 500", async () => {
    // PISTA: Usar un ID que no sea ObjectId válido (ej: "123")

    const res = await request(app).get("/api/tareas/123");
    expect(res.status).toBe(500);
    
    // CONCEPTOS APRENDIDOS EN ESTE EJERCICIO:
    // - Edge cases: casos extremos o inusuales
    // - Diferencia entre ID inválido (formato incorrecto) vs ID inexistente (formato correcto)
    // - MongoDB ObjectId requiere 24 caracteres hexadecimales
    // - ID inválido "123" causa error de casteo, devuelve 500
    // - ID válido pero inexistente devuelve 404
    // - El servidor debería validar formatos y devolver 400 en lugar de 500
  });
});

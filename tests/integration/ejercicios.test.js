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

    expect(res.status).toBe(204); // Placeholder - ¡reemplazar!
    const tareaEliminada = await Tarea.findById(tarea._id);
    expect(tareaEliminada).toBeNull(); // ¡Debe ser null!

    const getRes = await request(app).get(`/api/tareas/${tarea._id}`);
    expect(getRes.status).toBe(404);
  });

  // EJERCICIO 3: Prueba de validación
  test("TODO: POST /api/tareas con title vacío debe fallar", async () => {
    // PISTA: Enviar { title: "" } y verificar error
    const res = await request(app).post("/api/tareas").send({ title: "" });

    expect(res.status).toBe(500); // Bad Request

    const tareas = await Tarea.find();
    expect(tareas).toHaveLength(0); // No debe haber tareas
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
  });

  // EJERCICIO 5: Prueba de edge case
  test("TODO: GET /api/tareas/:id con ID inválido debe devolver 500", async () => {
    // PISTA: Usar un ID que no sea ObjectId válido (ej: "123")

    const res = await request(app).get("/api/tareas/123");
    expect(res.status).toBe(500);
  });
});

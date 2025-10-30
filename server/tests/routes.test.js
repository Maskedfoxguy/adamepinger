// Manual integration checks for route handlers using in-memory model doubles.
process.env.NODE_ENV = "test";
process.env.TOKEN_SECRET = "test-secret";

const assert = require("node:assert/strict");
const { performance } = require("node:perf_hooks");
const express = require("express");

const { createProjectHandlers } = require("../routes/project.routes");
const { createSkillsHandlers } = require("../routes/skills.routes");
const { createAboutHandlers } = require("../routes/about.routes");
const { createContactHandlers } = require("../routes/contact.routes");
const { createAdminHandlers } = require("../routes/admin.routes");
const { isAdmin } = require("../middleware/jwt.isAdmin");
const { isAuthenticated } = require("../middleware/jwt.middleware");

function createObjectId(counter) {
  return counter.toString(16).padStart(24, "0");
}

function clone(doc) {
  return JSON.parse(JSON.stringify(doc));
}

class InMemoryDocument {
  constructor(source) {
    this._source = source;
  }

  set(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        delete this._source[key];
      } else {
        this._source[key] = value;
      }
    });
  }

  async save() {
    this._source.updatedAt = new Date().toISOString();
    return this;
  }

  toObject() {
    return clone(this._source);
  }
}

function wrapDocument(source) {
  if (!source) {
    return {
      lean: async () => null,
    };
  }

  const document = new InMemoryDocument(source);
  document.lean = async () => clone(source);
  return document;
}

function createQueryResult(producer) {
  return {
    sort(sortSpec = {}) {
      const data = producer();
      const entries = Object.entries(sortSpec);
      if (entries.length === 0) {
        return createQueryResult(() => data);
      }
      const [[key, direction]] = entries;
      const sorted = [...data].sort((a, b) => {
        const left = a[key];
        const right = b[key];
        if (left === undefined || right === undefined) {
          return 0;
        }
        if (left < right) {
          return direction < 0 ? 1 : -1;
        }
        if (left > right) {
          return direction < 0 ? -1 : 1;
        }
        return 0;
      });
      return createQueryResult(() => sorted);
    },
    lean: async () => producer().map((doc) => clone(doc)),
  };
}

function createSingleQueryResult(producer) {
  return {
    sort(sortSpec = {}) {
      const data = producer();
      const entries = Object.entries(sortSpec);
      const sorted = entries.length
        ? [...data].sort((a, b) => {
            const [key, direction] = entries[0];
            const left = a[key];
            const right = b[key];
            if (left === undefined || right === undefined) {
              return 0;
            }
            if (left < right) {
              return direction < 0 ? 1 : -1;
            }
            if (left > right) {
              return direction < 0 ? -1 : 1;
            }
            return 0;
          })
        : [...data];
      return {
        lean: async () => {
          const doc = sorted[0];
          return doc ? clone(doc) : null;
        },
      };
    },
    lean: async () => {
      const doc = producer()[0];
      return doc ? clone(doc) : null;
    },
  };
}

function createCollection(initialDocs = []) {
  let counter = 1;
  let docs = initialDocs.map((doc) => ({
    _id: doc._id ?? createObjectId(counter++),
    createdAt: doc.createdAt ?? new Date().toISOString(),
    updatedAt: doc.updatedAt ?? new Date().toISOString(),
    ...doc,
  }));

  return {
    list: () => docs,
    reset(newDocs = []) {
      counter = 1;
      docs = newDocs.map((doc) => ({
        _id: doc._id ?? createObjectId(counter++),
        createdAt: doc.createdAt ?? new Date().toISOString(),
        updatedAt: doc.updatedAt ?? new Date().toISOString(),
        ...doc,
      }));
    },
    find: () => createQueryResult(() => docs),
    findOne: () => createSingleQueryResult(() => docs),
    findById: (id) => {
      const doc = docs.find((item) => item._id === id);
      const materialized = doc ? wrapDocument(doc) : null;
      return {
        lean: async () => (doc ? clone(doc) : null),
        then: (resolve, reject) => Promise.resolve(materialized).then(resolve, reject),
      };
    },
    findByIdAndDelete: (id) => {
      const index = docs.findIndex((item) => item._id === id);
      const deleted = index >= 0 ? docs.splice(index, 1)[0] : null;
      return {
        lean: async () => (deleted ? clone(deleted) : null),
      };
    },
    create: async (payload) => {
      const doc = {
        _id: createObjectId(counter++),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...payload,
      };
      docs.push(doc);
      return wrapDocument(doc);
    },
  };
}

function createMockResponse() {
  const response = {
    statusCode: 200,
    body: undefined,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
    end(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
}

function createNextTracker() {
  let error = null;
  const next = (err) => {
    error = err;
  };
  next.getError = () => error;
  return next;
}

function createAdminTestContext() {
  const projectCollection = createCollection();
  const skillCollection = createCollection();
  const aboutCollection = createCollection();
  const contactCollection = createCollection();
  const adminCollection = createCollection();

  const adminModels = {
    ProjectModel: projectCollection,
    SkillModel: skillCollection,
    AboutModel: aboutCollection,
    ContactInfoModel: contactCollection,
    AdminModel: {
      findById: (id) => {
        const doc = adminCollection.list().find((entry) => entry._id === id);
        return {
          lean: async () => (doc ? clone(doc) : null),
        };
      },
    },
  };

  const { handlers } = createAdminHandlers(adminModels);

  return {
    handlers,
    projectCollection,
    skillCollection,
    aboutCollection,
    contactCollection,
    adminCollection,
  };
}

const tests = [];
function registerTest(name, fn) {
  tests.push({ name, fn });
}

registerTest("GET /api/portfolio returns projects sorted by start date", async () => {
  const projectCollection = createCollection([
    { _id: createObjectId(1), title: "Old", startDate: "2022-01-01T00:00:00.000Z" },
    { _id: createObjectId(2), title: "New", startDate: "2024-01-01T00:00:00.000Z" },
  ]);
  const { listProjects } = createProjectHandlers(projectCollection);
  const res = createMockResponse();
  const next = createNextTracker();

  await listProjects({}, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.map((project) => project.title), ["New", "Old"]);
});

registerTest("GET /api/portfolio/:id rejects malformed ids", async () => {
  const projectCollection = createCollection();
  const { getProjectById } = createProjectHandlers(projectCollection);
  const res = createMockResponse();
  const next = createNextTracker();

  await getProjectById({ params: { projectId: "invalid" } }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "Invalid project id." });
});

registerTest("GET /api/portfolio/:id returns 404 when project is missing", async () => {
  const projectCollection = createCollection();
  const { getProjectById } = createProjectHandlers(projectCollection);
  const res = createMockResponse();
  const next = createNextTracker();
  const missingId = createObjectId(5);

  await getProjectById({ params: { projectId: missingId } }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: "Project not found." });
});

registerTest("GET /api/about returns 404 when no document exists", async () => {
  const aboutCollection = createCollection();
  const { getLatestAbout } = createAboutHandlers(aboutCollection);
  const res = createMockResponse();
  const next = createNextTracker();

  await getLatestAbout({}, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 404);
});

registerTest("GET /api/skills lists skills alphabetically", async () => {
  const skillCollection = createCollection([
    { _id: createObjectId(8), name: "React" },
    { _id: createObjectId(9), name: "Algorithms" },
  ]);
  const { listSkills } = createSkillsHandlers(skillCollection);
  const res = createMockResponse();
  const next = createNextTracker();

  await listSkills({}, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.map((skill) => skill.name), ["Algorithms", "React"]);
});

registerTest("GET /api/contact returns latest contact info", async () => {
  const contactCollection = createCollection([
    { _id: createObjectId(3), email: "first@example.com", updatedAt: "2023-01-01T00:00:00.000Z" },
    { _id: createObjectId(4), email: "latest@example.com", updatedAt: "2024-01-01T00:00:00.000Z" },
  ]);
  const { getLatestContact } = createContactHandlers(contactCollection);
  const res = createMockResponse();
  const next = createNextTracker();

  await getLatestContact({}, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.email, "latest@example.com");
});

registerTest("Admin profile returns sanitized admin data", async () => {
  const context = createAdminTestContext();
  const adminId = createObjectId(7);
  context.adminCollection.reset([
    {
      _id: adminId,
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "hashed",
      role: "admin",
    },
  ]);

  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.getProfile({ payload: { _id: adminId } }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.email, "ada@example.com");
  assert.ok(!("password" in res.body));
});

registerTest("Admin project creation validates payload", async () => {
  const context = createAdminTestContext();
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.createProject({ body: {} }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 400);
  assert.ok(Array.isArray(res.body.errors));
});

registerTest("Admin project creation succeeds with valid payload", async () => {
  const context = createAdminTestContext();
  const payload = {
    title: "Portfolio",
    description: "Professional portfolio",
    status: "completed",
    startDate: "2023-01-01",
    endDate: "2023-06-01",
    technologies: ["Node", "React"],
  };
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.createProject({ body: payload }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.title, "Portfolio");
});

registerTest("Admin project update rejects missing project", async () => {
  const context = createAdminTestContext();
  const res = createMockResponse();
  const next = createNextTracker();
  const projectId = createObjectId(20);

  await context.handlers.updateProject(
    { params: { projectId }, body: { title: "Updated" } },
    res,
    next
  );

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 404);
});

registerTest("Admin project update enforces completion end date", async () => {
  const context = createAdminTestContext();
  const projectId = createObjectId(25);
  context.projectCollection.reset([
    {
      _id: projectId,
      title: "Portfolio",
      description: "Initial",
      status: "ongoing",
      startDate: "2023-01-01",
    },
  ]);
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.updateProject(
    { params: { projectId }, body: { status: "completed" } },
    res,
    next
  );

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 400);
  assert.ok(res.body.errors.some((error) => error.field === "endDate"));
});

registerTest("Admin project deletion returns 204", async () => {
  const context = createAdminTestContext();
  const projectId = createObjectId(30);
  context.projectCollection.reset([
    {
      _id: projectId,
      title: "To delete",
      description: "Temp",
      status: "ongoing",
      startDate: "2023-01-01",
    },
  ]);
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.deleteProject({ params: { projectId } }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 204);
});

registerTest("Admin skill update rejects empty payloads", async () => {
  const context = createAdminTestContext();
  const skillId = createObjectId(40);
  context.skillCollection.reset([
    { _id: skillId, name: "JavaScript", level: "Advanced" },
  ]);
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.updateSkill({ params: { skillId }, body: {} }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Provide at least one field to update.");
});

registerTest("Admin skill create and delete manage skills lifecycle", async () => {
  const context = createAdminTestContext();
  const createRes = createMockResponse();
  const createNext = createNextTracker();

  await context.handlers.createSkill(
    { body: { name: "TypeScript", level: "Intermediate" } },
    createRes,
    createNext
  );

  assert.equal(createNext.getError(), null);
  assert.equal(createRes.statusCode, 201);
  const skillId = createRes.body._id;

  const deleteRes = createMockResponse();
  const deleteNext = createNextTracker();

  await context.handlers.deleteSkill({ params: { skillId } }, deleteRes, deleteNext);

  assert.equal(deleteNext.getError(), null);
  assert.equal(deleteRes.statusCode, 204);
});

registerTest("Admin about create validates required fields", async () => {
  const context = createAdminTestContext();
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.createAbout({ body: {} }, res, next);

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 400);
  assert.ok(res.body.errors.some((error) => error.field === "headline"));
});

registerTest("Admin about update persists changes", async () => {
  const context = createAdminTestContext();
  const aboutId = createObjectId(45);
  context.aboutCollection.reset([
    { _id: aboutId, headline: "Developer", summary: "Initial" },
  ]);
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.updateAbout(
    { params: { aboutId }, body: { summary: "Updated" } },
    res,
    next
  );

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.summary, "Updated");
});

registerTest("Admin contact update removes optional fields", async () => {
  const context = createAdminTestContext();
  const contactId = createObjectId(50);
  context.contactCollection.reset([
    {
      _id: contactId,
      email: "hello@example.com",
      phone: "+1 555 1234",
    },
  ]);
  const res = createMockResponse();
  const next = createNextTracker();

  await context.handlers.updateContact(
    { params: { contactInfoId: contactId }, body: { phone: "" } },
    res,
    next
  );

  assert.equal(next.getError(), null);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.phone, undefined);
});

registerTest("isAdmin middleware blocks non-admin payloads", async () => {
  const res = createMockResponse();
  let nextCalled = false;

  isAdmin({ payload: { role: "member" } }, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
});

registerTest("isAuthenticated middleware returns 401 without token", async () => {
  const app = express();

  app.get("/protected", isAuthenticated, (req, res) => {
    res.sendStatus(200);
  });

  app.use((err, req, res, next) => {
    if (err && err.status) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    next(err);
  });

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/protected`);
    assert.equal(response.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

async function run() {
  const summary = [];
  console.log("Starting manual route handler tests...\n");
  for (const test of tests) {
    const start = performance.now();
    try {
      console.log(`→ ${test.name}`);
      await test.fn();
      const duration = performance.now() - start;
      console.log(`✔ ${test.name} (${duration.toFixed(2)}ms)`);
      summary.push({ name: test.name, status: "passed" });
    } catch (error) {
      console.error(`✖ ${test.name}`);
      console.error(error);
      summary.push({ name: test.name, status: "failed", error });
      console.error(`\n${summary.filter((entry) => entry.status === "passed").length} passed, 1 failed`);
      process.exit(1);
    }
  }

  console.log(`\nAll ${summary.length} tests passed.`);
}

run().catch((error) => {
  console.error("Test runner encountered an unexpected error.", error);
  process.exit(1);
});

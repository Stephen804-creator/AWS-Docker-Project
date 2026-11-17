"use strict";

const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

const { createServer, getPort } = require("../app");

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET / serves the application page with security headers", async () => {
  const response = await fetch(baseUrl);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(await response.text(), /Node\.js Docker Application/);
});

test("GET /health returns a machine-readable health response", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("unknown paths return 404", async () => {
  const response = await fetch(`${baseUrl}/missing`);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not Found\n");
});

test("unsupported methods return 405 and an Allow header", async () => {
  const response = await fetch(baseUrl, { method: "POST" });

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("HEAD requests return headers without a response body", async () => {
  const response = await fetch(baseUrl, { method: "HEAD" });

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("PORT validation rejects invalid values", () => {
  assert.throws(() => getPort("0"), /PORT must be an integer/);
  assert.throws(() => getPort("not-a-port"), /PORT must be an integer/);
  assert.equal(getPort("8080"), 8080);
  assert.equal(getPort(""), 3000);
});

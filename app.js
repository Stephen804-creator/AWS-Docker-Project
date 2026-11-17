"use strict";

const http = require("node:http");

const DEFAULT_PORT = 3000;

const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

function getPort(value = process.env.PORT) {
  const port = value === undefined || value === "" ? DEFAULT_PORT : Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function send(res, statusCode, contentType, body, method, extraHeaders = {}) {
  res.writeHead(statusCode, {
    ...SECURITY_HEADERS,
    "Content-Type": contentType,
    ...extraHeaders
  });

  if (method === "HEAD") {
    res.end();
    return;
  }

  res.end(body);
}

function createServer() {
  return http.createServer((req, res) => {
    let pathname;

    try {
      pathname = new URL(req.url, "http://localhost").pathname;
    } catch {
      send(res, 400, "text/plain; charset=utf-8", "Bad Request\n", req.method);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(
        res,
        405,
        "text/plain; charset=utf-8",
        "Method Not Allowed\n",
        req.method,
        { Allow: "GET, HEAD" }
      );
      return;
    }

    if (pathname === "/health") {
      send(
        res,
        200,
        "application/json; charset=utf-8",
        JSON.stringify({ status: "ok" }),
        req.method
      );
      return;
    }

    if (pathname !== "/") {
      send(res, 404, "text/plain; charset=utf-8", "Not Found\n", req.method);
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <title>Node.js Docker App</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    main {
      width: min(100%, 650px);
      background: #fff;
      padding: clamp(24px, 5vw, 40px);
      text-align: center;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
    h1 { margin: 0 0 15px; }
    p { color: #555; line-height: 1.6; }
    .status {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 16px;
      border-radius: 6px;
      background: #e8f5e9;
      color: #2e7d32;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <main>
    <h1>Node.js Docker Application</h1>
    <p>Application deployed successfully.</p>
    <p>This application is running inside a Docker container on an AWS Linux server.</p>
    <div class="status">Application is running</div>
  </main>
</body>
</html>`;

    send(res, 200, "text/html; charset=utf-8", html, req.method);
  });
}

function startServer() {
  const port = getPort();
  const server = createServer();

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on 0.0.0.0:${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down HTTP server.`);
    server.close((error) => {
      if (error) {
        console.error("Graceful shutdown failed:", error.message);
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { createServer, getPort, startServer };

const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8"
  });

  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node.js Docker App</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      background: white;
      max-width: 650px;
      margin: 20px;
      padding: 40px;
      text-align: center;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    h1 {
      margin-bottom: 15px;
    }

    p {
      color: #555;
      line-height: 1.6;
    }

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
  <main class="container">
    <h1>Node.js Docker Application</h1>

    <p>Application deployed successfully.</p>

    <p>
      This application is running inside a Docker container
      on an AWS Linux server.
    </p>

    <p>Server port: ${PORT}</p>

    <div class="status">
      Application is running
    </div>
  </main>
</body>
</html>`);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
# AWS Docker Project

A small Node.js HTTP application used to practise the container workflow: build an image, run it locally, publish it to Docker Hub, pull it onto an Ubuntu EC2 instance, and verify the running container.

This is a learning project, not a production-ready public web service. It does not provision AWS infrastructure or deploy automatically.

## What the project demonstrates

- A Node.js application using only built-in Node modules
- A Docker image based on Node.js 22 Alpine
- A non-root container process and Docker health check
- Local container testing and image tagging
- Publishing and pulling an image through Docker Hub
- Running the container on an Ubuntu EC2 instance

## Repository contents

| Path | Purpose |
|---|---|
| `app.js` | HTTP server, home page, and health endpoint |
| `package.json` | Project scripts and Node.js engine requirement |
| `package-lock.json` | Reproducible npm dependency metadata |
| `Dockerfile` | Container build, non-root user, and health check |
| `.dockerignore` | Keeps screenshots, Git metadata, and local files out of the build context |
| `test/` | Built-in Node.js tests |
| `.github/workflows/ci.yml` | Tests the app and builds the Docker image on GitHub Actions |

## Requirements

- Node.js 22 or newer and npm
- Docker Engine or Docker Desktop
- A Docker Hub account if you want to publish the image
- An AWS account and an Ubuntu EC2 instance for the cloud deployment exercise
- An SSH key pair for your EC2 instance

## 1. Run and test locally

From the repository directory:

```bash
npm test
npm run check
npm start
```

Open `http://localhost:3000`. Check the health endpoint separately:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"ok"}
```

Stop the local server with `Ctrl+C`.

## 2. Build and run the Docker image

Build the image:

```bash
docker build -t stephen804/nodejs-app:1.1.0 .
```

Run it locally:

```bash
docker run --rm --name nodejs-app -p 3000:3000 stephen804/nodejs-app:1.1.0
```

In another terminal, verify both routes:

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/health
```

The container has a Docker health check. Inspect its status with:

```bash
docker ps
docker inspect --format='{{.State.Health.Status}}' nodejs-app
```

Stop a detached container with:

```bash
docker stop nodejs-app
docker rm nodejs-app
```

## 3. Publish to Docker Hub

Sign in interactively. Do not put a Docker Hub password or access token in a command, script, or committed file.

```bash
docker login
docker push stephen804/nodejs-app:1.1.0
```

To pull the image on another machine:

```bash
docker pull stephen804/nodejs-app:1.1.0
```

The original assignment used the tag `stephen804/nodejs-app:1.0`. The updated application uses `1.1.0`; tags are immutable deployment references only if you avoid overwriting them.

## 4. Deploy on Ubuntu EC2

1. Launch an Ubuntu EC2 instance and keep its key pair private.
2. In the EC2 security group, allow SSH (TCP 22) only from your own IP address.
3. For a temporary demonstration, allow TCP 3000 only from your own IP address. Do not expose the app directly to the whole internet as a production service.
4. Connect to the instance using the SSH command shown by the EC2 console. On Linux or macOS, restrict the private key file permissions with `chmod 400 your-key.pem`.
5. Install Docker using the official Docker Engine instructions for your Ubuntu release, then verify `sudo docker version`.
6. Pull and run the image:

```bash
sudo docker pull stephen804/nodejs-app:1.1.0
sudo docker run -d \
  --name nodejs-app \
  --restart unless-stopped \
  -p 3000:3000 \
  stephen804/nodejs-app:1.1.0
```

7. Verify the container and application:

```bash
sudo docker ps
sudo docker logs nodejs-app
curl -i http://localhost:3000/health
```

8. From your own computer, open `http://EC2-PUBLIC-IP:3000` using the current public IPv4 address shown in the EC2 console.

A public IPv4 address can change when an instance is stopped and started unless you use an Elastic IP. Do not hard-code an instance IP address into source code or this README.

### Security notes for the EC2 exercise

- Restrict SSH and the demonstration port to trusted source IPs.
- Do not commit private keys, AWS access keys, Docker Hub tokens, or `.env` files.
- The container runs as the unprivileged `node` user.
- For a real public deployment, put the application behind an HTTPS reverse proxy or load balancer, expose only the required public ports (normally 80/443), use a managed image registry and least-privilege IAM, and keep the host and image patched.
- The application has no authentication or business-data storage; do not use it to host sensitive data.

## 5. Troubleshooting

| Symptom | Checks |
|---|---|
| Browser cannot connect | Confirm the container is running, the EC2 security group allows TCP 3000 from your IP, and the public IP is current |
| Container exits | Run `sudo docker logs nodejs-app` and check the Docker health status |
| Port already in use | Stop the old container or map another host port, for example `-p 8080:3000` |
| Image pull fails | Confirm the image name/tag and Docker Hub visibility; run `docker login` if the image is private |
| Health is unhealthy | Run `curl http://localhost:3000/health` inside the EC2 host and inspect the container logs |

## Deployment evidence

The repository retains the original assignment screenshots:

- Docker image build: [`docker-build.jpg`](docker-build.jpg)
- Docker Hub image: [`docker-hub.jpg`](docker-hub.jpg)
- Running container: [`docker-container.jpg`](docker-container.jpg)
- Live application: [`live-application.jpg`](live-application.jpg)

Before sharing these screenshots publicly, review them for AWS account IDs, public IP addresses, instance IDs, security-group identifiers, usernames, terminal history, or other account-specific details. The screenshot contents have not been independently verified as redacted.

## CI

GitHub Actions runs the Node.js tests and syntax checks, then builds the Docker image without pushing it to a registry. It does not deploy to AWS.

## License

MIT. See [LICENSE](LICENSE).

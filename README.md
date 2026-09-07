# AWS-Docker-Project
# Node.js & Docker Deployment Assignment

## Project Description

This project demonstrates the development and deployment of a simple Node.js application using GitHub, Linux, Docker, Docker Hub, and AWS EC2.

The Node.js application was containerized using Docker and deployed on an AWS Ubuntu Linux server.

## Technologies Used

- Node.js
- Docker
- Docker Hub
- AWS EC2
- Ubuntu Linux
- Git
- GitHub

## Application Files

- `app.js` - Node.js application
- `package.json` - Node.js project configuration
- `Dockerfile` - Docker image configuration
- `README.md` - Project documentation

## Docker Image

The Docker image was tagged as:

`stephen804/nodejs-app:1.0`

## 1. Docker Build

The Docker image was built using the following nodejs-app command:
docker build -t stephen804/nodejs-app:1.0 .
The build completed successfully.
Docker Build
![Docker-Build](docker-build.jpg)
## 2. Docker Hub Image
The Docker image was pushed to Docker Hub using the following command:
docker push stephen804/nodejs-app:1.0
The image and 1.0 tag are available on Docker Hub.
Docker Hub Image 
![Docker-Hub](docker-hub.jpg)
## 3. Running Docker Container
The Docker container was started using:
docker run -d --name nodejs-app-container -p 3000:3000 stephen804/nodejs-app:1.0
The running container was verified using:
docker ps
Running Docker Container
![Docker-Container](docker-container.jpg)
## 4. Live Application
The Node.js application was deployed on an AWS EC2 Ubuntu Linux server and accessed through port 3000.
Live Application Screenshot
![Live Application](live-application.jpg)
## Deployment Process
The complete deployment process was:
Created a Node.js application.
Uploaded the application to GitHub.
Created a Dockerfile.
Cloned the GitHub repository onto an AWS EC2 Ubuntu Linux server.
Built the Docker image.
Tagged the image as stephen804/nodejs-app:1.0.
Logged into Docker Hub.
Pushed the Docker image to Docker Hub.
Pulled the Docker image from Docker Hub.
Ran the Docker container.
Configured AWS Security Group to allow TCP port 3000.
Accessed the live Node.js application through the EC2 public IP address.
## Project Result
The Node.js application was successfully containerized using Docker, pushed to Docker Hub, pulled onto an AWS EC2 Linux server, and deployed as a running Docker container.

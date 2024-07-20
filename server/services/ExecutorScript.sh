#!/bin/bash

# Ensure the script is run with the correct number of arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <templateName> <projectPath>"
    exit 1
fi

TEMPLATE_NAME=$1
PROJECT_PATH=$2
CONTAINER_NAME="project_${TEMPLATE_NAME}_$(date +%s)"

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Create a Dockerfile based on the template
DOCKERFILE_CONTENT=$(cat <<EOF
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
EOF
)

# Create Dockerfile
echo "$DOCKERFILE_CONTENT" > Dockerfile

# Build Docker image
docker build -t "${CONTAINER_NAME}" .

# Run Docker container
docker run -d --name "${CONTAINER_NAME}" -p 3000:3000 -v "${PROJECT_PATH}:/usr/src/app" "${CONTAINER_NAME}"

# Output container logs
docker logs -f "${CONTAINER_NAME}"

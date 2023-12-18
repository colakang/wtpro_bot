FROM node:20.9-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json /app/

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY ./ /app/

# Expose port 5173 to access the server
EXPOSE 8888

# Command to run the application
CMD ["npm", "run", "start"]

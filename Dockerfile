# Specify base image
FROM node:18

# Specify working directory
WORKDIR /cemus

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 8080
EXPOSE 6002
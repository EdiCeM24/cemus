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

# Set environment variables
ENV NODE_ENV='production'
ENV DB_PG_NAME=DATABASE_NAME
ENV DB_PG_USER=DATABASE_USER
ENV DB_PG_HOST=localhost
ENV DB_PG_PASS=DATABASE_PASSWORD
ENV DB_PG_PORT=DATABASE_PORT

# NEON CONNECTION STRING
ENV NEON_DB_USER=PGUSER
ENV NEON_DB_PASS=PGPASSWORD
ENV NEON_DB_HOST=PGHOST
ENV NEON_DB_NAME=PGDATABASE

# Run command
CMD [ "npm", 'start' ]
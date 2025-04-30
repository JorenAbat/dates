# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Add node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY package*.json ./
RUN npm ci

# Set environment variables
ENV NODE_ENV=production
ENV REACT_APP_API_URL=https://dates-backend.jorellsy.com/api

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Add nginx configuration if needed
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 
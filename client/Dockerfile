# # Stage 1: Build
# FROM node:20-alpine AS builder
# WORKDIR /app

# # 1. Copy dependency files
# COPY package*.json ./

# # 2. INSTALL the dependencies (This is the missing link!)
# RUN npm install

# # 3. Copy the rest of the source code
# COPY . .

# # 4. Build the project
# RUN npm run build

# # Stage 2: Serve
# FROM nginx:alpine
# # ... (rest of your nginx config)
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
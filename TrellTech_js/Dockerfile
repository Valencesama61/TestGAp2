# Build app
FROM node:18 AS builder

WORKDIR /app

# Copy config file
COPY package.json package-lock.json ./
RUN npm install

# Copy all project
COPY . .

# Build Expo Web
RUN npm run build:web


# Serve with Nginx
FROM nginx:alpine

# Copy the build expo into Nginx
COPY --from=builder /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

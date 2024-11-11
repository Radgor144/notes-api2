# Etap budowania aplikacji
FROM node:18 AS build

# Ustaw katalog roboczy na /app
WORKDIR /app

# Skopiuj package.json i package-lock.json do katalogu roboczego i zainstaluj zależności
COPY package*.json ./
RUN npm install

# Skopiuj resztę plików aplikacji i zbuduj ją
COPY . .
RUN npm run build

# Etap serwowania aplikacji z serwerem nginx
FROM nginx:alpine

# Skopiuj zbudowane pliki z poprzedniego etapu do katalogu, z którego nginx będzie je serwował
COPY --from=build /app/build /usr/share/nginx/html

# Eksponuj port 80, na którym nginx serwuje zawartość
EXPOSE 80

# Domyślna komenda dla nginx
CMD ["nginx", "-g", "daemon off;"]

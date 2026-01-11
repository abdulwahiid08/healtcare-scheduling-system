FROM node:20-slim

# Install OpenSSL (WAJIB untuk Prisma)
RUN apt-get update && apt-get install -y openssl \
   && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma
RUN npx prisma generate

EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]
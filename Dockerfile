# Usa imagem leve do Node.js
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia os manifestos de dependências primeiro (melhora cache de build)
COPY package*.json ./

# Instala dependências de produção
RUN npm ci --omit=dev

# Copia o restante do código da aplicação
COPY . .

# Define a porta usada pela aplicação
EXPOSE 3000

# Define variáveis de ambiente padrão (opcional)
ENV NODE_ENV=production

# Comando para rodar a aplicação
CMD ["node", "server.js"]

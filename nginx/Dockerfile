# Imagem oficial do NGINX
FROM nginx:alpine

# Copia configuração customizada do NGINX
COPY default.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando padrão do NGINX
CMD ["nginx", "-g", "daemon off;"]

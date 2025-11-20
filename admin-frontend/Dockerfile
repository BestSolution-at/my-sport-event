FROM docker.io/nginxinc/nginx-unprivileged:1.28

RUN sed -i -E "s,\},    font/otf otf;\n    font/ttf ttf;\n\}," /etc/nginx/mime.types
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/app

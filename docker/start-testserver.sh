docker rm hypertoc
docker run \
  --name hypertoc \
   -v $PWD/../node/:/hypertoc-api/ \
   -v $PWD/nginxconf/nginx.conf:/etc/nginx/nginx.conf \
   -v $PWD/nginxsites/default.conf:/etc/nginx/conf.d/default.conf \
   -v $PWD/../web/dist/:/usr/share/nginx/html/ \
   -v $PWD/scripts/start.sh:/start.sh \
   -p 80:80 \
   -p 8989:8989 \
   -d \
  nginx /start.sh

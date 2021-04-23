FROM nginx

COPY nginx/server.conf /etc/nginx/conf.d/default.conf
COPY nginx/uwsgi_params /etc/nginx/uwsgi_params

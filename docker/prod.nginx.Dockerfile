FROM nginx

COPY nginx/prod.conf /etc/nginx/conf.d/default.conf
COPY nginx/uwsgi_params /etc/nginx/uwsgi_params

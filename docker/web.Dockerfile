# base image
FROM python:3.9

#install os dependencies
RUN apt-get update \
	&& apt-get install -y curl \
	&& apt-get install -y screen \
	&& apt-get install -y libpq-dev python3-dev libffi-dev \
	&& apt-get install -y libxml2-dev libxslt1-dev lib32z1-dev python3-libxml2

WORKDIR /code
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

RUN mkdir -p /vol/static
RUN mkdir -p /vol/media

COPY ./scripts/entrypoint.sh /

RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

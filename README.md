
# Onlease
https://onlease.herokuapp.com/

**Tech stack used**: Django, Angular, Sass, Bootstrap, Django rest framework, Celery, Postgresql, Nginx, Docker, Dcoerk compose

### General info:
- angular folder contains frontend code
- backend folder contains backend code and docker file to run backend server container.
- nginx contains two configuration files, one serve static files and talks to uwsgi and another as reverse proxy to direct traffic from onlease.in and test.onlease.in to respective servers
- scripts folder contain scripts to run prodction and test servers. Just run the script, it will pull latest code from remote master, build angular code in prod mode and run docker compose.
- there are three docker compose files, each one for local, test and prod.


### Features implemented:
- uwsgi to run python server.
- Nginx as a reverse proxy to serve prod and test server and to server static files.
- Logging rotation and sentry for errors logging.
- Docker compose containing three services: django, nginx and postgres.
- Data backup using cron job.
- Bash scripts for production and test server.
- Virtual tours using kuula and IVR using twilio.


### Development environment setup guide
- Install angular
- take .env file from other developer
- Run *docker-compose -p onlease_local up --build -d*
- Run *npm run watch* in different tab
- To create and apply migration, enter into container using *docker exec -it {container_id} bash*


### Prod and test server setup
- Install angular
- pull code from github
- create .env file with production credentials
- Run *./prod-build.sh*
- Check logs using *docker-compose -p onlease_prod -f docker-compose-prod.yml logs -f web*


### Backup setup
- setup ssh to prod machine and set it as (we can create new user also instead of using root)
Host onlease
	Hostname <ip_addrees>
	User root
	IdentityFile ~/.ssh/id_rsa
- Add cron from backup/scripts/cron using crontab -e
- Data will be backed up in every 15 minutes
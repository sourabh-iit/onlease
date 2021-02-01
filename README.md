
# Onlease
https://onlease.herokuapp.com/

**Tech stack used**: Django, Angular, Sass, Bootstrap, Django rest framework, Celery, Postgresql

**Steps to start**

- clone repo using *git clone https://github.com/sourabh-iit/onlease.git*
- install postgres
- enter into postgres command line using *sudo su - postgres*
- enter into postgres db using *psql*
- create database onlease
- create user for onlease with required username and password and permissions
- exit from datbase and psql command line
- create virtual env using */usr/bin/python3 -m venv venv*
- activate it using *source venv/bin/activate*
- install required packages using *pip install -r requirements.txt*
- create tables in database onlease using *python manage.py migrate*
- start server using *python manage.py runserver*

### Features implemented:
- User registration and login.
- Session based user authentication.
- Form to create new posting.
- User can view ads in a particular area without logging in.
- To book a room, user needs to create account.
- Msg91 integration for messaging.
- Twilio integration for IVR.
- Instamojo payment integration.


### TODOs:
Lodging vaccancy setup
Angular setup
Frontend design planning
# Generated by Django 2.2.13 on 2021-01-24 01:53

from django.db import migrations
import csv
import threading

num_threads = 4
filename = 'All_India_pincode_data_26022018.csv'

states_map = {}

def thread_handler(thread_num, tot_threads, data, State, Region):
    for i, row in enumerate(data):
        if (i+1)%tot_threads == thread_num:
            state = row['statename']
            # if state.lower() != 'delhi':
            #     continue
            region = row['officename'].split(' '+row['officetype'])[0]
            pincode = row['pincode']
            if state in states_map:
                state_object = states_map[state]
            else:
                state_object = State.objects.create(name=state)
                states_map[state] = state_object
            Region.objects.create(
                name=region,
                pincode=pincode,
                state=state_object
            )


def add_data(apps, schema_editor):
    State = apps.get_model('locations', 'State')
    Region = apps.get_model('locations', 'Region')
    file_data = list(csv.DictReader(open(filename,'r',errors='ignore')))
    threads = []
    for i in range(num_threads):
        threads.append(threading.Thread(target=thread_handler, args=[i, num_threads, file_data, State, Region]))
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_data)
    ]

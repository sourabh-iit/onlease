# Generated by Django 2.0.3 on 2018-05-06 20:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='no_times_not_booked',
        ),
    ]
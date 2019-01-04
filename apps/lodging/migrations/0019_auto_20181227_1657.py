# Generated by Django 2.0.3 on 2018-12-27 16:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0018_auto_20181130_2056'),
    ]

    operations = [
        migrations.AddField(
            model_name='commonlyusedlodgingmodel',
            name='last_confirmed',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='available_from',
            field=models.DateField(default=datetime.datetime(2018, 12, 27, 16, 57, 44, 780514)),
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='last_time_booking',
            field=models.DateTimeField(default=datetime.datetime(2018, 12, 27, 16, 57, 44, 780750)),
        ),
    ]
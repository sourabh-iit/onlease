# Generated by Django 2.0.3 on 2018-12-29 01:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0021_auto_20181229_0112'),
    ]

    operations = [
        migrations.AddField(
            model_name='commonlyusedlodgingmodel',
            name='is_confirmation_processing',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='available_from',
            field=models.DateField(default=datetime.datetime(2018, 12, 29, 1, 56, 0, 363330)),
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='last_time_booking',
            field=models.DateTimeField(default=datetime.datetime(2018, 12, 29, 1, 56, 0, 363580)),
        ),
        migrations.AlterField(
            model_name='lodging',
            name='uid',
            field=models.CharField(default='1P0vhF0s', max_length=20),
        ),
    ]
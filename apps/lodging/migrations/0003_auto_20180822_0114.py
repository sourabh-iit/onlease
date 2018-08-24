# Generated by Django 2.0.3 on 2018-08-22 01:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0002_auto_20180819_0024'),
    ]

    operations = [
        migrations.AddField(
            model_name='commonlyusedlodgingmodel',
            name='latlng',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='available_from',
            field=models.DateField(default=datetime.date(2018, 8, 22)),
        ),
    ]

# Generated by Django 2.0.3 on 2018-09-21 14:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0011_auto_20180914_2218'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='available_from',
            field=models.DateField(default=datetime.datetime(2018, 9, 21, 14, 26, 0, 539665)),
        ),
    ]
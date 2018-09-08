# Generated by Django 2.0.3 on 2018-08-26 00:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0004_auto_20180822_2129'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commonlyusedlodgingmodel',
            old_name='bedrooms',
            new_name='rooms',
        ),
        migrations.RemoveField(
            model_name='commonlyusedlodgingmodel',
            name='other_rooms',
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='available_from',
            field=models.DateField(default=datetime.date(2018, 8, 26)),
        ),
    ]

# Generated by Django 2.0.3 on 2018-05-06 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0002_commonlyusedlodgingmodel_is_blocked'),
    ]

    operations = [
        migrations.AddField(
            model_name='commonlyusedlodgingmodel',
            name='no_times_not_booked',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
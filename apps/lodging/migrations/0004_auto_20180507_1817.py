# Generated by Django 2.0.3 on 2018-05-07 18:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0003_commonlyusedlodgingmodel_no_times_not_booked'),
    ]

    operations = [
        migrations.RenameField(
            model_name='commonlyusedlodgingmodel',
            old_name='no_times_not_booked',
            new_name='no_times_refunded',
        ),
    ]

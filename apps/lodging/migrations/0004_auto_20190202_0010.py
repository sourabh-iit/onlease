# Generated by Django 2.0.3 on 2019-02-02 00:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0003_auto_20190128_1331'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='termandcondition',
            name='lodging',
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='available_from',
            field=models.DateField(default=datetime.datetime(2019, 2, 2, 0, 10, 36, 120112)),
        ),
        migrations.AlterField(
            model_name='commonlyusedlodgingmodel',
            name='last_time_booking',
            field=models.DateTimeField(default=datetime.datetime(2019, 2, 2, 0, 10, 36, 120542)),
        ),
        migrations.AlterField(
            model_name='lodging',
            name='uid',
            field=models.CharField(default='oHT4X6RO', max_length=20),
        ),
        migrations.DeleteModel(
            name='TermAndCondition',
        ),
    ]

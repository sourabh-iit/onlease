# Generated by Django 2.0.3 on 2018-11-30 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0006_auto_20181117_1623'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lodgingtransaction',
            name='trans_id',
            field=models.CharField(default='gg9BCzW8yLq0aHCXGVJOXGauMjJi0pIKJgZ6bxMTbY', editable=False, max_length=100, unique=True),
        ),
    ]

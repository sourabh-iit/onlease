# Generated by Django 2.2.13 on 2021-04-15 00:15

import apps.user.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20210413_0256'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', apps.user.models.CustomUserManager()),
            ],
        ),
    ]

# Generated by Django 2.2.13 on 2021-02-10 00:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0002_auto_20210124_1144'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lodging',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='lodging',
            name='title',
        ),
    ]
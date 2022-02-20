# Generated by Django 2.2.13 on 2022-02-20 01:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_auto_20211205_0027'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='address',
            name='region',
        ),
        migrations.AddField(
            model_name='address',
            name='google_place_id',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AddField(
            model_name='address',
            name='google_place_main_text',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='address',
            name='google_place_secondary_text',
            field=models.CharField(default='', max_length=200),
        ),
    ]

# Generated by Django 2.0.3 on 2018-08-19 00:24

import django.contrib.postgres.fields
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RoomieAd',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rent', models.CharField(db_index=True, max_length=10, validators=[django.core.validators.RegexValidator(message='Enter correct value for rent', regex='^[1-9][0-9]+$')])),
                ('has_property', models.BooleanField(db_index=True)),
                ('regions', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=10), size=10)),
                ('types', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('R', 'Room(s)'), ('F', 'Flat'), ('H', 'House/Apartment')], max_length=1), size=8)),
                ('lodging_description', models.TextField(help_text='e.g. Fully furnished 2BHK FLAT.', null=True, validators=[django.core.validators.RegexValidator(message='Only digits, letters and follwing characters are allowed (.,\'"/)', regex='^[0-9a-zA-Z ,.\'"/]*$')])),
                ('share', models.PositiveIntegerField(default=1)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('gender', models.CharField(choices=[(None, 'Choose gender'), ('M', 'Male'), ('F', 'Female'), ('A', 'Any')], max_length=2)),
            ],
            options={
                'ordering': ('created_at',),
            },
        ),
    ]

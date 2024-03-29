# Generated by Django 2.2.13 on 2021-01-24 01:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('pincode', models.CharField(max_length=10)),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='regions', to='locations.State')),
            ],
            options={
                'ordering': ('name',),
            },
        ),
    ]

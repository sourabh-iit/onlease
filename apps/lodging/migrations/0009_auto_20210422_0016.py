# Generated by Django 2.2.13 on 2021-04-22 00:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0008_lodgingvrimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lodgingvrimage',
            name='lodging',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vrimages', to='lodging.Lodging'),
        ),
    ]

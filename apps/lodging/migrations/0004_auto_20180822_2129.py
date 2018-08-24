# Generated by Django 2.0.3 on 2018-08-22 21:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0003_auto_20180822_0114'),
    ]

    operations = [
        migrations.CreateModel(
            name='Charge',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.CharField(max_length=20)),
                ('description', models.CharField(max_length=100)),
                ('is_per_month', models.BooleanField(default=False)),
            ],
        ),
        migrations.RenameField(
            model_name='commonlyusedlodgingmodel',
            old_name='advance_of_months',
            new_name='advance_rent_of_months',
        ),
        migrations.RemoveField(
            model_name='commonlyusedlodgingmodel',
            name='booking_amount',
        ),
        migrations.RemoveField(
            model_name='commonlyusedlodgingmodel',
            name='extra_charges',
        ),
        migrations.RemoveField(
            model_name='commonlyusedlodgingmodel',
            name='extra_charges_description',
        ),
        migrations.RemoveField(
            model_name='commonlyusedlodgingmodel',
            name='security_deposit',
        ),
        migrations.AddField(
            model_name='charge',
            name='lodging',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lodging.CommonlyUsedLodgingModel'),
        ),
    ]

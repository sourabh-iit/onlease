# Generated by Django 2.0.3 on 2018-04-22 15:40

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('lodging', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LodgingTransaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('S', 'Success'), ('P', 'Pending'), ('C', 'Cancel'), ('F', 'Fail'), ('R', 'Refunded')], default='P', max_length=1)),
                ('amount', models.PositiveIntegerField(validators=[django.core.validators.RegexValidator('^[1-9][0-9]{1,10}$')])),
                ('payment_request_id', models.CharField(max_length=40, null=True)),
                ('payment_id', models.CharField(max_length=40, null=True)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('sms_status', models.CharField(choices=[('S', 'Success'), ('P', 'Pending'), ('C', 'Cancel'), ('F', 'Fail'), ('R', 'Refunded')], default='P', max_length=1)),
                ('email_status', models.CharField(choices=[('S', 'Success'), ('P', 'Pending'), ('C', 'Cancel'), ('F', 'Fail'), ('R', 'Refunded')], default='P', max_length=1)),
                ('payment_gateway_fees', models.CharField(default=0, max_length=12)),
                ('lodging', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lodging.Lodging')),
            ],
        ),
    ]
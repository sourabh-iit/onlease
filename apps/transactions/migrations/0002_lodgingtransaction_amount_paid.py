# Generated by Django 2.0.3 on 2018-05-03 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='lodgingtransaction',
            name='amount_paid',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
# Generated by Django 2.0.3 on 2019-02-03 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_auto_20190202_0010'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='updated_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]

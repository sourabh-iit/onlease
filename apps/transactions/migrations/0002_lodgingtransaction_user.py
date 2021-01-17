# Generated by Django 2.0.3 on 2021-01-03 01:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='lodgingtransaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lodgingtransaction', to=settings.AUTH_USER_MODEL),
        ),
    ]

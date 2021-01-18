# Generated by Django 2.0.3 on 2021-01-19 00:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_profileimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profileimage',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='image', to=settings.AUTH_USER_MODEL),
        ),
    ]

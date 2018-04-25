# Generated by Django 2.0.3 on 2018-04-22 15:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('lodging', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='lodging',
            name='posted_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lodgings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='lodging',
            name='purchased_by',
            field=models.ManyToManyField(related_name='customers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='imagemodel',
            name='sublodging',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='lodging.CommonlyUsedLodgingModel'),
        ),
        migrations.AddField(
            model_name='commonlyusedlodgingmodel',
            name='lodging',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='sublodging', to='lodging.Lodging'),
        ),
    ]

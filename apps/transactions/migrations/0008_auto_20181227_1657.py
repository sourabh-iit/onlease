# Generated by Django 2.0.3 on 2018-12-27 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0007_auto_20181130_2056'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lodgingtransaction',
            name='trans_id',
            field=models.CharField(default='SHROhCe8DpeavlN9NSn7HhK1wgJZzOaMg7FfgeqVzR', editable=False, max_length=100, unique=True),
        ),
    ]
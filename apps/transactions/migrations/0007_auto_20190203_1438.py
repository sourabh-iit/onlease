# Generated by Django 2.0.3 on 2019-02-03 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0006_auto_20190203_1430'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lodgingtransaction',
            name='trans_id',
            field=models.CharField(default='QhbNWmlQ1WlOLBkzXndK4OhV34wwsGU9cq4naw2EBN', editable=False, max_length=100, unique=True),
        ),
    ]

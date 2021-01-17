# Generated by Django 2.0.3 on 2021-01-18 00:45

import apps.lodging.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('lodging', '0003_auto_20210117_0049'),
    ]

    operations = [
        migrations.CreateModel(
            name='LodgingImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=apps.lodging.models.lodging_image_upload_path)),
                ('image_thumbnail', models.ImageField(upload_to=apps.lodging.models.lodging_thumbnail_upload_path)),
                ('image_mobile', models.ImageField(upload_to=apps.lodging.models.lodging_mobile_image_upload_path)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('tag', models.CharField(choices=[('0', 'Bedroom'), ('1', 'Hall'), ('2', 'Balcony'), ('3', 'Living Room'), ('4', 'Entrance'), ('5', 'Kitchen'), ('6', 'Bathroom'), ('7', 'Building'), ('8', 'Floor'), ('9', 'Outside View'), ('10', 'Other'), ('11', 'Dining Room')], max_length=2, null=True)),
                ('tag_other', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='lodging',
            name='available_from',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='lodging',
            name='flooring',
            field=models.CharField(choices=[('0', 'Marble'), ('1', 'Vitrified Tile'), ('2', 'Vinyl'), ('3', 'Hardwood'), ('4', 'Granite'), ('5', 'Bamboo'), ('6', 'Concrete'), ('7', 'Laminate'), ('8', 'Linoleum'), ('9', 'Terrazzo'), ('10', 'Brick'), ('4', 'Other')], max_length=2),
        ),
        migrations.AlterField(
            model_name='lodging',
            name='furnishing',
            field=models.CharField(choices=[('0', 'Furnished'), ('1', 'Semi Furnished'), ('2', 'Unfurnished')], max_length=2),
        ),
        migrations.AlterField(
            model_name='lodging',
            name='lodging_type',
            field=models.CharField(choices=[('0', 'Flat'), ('1', 'House/Apartment'), ('2', 'Paying guest'), ('3', 'Rooms'), ('4', 'Other')], max_length=2, verbose_name='type'),
        ),
        migrations.AlterField(
            model_name='lodging',
            name='unit',
            field=models.CharField(choices=[('0', 'Sq. Gaj'), ('1', 'Sq. Feet'), ('2', 'Sq. Yds.'), ('3', 'Sq. Meter'), ('4', 'Acre'), ('5', 'Marla'), ('6', 'Kanal'), ('7', 'Ares'), ('8', 'Biswa'), ('9', 'Hectares')], max_length=2),
        ),
        migrations.AddField(
            model_name='lodgingimage',
            name='lodging',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='lodging.Lodging'),
        ),
    ]

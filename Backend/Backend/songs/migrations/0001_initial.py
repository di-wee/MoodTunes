# Generated by Django 4.2.4 on 2023-09-05 06:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('moods', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Songs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_id', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=255)),
                ('uri', models.CharField(max_length=255)),
                ('mood', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='moods.mood')),
                ('submoods', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='moods.submoods')),
            ],
        ),
    ]
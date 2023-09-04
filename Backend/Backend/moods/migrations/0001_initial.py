# Generated by Django 4.2.4 on 2023-09-03 03:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Mood',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='SubMoods',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submood_name', models.CharField(max_length=100)),
                ('mood', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submoods', to='moods.mood')),
            ],
        ),
    ]

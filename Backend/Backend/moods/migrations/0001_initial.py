# Generated by Django 4.2.4 on 2023-09-06 15:38

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
                ('name', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('count', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='SubMoods',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submood_name', models.CharField(max_length=100)),
                ('count', models.PositiveIntegerField(default=0)),
                ('mood', models.ForeignKey(db_column='mood_name', on_delete=django.db.models.deletion.CASCADE, related_name='submoods', to='moods.mood')),
            ],
        ),
    ]

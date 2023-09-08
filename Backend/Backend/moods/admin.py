from django.contrib import admin
from .models import Mood, SubMoods
from songs.models import Songs

class SongInline(admin.TabularInline):
    model = Songs
    extra = 1


class MoodAdmin(admin.ModelAdmin):
    inlines = [SongInline]

admin.site.register(Mood, MoodAdmin)

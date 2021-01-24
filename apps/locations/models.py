from django.db import models


class State(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        ordering=('name',)

class Region(models.Model):
    name = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name="regions")

    def __str__(self):
        return self.name

    class Meta:
        ordering=('name',)

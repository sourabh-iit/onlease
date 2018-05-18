from django.db import models


class State(models.Model):
    name=models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering=('name',)

class District(models.Model):
    name=models.CharField(max_length=100)
    state=models.ForeignKey(State,related_name='districts',on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=['state','id'])
        ]
        unique_together=(('name','state'),)

    def __str__(self):
        return self.name

    class Meta:
        ordering=('name',)

class Pincode(models.Model):
    value=models.CharField(max_length=20,unique=True)
    district=models.ForeignKey(District,related_name='pincodes',on_delete=models.CASCADE)
    state=models.ForeignKey(State,related_name='pincodes',on_delete=models.CASCADE)

    def __str__(self):
        return self.value

    class Meta:
        ordering=('value',)

class Region(models.Model):
    name=models.CharField(max_length=100)
    district=models.ForeignKey(District,related_name='regions',on_delete=models.CASCADE)
    pincode=models.ForeignKey(Pincode,related_name='regions',on_delete=models.CASCADE)
    state=models.ForeignKey(State,related_name='regions',on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [
            models.Index(fields=['district','id'])
        ]
        unique_together=('name','district','state')
        ordering=('name',)

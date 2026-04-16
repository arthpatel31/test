from django.db import models

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=50, default="general")
    image = models.ImageField(upload_to="item_images/", null=True, blank=True)

    def __str__(self):
        return self.name

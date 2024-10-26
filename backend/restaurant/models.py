from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User

class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=256)  # Store hashed password
    location = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='restaurant_pictures/', null=True, blank=True)
    contact_info = models.CharField(max_length=100, null=True, blank=True)
    timings = models.CharField(max_length=100, null=True, blank=True)

    def set_password(self, raw_password):
        """ Hashes the password and stores it using Django's make_password """
        self.password = make_password(raw_password)

    def verify_password(self, raw_password):
        """ Verifies the password using Django's check_password """
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.name

class Dish(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=50, choices=[('Appetizer', 'Appetizer'), ('Main Course', 'Main Course'), ('Dessert', 'Dessert')])
    image = models.ImageField(upload_to='dish_images/', null=True, blank=True)

    def __str__(self):
        return self.name

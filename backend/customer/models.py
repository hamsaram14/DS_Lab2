from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
import hashlib
from restaurant.models import Restaurant, Dish
from django.utils import timezone


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    # email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Correct usage: auto_now_add=True
    updated_at = models.DateTimeField(auto_now=True)
    password_hash = models.CharField(max_length=256, blank=True)

    def set_password(self, raw_password):
        """ Hashes the password and stores it """
        salt = get_random_string(32)
        self.password_hash = hashlib.sha256((salt + raw_password).encode('utf-8')).hexdigest()

    def verify_password(self, raw_password):
        """ Verifies the password """
        return self.password_hash == hashlib.sha256(raw_password.encode('utf-8')).hexdigest()

    def __str__(self):
        return f"{self.user.username} - {self.phone_number}"


class Favorite(models.Model):
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE, related_name='favorites')
    restaurant = models.ForeignKey(Restaurant, null=True, blank=True, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f'{self.customer} - {self.restaurant or self.dish}'
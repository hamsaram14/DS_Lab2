from rest_framework import serializers
from .models import Restaurant, Dish
from django.contrib.auth.hashers import make_password

class RestaurantSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'email', 'password', 'location', 'description', 'profile_picture', 'contact_info', 'timings']

    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        restaurant = Restaurant.objects.create(**validated_data)
        return restaurant

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.password = make_password(password)
        return super().update(instance, validated_data)


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'restaurant', 'name', 'description', 'price', 'category', 'image']

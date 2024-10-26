from rest_framework import serializers
from .models import Customer
from .models import Favorite
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class CustomerSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(source='user.email', required=True)
    first_name = serializers.CharField(source='user.first_name', required=True)
    last_name = serializers.CharField(source='user.last_name', required=True)
    password = serializers.CharField(write_only=True, required=True)
    country = serializers.CharField(required=False, allow_blank=True, max_length=100)

    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'password_hash', 'password', 'phone_number', 'avatar', 'created_at', 'updated_at', 'country']

    def create(self, validated_data):
    # Extract user-related fields
        user_data = validated_data.pop('user')
        email = user_data['email']

        # Validate email uniqueness
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        first_name = user_data['first_name']
        last_name = user_data['last_name']
        password = validated_data.pop('password')

        # Create the User object and hash the password
        user = User.objects.create(
            username=email,  # Using email as username
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=make_password(password)  # Hashing the password here
        )
        user.save()

        # Create the Customer object linked to the User object
        customer = Customer.objects.create(user=user, **validated_data)
        return customer


    def update(self, instance, validated_data):
        print(f"Validated Data: {validated_data}")
        user_data = validated_data.pop('user', None)
        if user_data:
            # Update User fields
            user = instance.user
            user.email = user_data.get('email', user.email)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()

        # Update Customer-specific fields
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        if 'password' in validated_data:
            instance.password_hash = make_password(validated_data['password'])
        instance.save()

        return instance

    def validate_password(self, value):
        # Add validation to ensure password meets certain requirements
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        return value  # We still return the plain password here, and it will be hashed in `create`

    def validate_email(self, value):
        # Check if the email already exists in the `User` model
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value



class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'customer', 'restaurant', 'dish', 'created_at']
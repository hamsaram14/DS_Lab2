from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout


# Restaurant Signup (Password Hashing)
@api_view(['POST'])
def restaurant_signup(request):
    data = request.data
    # Check if the necessary fields are in the request data
    if not all(key in data for key in ('email', 'name', 'password')):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Hash the password and assign it to 'password_hash' field in the data dictionary
    hashed_password = make_password(data['password'])
    data['password_hash'] = hashed_password
    
    # Serialize and validate data
    serializer = RestaurantSerializer(data=data)
    if serializer.is_valid():
        restaurant = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Restaurant Login (Password Verification)
@api_view(['POST'])
def restaurant_login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        # Fetch restaurant by email
        restaurant = Restaurant.objects.get(email=email)
    except Restaurant.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

    # Verify the password
    if check_password(password, restaurant.password):
        refresh = RefreshToken.for_user(restaurant)
        return Response({
            'message': 'Login successful',
            'token': str(refresh.access_token),  # Access token
            'refresh': str(refresh)  # Refresh token
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_dish(request):
    restaurant_id = request.data.get('restaurant_id')
    try:
        restaurant = Restaurant.objects.get(id=restaurant_id)
        print(f"Restaurant Found: {restaurant.name}")
    except Restaurant.DoesNotExist:
        return Response({'error': 'Invalid restaurant ID'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Ensure that files are being handled correctly
    data = request.data.copy()  # Copy request data to avoid immutability issues
    data['restaurant'] = restaurant_id  # Use restaurant ID directly
    
    serializer = DishSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print(f"Errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# 4. Get Dishes for a Restaurant
@api_view(['GET'])
def get_dishes(request, restaurant_id):
    dishes = Dish.objects.filter(restaurant_id=restaurant_id)
    serializer = DishSerializer(dishes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def restaurant_logout(request):
    # Django's built-in logout function to log out the user
    logout(request)
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

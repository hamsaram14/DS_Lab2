from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User



# Restaurant Signup (Password Hashing)
@api_view(['POST'])
@permission_classes([AllowAny])
def restaurant_signup(request):
    data = request.data
    # Check if the necessary fields are in the request data
    if not all(key in data for key in ('email', 'name', 'password')):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Hash the password and create a User instance
    hashed_password = make_password(data['password'])
    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        password=data['password']
    )
    
    # Combine start_time and end_time into timings if needed
    timings = f"{data.get('start_time')} - {data.get('end_time')}" if 'start_time' in data and 'end_time' in data else None
    
    # Link the User to Restaurant and save other fields
    restaurant = Restaurant.objects.create(
        user=user,
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        location=data.get('location'),
        description=data.get('description'),
        contact_info=data.get('contact'),
        timings=timings
    )
    
    serializer = RestaurantSerializer(restaurant)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# Restaurant Login (Password Verification)
@api_view(['POST'])
@permission_classes([AllowAny])
def restaurant_login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        # Fetch restaurant by email
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

    # Verify the password
    if not user.check_password(password):
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate tokens using the User model
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'Login successful',
        'token': str(refresh.access_token),  # Access token
        'refresh': str(refresh)  # Refresh token
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_restaurant(request, pk):
    try:
        restaurant = Restaurant.objects.get(pk=pk)
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Restaurant.DoesNotExist:
        return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_restaurant(request, pk):
    try:
        restaurant = Restaurant.objects.get(pk=pk)
    except Restaurant.DoesNotExist:
        return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']

    try:
        restaurant = Restaurant.objects.get(user=request.user)
        restaurant.profile_picture = file
        restaurant.save()
        return Response({'location': restaurant.profile_picture.url}, status=status.HTTP_201_CREATED)
    except Restaurant.DoesNotExist:
        return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_dish(request):
    try:
        # Get the authenticated user
        user = request.user

        # Find the Restaurant linked to this user
        restaurant = Restaurant.objects.get(user=user)
        print(f"Authenticated User: {user}, Is Authenticated: {user.is_authenticated}")
        print(f"Restaurant Found: {restaurant.name}")

    except Restaurant.DoesNotExist:
        return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

    # Use the authenticated restaurant's ID to add a dish
    data = request.data.copy()
    data['restaurant'] = restaurant.id

    serializer = DishSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    print(f"Errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def get_restaurants_by_location(request):
    try:
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        dietary_type = request.data.get('type')
        delivery_type = request.data.get('dType')

        # Filter restaurants based on the passed parameters
        restaurants = Restaurant.objects.all()

        # Apply additional filters for dietary options and delivery type if provided
        if dietary_type:
            restaurants = restaurants.filter(dietary_options__icontains=dietary_type)
        if delivery_type:
            restaurants = restaurants.filter(delivery_type__icontains=delivery_type)

        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

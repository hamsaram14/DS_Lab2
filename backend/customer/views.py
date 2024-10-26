from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer
from .serializers import CustomerSerializer
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import logout
from .models import Favorite
from .serializers import FavoriteSerializer
from restaurant.models import Restaurant, Dish
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import IntegrityError
from restaurant.serializers import RestaurantSerializer  # Assuming you have a RestaurantSerializer in your restaurant app


@api_view(['POST'])
@permission_classes([AllowAny])
def customer_signup(request):
    data = request.data.copy()  # Make a copy to avoid modifying the original data

    # Validate required fields
    required_fields = ['email', 'first_name', 'last_name', 'password']
    if not all(key in data for key in required_fields):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if a user with the given email already exists
    if User.objects.filter(email=data['email']).exists():
        return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Create the user
    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        password=data['password']
    )

    # Remove fields that are not in the Customer model
    data.pop('password')
    data.pop('email')
    data.pop('first_name')
    data.pop('last_name')

    # Create the customer
    customer = Customer.objects.create(user=user, **data)

    # Serialize the customer data
    serializer = CustomerSerializer(customer)

    return Response(serializer.data, status=status.HTTP_201_CREATED)




# 2. Customer Login (Password Check)
@api_view(['POST'])
@permission_classes([AllowAny]) 
def customer_login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        # Fetch user by email
        user = User.objects.get(email=email)
        # print("User found:", user.email)  # Debug log
        # print("Stored password hash:", user.password_hash)  # Print stored hash
        # print("Entered password:", password)
    except User.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

    # Verify the password
    if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'token': str(refresh.access_token),  # Access token
                'refresh': str(refresh)  # Refresh token
            }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

# 3. Get a specific Customer Profile
@api_view(['GET'])
def get_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CustomerSerializer(customer)
    return Response(serializer.data)

# 4. Update a Customer Profile (Update Password with Hashing)
@api_view(['PUT'])
def update_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # If the password is being updated, hash it
    if 'password' in data:
        data['password'] = make_password(data['password'])

    # Perform partial update
    serializer = CustomerSerializer(customer, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 5. Delete a Customer Profile
@api_view(['DELETE'])
def delete_customer(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    customer.delete()
    return Response({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# Customer Logout
@api_view(['POST'])
def customer_logout(request):
    logout(request)  # Django built-in function for logging out
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    # Manually authenticating and printing user details for debugging
    jwt_authenticator = JWTAuthentication()
    try:
        user_auth_tuple = jwt_authenticator.authenticate(request)
        if user_auth_tuple is not None:
            user, _ = user_auth_tuple
            print(f"Authenticated User: {user}, Is Authenticated: {user.is_authenticated}")
        else:
            print("Authentication failed")
    except Exception as e:
        print(f"Exception during manual authentication: {e}")
        return Response({'error': 'Token verification failed.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Fetch the Customer instance associated with the authenticated user
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    # The rest of your add_favorite implementation here...
    restaurant_id = request.data.get('restaurant_id')
    dish_id = request.data.get('dish_id')

    if not restaurant_id and not dish_id:
        return Response({'error': 'No restaurant or dish selected'}, status=status.HTTP_400_BAD_REQUEST)

    if restaurant_id:
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            favorite, created = Favorite.objects.get_or_create(customer=customer, restaurant=restaurant)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Invalid restaurant ID'}, status=status.HTTP_400_BAD_REQUEST)
    elif dish_id:
        try:
            dish = Dish.objects.get(id=dish_id)
            favorite, created = Favorite.objects.get_or_create(customer=customer, dish=dish)
        except Dish.DoesNotExist:
            return Response({'error': 'Invalid dish ID'}, status=status.HTTP_400_BAD_REQUEST)

    if created:
        return Response({'success': 'Favorite added'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'info': 'Already in favorites'}, status=status.HTTP_200_OK)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_favorite(request):
    try:
        customer = Customer.objects.get(user=request.user)  # Ensure it's a Customer instance
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    restaurant_id = request.data.get('restaurant_id')
    dish_id = request.data.get('dish_id')

    if restaurant_id:
        Favorite.objects.filter(customer=customer, restaurant_id=restaurant_id).delete()
    elif dish_id:
        Favorite.objects.filter(customer=customer, dish_id=dish_id).delete()

    return Response({'success': 'Favorite removed'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_favorites(request):
    try:
        # Assuming Customer is related to User with a OneToOneField named 'user'
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    favorites = Favorite.objects.filter(customer=customer)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_own_profile(request):
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CustomerSerializer(customer)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_restaurants(request):
    """
    Retrieves a list of all available restaurants.
    """
    restaurants = Restaurant.objects.all()
    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Order, OrderItem
from cart.models import Cart
from .serializers import OrderSerializer
from customer.models import Customer
import traceback

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        # Authenticate the customer
        jwt_authenticator = JWTAuthentication()
        user_auth_tuple = jwt_authenticator.authenticate(request)
        if user_auth_tuple is not None:
            user, _ = user_auth_tuple
        else:
            return Response({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get the customer instance
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        # Try to fetch the cart for the customer
        try:
            cart = Cart.objects.get(customer=customer)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found for this customer'}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the cart is not empty
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the order
        order = Order.objects.create(customer=customer, restaurant=cart.items.first().dish.restaurant)

        # Add items from the cart to the order
        for item in cart.items.all():
            OrderItem.objects.create(order=order, dish=item.dish, quantity=item.quantity)

        # Clear the cart after placing the order
        cart.items.all().delete()
        return Response({'success': 'Order placed successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        traceback.print_exc()  # Print full error traceback for debugging
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_order(request, order_id):
    try:
        # Authenticate the customer
        jwt_authenticator = JWTAuthentication()
        user_auth_tuple = jwt_authenticator.authenticate(request)
        if user_auth_tuple is not None:
            user, _ = user_auth_tuple
        else:
            return Response({'error': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get the customer instance
        try:
            customer = Customer.objects.get(user=user)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the order and ensure it belongs to the authenticated customer
        try:
            order = Order.objects.get(id=order_id, customer=customer)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        traceback.print_exc()  # Print full error traceback for debugging
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
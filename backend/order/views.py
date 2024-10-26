from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Order, OrderItem
from restaurant.models import Restaurant
from cart.models import Cart
from .serializers import OrderSerializer
from customer.models import Customer
from restaurant.models import Dish
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
        order_detail = serializer.data
        order_data = {
            "id": order_detail["id"],
            "restaurant_name": Restaurant.objects.filter(id=order_detail["restaurant"]).first().name,
            "status": order_detail["status"],
            "created_at": order_detail["created_at"],
        }
        print("view_order", serializer.data)

        item_details = []
        total_price = 0
        for item in order_detail["items"]:
            dish = Dish.objects.filter(id=item["dish"]).first()
            item_details.append(
                {
                    "id": item["id"],
                    "dish_name": dish.name,
                    "dish_price": dish.price,
                    "quantity": item["quantity"]
                }
            )
            total_price += dish.price * item["quantity"]
        order_data["items"] = item_details
        order_data["total_price"] = total_price

        return Response(order_data, status=status.HTTP_200_OK)
    except Exception as e:
        traceback.print_exc()  # Print full error traceback for debugging
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_customer_orders(request):
    try:
        customer = request.user.customer  # Assuming OneToOneField from User to Customer
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    orders = Order.objects.filter(customer=customer).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    all_orders = []
    for order in serializer.data:
        restaurant = Restaurant.objects.filter(id=order["restaurant"]).first()
        customer = Customer.objects.filter(id=order["customer"]).first()

        order_detail = {
            "id": order["id"],
            "restaurant_name": restaurant.name,
            "restaurant_location": restaurant.location,
            "items": order["items"],
            "customer_name": f"{customer.first_name} {customer.last_name}",
            "status": order["status"],
            "created_at": order["created_at"]
        }
        order_items = []
        total_price = 0
        total_items = 0
        for item in order["items"]:
            dish = Dish.objects.filter(id=item["dish"]).first()
            order_items.append(
                {
                    "dish_name": dish.name,
                    "quantity": item["quantity"],
                    "price": dish.price
                }
            )
            total_price += item["quantity"] * dish.price
            total_items += item["quantity"]
        order_detail["items"] = order_items
        order_detail["total_price"] = total_price
        order_detail["total_items"] = total_items
        all_orders.append(order_detail)

    # print("all_orders", all_orders)
    return Response(all_orders, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders_for_restaurant(request, restaurant_id):
    try:
        restaurant = Restaurant.objects.get(id=restaurant_id)
    except Restaurant.DoesNotExist:
        return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

    orders = Order.objects.filter(restaurant=restaurant)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    serializer = OrderSerializer(order, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

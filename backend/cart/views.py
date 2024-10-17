from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from restaurant.models import Dish

# 1. Add to Cart
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    customer = request.user.customer
    dish_id = request.data.get('dish_id')
    quantity = request.data.get('quantity', 1)

    if not dish_id:
        return Response({"error": "Dish ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        dish = Dish.objects.get(id=dish_id)
        cart, created = Cart.objects.get_or_create(customer=customer)
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, dish=dish)
        
        if not item_created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({'success': 'Item added to cart'}, status=status.HTTP_200_OK)
    except Dish.DoesNotExist:
        return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# 2. Get Cart Items
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_items(request):
    try:
        customer = request.user.customer
        cart = Cart.objects.get(customer=customer)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

# 3. Update Cart Item
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, dish_id):
    try:
        customer = request.user.customer
        cart = Cart.objects.get(customer=customer)
        cart_item = CartItem.objects.get(cart=cart, dish_id=dish_id)
        quantity = request.data.get('quantity')

        if quantity is None or int(quantity) <= 0:
            return Response({'error': 'Quantity must be greater than zero'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = quantity
        cart_item.save()
        return Response({'success': 'Cart item updated'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

# 4. Remove Cart Item
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, dish_id):
    try:
        customer = request.user.customer
        cart = Cart.objects.get(customer=customer)
        cart_item = CartItem.objects.get(cart=cart, dish_id=dish_id)
        cart_item.delete()
        return Response({'success': 'Cart item removed'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

# 5. Clear Cart
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        customer = request.user.customer
        cart = Cart.objects.get(customer=customer)
        cart.items.all().delete()
        return Response({'success': 'Cart cleared'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
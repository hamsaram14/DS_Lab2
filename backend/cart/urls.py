from django.urls import path
from . import views

urlpatterns = [
    path('add_to_cart/', views.add_to_cart, name='add_to_cart'),
    path('get_cart_items/', views.get_cart_items, name='get_cart_items'),
    path('update_cart_item/<int:dish_id>/', views.update_cart_item, name='update_cart_item'),
    path('remove_cart_item/<int:dish_id>/', views.remove_cart_item, name='remove_cart_item'),
    path('clear_cart/', views.clear_cart, name='clear_cart'),
]
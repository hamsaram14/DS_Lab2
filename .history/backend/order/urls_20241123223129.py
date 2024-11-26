from django.urls import path
from .views import create_order, view_order, list_customer_orders, get_orders_for_restaurant, update_order_status

from . import views

urlpatterns = [
    path('create_order/', create_order, name='create_order'),
    path('view_order/<int:order_id>/', view_order, name='view_order'),
    path('restaurant/<int:restaurant_id>/', views.get_orders_for_restaurant, name='get_orders_for_restaurant'),
    path('update/<int:pk>/', views.update_order_status, name='update_order_status'),
    //path('list_customer_orders/', list_customer_orders, name='list_customer_orders'),
    path('list_customer_orders/', views.list_customer_orders, name='list_customer_orders'),

]
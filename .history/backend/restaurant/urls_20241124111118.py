from django.urls import path
from . import views
from django.urls import path
from .views import restaurant_signup, restaurant_login

urlpatterns = [
    path('signup/', views.restaurant_signup, name='restaurant_signup'),
    path('login/', views.restaurant_login, name='restaurant_login'),
    path('add_dish/', views.add_dish, name='add_dish'),
    path('<int:restaurant_id>/dishes/', views.get_dishes, name='get_dishes'),
    path('<int:pk>/', views.get_restaurant, name='get_restaurant'),
    path('<int:pk>/update/', views.update_restaurant, name='update_restaurant'),
    path('restaurant/location/', views.get_restaurants_by_location, name='get_restaurants_by_location'),
    path('upload/', views.upload_image, name='upload_image'),
    path('logout/', views.restaurant_logout), 
]

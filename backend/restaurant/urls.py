from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.restaurant_signup, name='restaurant_signup'),
    path('login/', views.restaurant_login, name='restaurant_login'),
    path('add_dish/', views.add_dish, name='add_dish'),
    path('get_dishes/<int:restaurant_id>/', views.get_dishes, name='get_dishes'),
    path('logout/', views.restaurant_logout), 
]

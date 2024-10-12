from django.urls import path
from . import views
from .views import add_favorite, remove_favorite, list_favorites, customer_logout


urlpatterns = [
    path('signup/', views.customer_signup, name='customer_signup'),
    path('login/', views.customer_login, name='customer_login'),
    path('<int:pk>/', views.get_customer, name='get_customer'),
    path('<int:pk>/update/', views.update_customer, name='update_customer'),
    path('<int:pk>/delete/', views.delete_customer, name='delete_customer'),
    path('favorite/add/', add_favorite, name='add_favorite'),
    path('favorite/remove/', remove_favorite, name='remove_favorite'),
    path('favorites/list/', list_favorites, name='list_favorites'),
    path('logout/', customer_logout, name='customer_logout'),
    path('profile/', views.get_own_profile, name='get_own_profile'),
]
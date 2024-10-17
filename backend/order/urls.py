from django.urls import path
from .views import create_order, view_order

urlpatterns = [
    path('create_order/', create_order, name='create_order'),
    path('view_order/<int:order_id>/', view_order, name='view_order'),
]
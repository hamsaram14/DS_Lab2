import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None  # No token provided, authentication skipped

        token = auth_header.split(' ')[1]

        # Send the token to the auth_service for verification
        response = requests.post('http://localhost:4000/verify', json={"token": token})

        if response.status_code != 200:
            raise AuthenticationFailed('Invalid or expired token')

        # Extract user details from the response
        user_data = response.json()
        email = user_data.get('email')

        # Create or fetch the user in Django
        user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
        return (user, None)

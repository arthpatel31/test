from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # allow authenticated users to read
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # only admin can write
        return request.user and request.user.is_authenticated and request.user.is_staff
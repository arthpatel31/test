from rest_framework import generics, status
from rest_framework.response import Response
from items.models import Item
from .serializers import ItemSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def itemsView(request):
    if request.method == 'GET':
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        items = serializer.data
        return Response({
            "items": items,
            "username": request.user.username,
            "role": "admin" if request.user.is_staff else "user"
        }, status=status.HTTP_200_OK)

class Items(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    

class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    lookup_field = 'pk'
from rest_framework import serializers
from .models import Product, ShippingAdress, Order, OrderItem, Review, UserPermissions
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class serializeProduct(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class serializeUser(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    isSalesManager = serializers.SerializerMethodField(read_only=True)
    isVerified = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "isAdmin",
            "isSalesManager",
            "isVerified",
        ]

    def get_name(self, object):
        name = object.first_name
        if name == "":
            name = object.email

        return name

    def get_isAdmin(self, object):
        return object.is_staff

    def get_isSalesManager(self, object):
        return UserPermissions.objects.get(user=object).is_sales_manager

    def get_isVerified(self, object):
        return UserPermissions.objects.get(user=object).isVerified


class serializeUserWithToken(serializeUser):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "isAdmin",
            "isSalesManager",
            "isVerified",
            "token",
        ]

    def get_token(self, object):
        token = RefreshToken.for_user(object)
        return str(token.access_token)


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAdress
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "_id",
            "paymentMethod",
            "isPaid",
            "deliveredAt",
            "createdAt",
            "orderItems",
            "shippingAddress",
            "user",
            "refundRequsted",
            "totalPrice",
            "shippingPrice",
            "isDelivered",
        ]

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shippingadress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = serializeUser(user, many=False)
        return serializer.data

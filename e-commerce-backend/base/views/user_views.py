from base.models import UserPermissions
from django.core.checks import messages
from django.http import request
from django.shortcuts import render
import jwt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.conf import settings
from base.serializer import serializeUser, serializeUserWithToken
from django.core.mail import send_mail
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import reverse
import django.contrib.auth.password_validation as validators
from django.core import exceptions


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = serializeUserWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = serializeUser(user, many=False)
    return Response(
        serializer.data,
    )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = serializeUserWithToken(user, many=False)

    data = request.data
    user.first_name = data["name"]
    user.username = data["username"]
    user.email = data["email"]
    if data["password"] != "":
        user.password = make_password(data["password"])

    user.save()

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = serializeUser(users, many=True)
    return Response(
        serializer.data,
    )


@api_view(["GET"])
def verifyEmail(request):
    token = request.GET.get("token")
    try:
        payload = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=["HS256"])
        user = User.objects.get(id=payload["user_id"])
        userPermisson = UserPermissions.objects.get(user=user)
        if not userPermisson.isVerified:
            userPermisson.isVerified = True
            userPermisson.save()
        message = {"detail": "Account Activated"}
        return Response(message, status=status.HTTP_200_OK)
    except jwt.ExpiredSignatureError as identifier:
        message = {"detail": "Activation link expired"}
        return Response(message, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError as identifier:
        message = {"detail": "Invalid Token"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def registerUser(request):
    data = request.data
    if User.objects.filter(email=data["email"]).exists():
        message = {"detail": "user with this email already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    try:
        validators.validate_password(data["password"])
    except exceptions.ValidationError as e:
        message = {"detail": list(e.messages)}
        return Response(message, status=status.HTTP_417_EXPECTATION_FAILED)
    try:
        user = User.objects.create(
            first_name=data["name"],
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"]),
        )
        UserPermissions.objects.create(
            user=user, is_sales_manager=False, isVerified=False
        )
        serializer = serializeUserWithToken(user, many=False)
        link = "/user/verify?token=" + serializer.data["token"]
        url = "http://localhost:3000" + link

        context = {
            "url": url,
        }
        request
        message = render(request, "verif.html", context)
        send_mail(
            "Verify your email",
            "",
            "estorehomemarket@gmail.com",
            [user.email],
            fail_silently=False,
            html_message=message.content.decode(),
        )
        return Response(serializer.data)
    except:
        message = {"detail": "user with this username already exists"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = serializeUser(user, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data["name"]
    user.username = data["username"]
    user.email = data["email"]
    user.is_staff = data["isAdmin"]
    user.save()
    userPermisson = UserPermissions.objects.get(user=user)
    userPermisson.isSalesManager = data["isSalesManager"]

    serializer = serializeUser(user, many=False)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response("User is deleted")

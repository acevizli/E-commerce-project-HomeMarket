from django.core import paginator
from base.models import Product, ShippingAdress, Order, OrderItem
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from rest_framework import status
from datetime import datetime
from django.core.mail import send_mail
from base.serializer import serializeProduct, OrderSerializer, serializeUser

from django.shortcuts import render
import json
from django.core.paginator import Page, Paginator, PageNotAnInteger, EmptyPage


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data["orderItems"]
    print(orderItems and len(orderItems) == 0)

    if orderItems is not None and len(orderItems) == 0:
        return Response(
            {"detail": "Shopping Cart is Empty"}, status=status.HTTP_400_BAD_REQUEST
        )
    else:

        # (1) Create order
        order = Order.objects.create(
            user=user,
            shippingPrice=data["shippingPrice"],
            totalPrice=data["totalPrice"],
            paymentMethod=data["paymentMethod"]["type"],
            isPaid=True,
        )
        # (2) Create shipping address
        shipping = ShippingAdress.objects.create(
            order=order,
            address=data["shippingAddress"]["address"],
            city=data["shippingAddress"]["city"],
            postalCode=data["shippingAddress"]["postalCode"],
            country=data["shippingAddress"]["country"],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(id=i["id"])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i["amount"],
                price=product.price,
                image=product.image.url,
            )

            # (4) Update stock

            product.inStock -= item.qty
            product.save()
        context = {
            "id": order._id,
            "items": orderItems,
            "address": shipping.address,
            "totalPrice": order.totalPrice,
            "shipping_fee": order.shippingPrice,
            "card": "************" + data["paymentMethod"]["card"]["last4"],
        }
        request
        message = render(request, "conf.html", context)
        send_mail(
            "ORDER CONFIRMED",
            "",
            "estorehomemarket@gmail.com",
            [user.email],
            fail_silently=False,
            html_message=message.content.decode(),
        )
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.order_by("-createdAt")
    page = request.query_params.get("page")
    paginator = Paginator(orders, 10)
    try:
        orders = paginator.page(page)
    except PageNotAnInteger:
        orders = paginator.page(1)
    except EmptyPage:
        orders = paginator.page(paginator.num_pages)

    if page is None:
        page = 1
    page = int(page)

    serializer = OrderSerializer(orders, many=True)
    return Response(
        {"orders": serializer.data, "page": page, "pages": paginator.num_pages}
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response(
                {"detail": "Not authorized to view this order"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except:
        return Response(
            {"detail": "Order does not exist"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response("Order was paid")


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response("Order was delivered")


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def refundOrder(request, pk):
    order = Order.objects.get(_id=pk)
    order.refundRequsted = True
    order.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteOrder(request, pk):
    order = Order.objects.get(_id=pk)
    order.delete()
    return Response("Producted Deleted")

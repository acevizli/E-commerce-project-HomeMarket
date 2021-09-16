from django.contrib.auth.models import User
from django.shortcuts import render
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Review
from base.serializer import ReviewSerializer, serializeProduct

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


@api_view(["GET"])
def getProducts(request):
    products = Product.objects.all()
    serializer = serializeProduct(products, many=True)
    return Response(
        serializer.data,
    )


@api_view(["GET"])
def getProduct(request, key):
    product = Product.objects.get(id=key)
    serializer = serializeProduct(product, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name="Sample Name",
        price=0,
        brand="Sample Brand",
        inStock=0,
        category="Sample Category",
        description="",
        featured=False,
    )

    serializer = serializeProduct(product, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)

    oldPrice = product.price

    product.name = data["name"]
    product.price = "{:.2f}".format(data["price"])
    product.brand = data["brand"]
    product.inStock = data["inStock"]
    product.category = data["category"]
    product.description = data["description"]
    product.featured = data["featured"]
    product.save()

    newPrice = product.price
    if float(oldPrice) > float(newPrice):
        print(oldPrice)
        print(newPrice)
        context = {
            "oldPrice": oldPrice,
            "newPrice": newPrice,
            "discount": (
                "{:.2f}".format(
                    ((float(oldPrice) - float(newPrice)) / float(oldPrice)) * 100
                )
            ),
            "name": product.name,
        }
        request
        message = render(request, "discount.html", context)
        send_mail(
            "NEW PRICE FOR PRODUCT YOU WOULD LIKE",
            "",
            "estorehomemarket@gmail.com",
            ["deneme003838@gmail.com"],
            fail_silently=False,
            html_message=message.content.decode(),
        )
    serializer = serializeProduct(product, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(id=pk)
    product.delete()
    return Response("Producted Deleted")


@api_view(["POST"])
def uploadImage(request):
    data = request.data

    product_id = data["productid"]
    product = Product.objects.get(id=product_id)

    product.image = request.FILES.get("image")
    product.save()

    return Response("Image was uploaded")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        review = product.review_set.get(user=user)
        review.rating = data["rating"]
        review.comment = data["comment"]
        review.approved = False
        review.save()

    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data["rating"],
            comment=data["comment"],
            approved=False,
        )

    reviews = product.review_set.all()
    product.numReviews = len(reviews)
    total = 0
    for i in reviews:
        total += i.rating
    product.stars = total / len(reviews)
    product.save()
    print(product.rating)

    return Response("Review Added")


@api_view(["GET"])
def getReviews(request):
    reviews = Review.objects.all()
    serializer = ReviewSerializer(reviews, many=True)
    return Response(
        serializer.data,
    )


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteReview(request, pk):
    review = Review.objects.get(_id=pk)
    review.delete()
    return Response("Review Deleted")


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateReview(request, pk):
    data = request.data
    review = Review.objects.get(_id=pk)

    review.approved = data["approved"]
    review.save()

    serializer = ReviewSerializer(review, many=False)
    return Response(serializer.data)

from django.urls import path
from base.views import product_views


urlpatterns = [
    path("", product_views.getProducts, name="products"),
    path("create/", product_views.createProduct, name="product-create"),
    path("upload/", product_views.uploadImage, name="image-upload"),
    path("<str:pk>/reviews/", product_views.createProductReview, name="create-review"),
    path("reviews/", product_views.getReviews, name="reviews"),
    path("reviews/delete/<str:pk>/", product_views.deleteReview, name="delete-reviews"),
    path("reviews/update/<str:pk>/", product_views.updateReview, name="update-reviews"),
    path("<str:key>/", product_views.getProduct, name="product"),
    path("update/<str:pk>/", product_views.updateProduct, name="product-update"),
    path("delete/<str:pk>/", product_views.deleteProduct, name="product-delete"),
]

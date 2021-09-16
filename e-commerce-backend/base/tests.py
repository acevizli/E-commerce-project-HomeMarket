from django.test import TestCase
from .models import Product
from django.urls import reverse
from . import views
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
import requests
import json
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
# Create your tests here.

# command for executing unit tests:
# coverage run manage.py test base
# test methods should start with test in their names

    

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class ProductTest(APITestCase):

    @property
    def bearer_token(self):
        # assuming there is a user in User model
        user = User.objects.get(id=1)
        client = APIClient()
        refresh = RefreshToken.for_user(user)
        return {"HTTP_AUTHORIZATION":f'Bearer {refresh.access_token}'}

    def create_product(self, des="bruh",name="aaa",id=0):  # create product object for testing
        return Product.objects.create(description=des,name=name,id=id)

    def test_product_creation(self):
        w = self.create_product()
        self.assertTrue(isinstance(w,Product))
        self.assertEqual(w.__str__(), w.name)


    def test_products_list_view(self):
        w = self.create_product()

        url = reverse(views.product_views.getProducts)
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertIn(w.name.encode(), resp.content) # documentation says str should be passed but str gives error ???

    
    def test_get_product(self):
        w = self.create_product(name="pala sunglasses",id=10)
        url = reverse(views.product_views.getProduct,args=[10])

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertIn(w.name.encode(), resp.content) 
        #print(resp.content)


    def test_post_product(self):  # backend creating product with defaults, gotta change it 
        w = self.create_product()
        url = reverse(views.product_views.createProduct)
        conf ={  # given token for user which has id of 13
                'Content-type': 'application/json',
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjIwOTQzNzM5LCJqdGkiOiJmNzgyZmM5ZjA0N2M0ZGE1YmNhNmE0OGMyYWMxMzVlOCIsInVzZXJfaWQiOjEzfQ.40MtSo9DLMZSXfL6BDK2SSvHc1jrMaBX8Dndc-WYb8Q",
            }
        resp = requests.post(url="http://localhost:8000" + url, headers=conf,
        data={"name":"su"})
        json_str = resp.content.decode("utf-8")
        resp_json = json.loads(json_str)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp_json["user"], 13)  # did it assigns correct user?


    def test_post_wo_auth(self):  # non-authenticated product add try, should return 401
        url = reverse(views.product_views.createProduct)
        conf ={  # given token for user which has id of 13
                'Content-type': 'application/json',
                "Authorization": "Bearer sdaasdassadasa",
            }
        resp = requests.post(url="http://localhost:8000" + url, headers=conf,
        data={"name":"su"})
        self.assertEqual(resp.status_code, 401) # unauthenticated access try


    def test_update_product(self):  
        w = self.create_product(id=1)
        product = reverse(views.product_views.updateProduct,args=[1])
       
        data = {"name":"chg_name","price":100,"brand":"gucci","inStock":10,
        "category":"entertainment","description":"boom","featured":0}

        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        resp = self.client.put(path=product,data=data, **self.bearer_token)
        #print(resp.content)
        self.assertEqual(resp.status_code, 200)
        self.assertIn(data["brand"].encode(),resp.content)

    
    def test_update_prod_wo_auth(self):
        url = reverse(views.product_views.updateProduct,args=[1])
        conf ={ 
                'Content-type': 'application/json',
                "Authorization": "Bearer sdaasdassadasa",
            }
        resp = requests.post(url="http://localhost:8000" + url, headers=conf,
        data={"name":"su"})
        self.assertEqual(resp.status_code, 401) 

    
    def test_delete_product(self):  
        w = self.create_product(id=1)
        product = reverse(views.product_views.deleteProduct,args=[1])
       
        data = {"productid":1}

        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        resp = self.client.delete(path=product,data=data, **self.bearer_token)
        #print(resp.content)
        self.assertEqual(resp.status_code, 200)


    def test_delete_wo_auth(self):
        url = reverse(views.product_views.deleteProduct,args=[1])
        conf ={  # given token for user which has id of 13
                'Content-type': 'application/json',
                "Authorization": "Bearer sdaasdassadasa",
            }
        resp = requests.post(url="http://localhost:8000" + url, headers=conf,
        data={"name":"su"})
        self.assertEqual(resp.status_code, 401) 


    def test_get_user_profile(self):
        target = reverse(views.user_views.getUserProfile)
       
        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        resp = self.client.get(path=target, **self.bearer_token)
        #print(resp.content)
        self.assertEqual(resp.status_code, 200)
        self.assertIn(self.user.username.encode(),resp.content)


    def test_update_user_profile(self):
        target = reverse(views.user_views.updateUserProfile)
       

        data = {"name":"fatih3","email":"fatihoztank1997@gmail.com",
        "password":"newpass"}

        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        resp = self.client.put(path=target, **self.bearer_token, data=data)
        #print(resp.content)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("fatihoztank1997@gmail.com".encode(),resp.content)


    def test_get_users(self):
        target = reverse(views.user_views.getUsers)
        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        User.objects.create_user('foo2', 'foo2@bar.de', 'bar2')
        resp = self.client.get(path=target, **self.bearer_token)
        #print(resp.content)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("foo2".encode(),resp.content)


    def test_register_user(self):
        target = reverse(views.user_views.registerUser)
        data = {"name":"fatih3","email":"fatihoztank1997@gmail.com",
        "password":"newpass","username":"fatih03"}
        resp= self.client.post(path=target, data=data)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("fatih03".encode(),resp.content)


    def test_existing_user(self):
        target = reverse(views.user_views.registerUser)
        data = {"name":"fatih3","email":"foo@bar.de",
        "password":"newpass","username":"fatih03"}
        self.user = User.objects.create_user('fatih03', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        resp= self.client.post(path=target, data=data)
        self.assertEqual(resp.status_code, 400)

    
    def test_getuser_by_id(self):
        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        target = reverse(views.user_views.getUserById,args=[1])
        resp = self.client.get(path=target, **self.bearer_token)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("foo".encode(),resp.content)

    
    def test_delete_user(self):
        self.user = User.objects.create_user('foo', 'foo@bar.de', 'bar')
        self.user.is_active = True
        self.user.is_staff = True
        self.user.save()
        User.objects.create_user('foo2', 'foo2@bar.de', 'bar2')
        target = reverse(views.user_views.deleteUser,args=[2])
        resp = self.client.delete(path=target, **self.bearer_token)
        self.assertEqual(resp.status_code, 200)
        #print(resp.content)
        self.assertNotIn("foo2".encode(),resp.content)


    



        


    

       


    


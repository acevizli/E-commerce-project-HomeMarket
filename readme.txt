Setup:
virtualenv myvenv
.\myenv\Scripts\activate
cd .\e-commerce-backend\
pip install -r requirements.txt
cd ..
cd .\ecommerce-frontend\
npm install

run:
if not in virtualenv: 
	.\myenv\Scripts\activate 
cd .\e-commerce-backend\
python manage.py runserver
cd ..
cd .\ecommerce-frontend\
npm start
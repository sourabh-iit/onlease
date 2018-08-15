# from django.test import TestCase
# from django.urls import reverse
# from apps.lodging.models import BaseBusiness,Lodging
# import datetime
# import os
# import shutil
# from django.conf import settings
# from django.core.files.uploadedfile import SimpleUploadedFile
# from apps.user.tests import loginFunc
# from django.contrib.auth import get_user_model

# User = get_user_model()

# right_number = '9999999999'
# wrong_number = '897897897'
# password1 = 'Ss123456'
# password2 = 'Ss123457'

# def get_binary_data(image_location):
#     bytes_data = b''
#     with open(image_location,'rb') as imageFile:
#         f = imageFile.read()
#         bytes_data = bytearray(f)
#     return bytes_data

# def delete_files(*args):
#     for file in args:
#         try:
#             os.remove(settings.MEDIA_ROOT+'/'+file)
#         except OSError as e:
#             print(e)

# class TestAdsView(TestCase):
#     def setup(self):
#         loginFunc(self)
#         user = User.objects.get(mobile_number=right_number)
#         image1_location = settings.MEDIA_ROOT+'/test/images/beautiful-sunset.jpg'
#         image2_location = settings.MEDIA_ROOT+'/test/images/cat-720.png'
#         self.client.get(reverse('lodging:create'))
#         data = {
#             'image-TOTAL_FORMS': '2',
#             'image-INITIAL_FORMS': '0',
#             'image-MAX_NUM_FORMS': '3',
#             'image-0-image': SimpleUploadedFile(image1_location.split('/')[-1],
#                     get_binary_data(image1_location),
#                     content_type='image/'+os.path.splitext(image1_location)[-1]),
#             'image-1-image': SimpleUploadedFile(image2_location.split('/')[-1],
#                     get_binary_data(image2_location),
#                     content_type='image/'+os.path.splitext(image1_location)[-1]),
#             'rent': '50000',
#             'lodging_type': Lodging.FLAT,
#             'location': BaseBusiness.MUKHERJEE_NAGAR,
#             'address': 'Full address here',
#             'title': 'Just a title under seventy characters with no period',
#             'additional_details': 'Additional details under 2000 characters. Many special characters can be used.',
#             'available_from': datetime.date(2018,6,25),
#             'floor_no': 0,
#             'total_floors': 9,
#             'land_area': '5000',
#             'is_parking_available': False,
#             # 'is_kitchen_available': True,
#             'is_furnished': False,
#             'user': user
#         }
#         self.client.post(reverse('lodging:create'),data)
#         self.client.get(reverse('lodging:create'))
#         data = {
#             'image-TOTAL_FORMS': '2',
#             'image-INITIAL_FORMS': '0',
#             'image-MAX_NUM_FORMS': '3',
#             'image-0-image': SimpleUploadedFile(image1_location.split('/')[-1],
#                     get_binary_data(image1_location),
#                     content_type='image/'+os.path.splitext(image1_location)[-1]),
#             'image-1-image': SimpleUploadedFile(image2_location.split('/')[-1],
#                     get_binary_data(image2_location),
#                     content_type='image/'+os.path.splitext(image1_location)[-1]),
#             'rent': '6000',
#             'lodging_type': Lodging.ROOM,
#             'location': BaseBusiness.MUNIRKA,
#             'address': 'Full address here',
#             'title': 'Just a title under seventy characters with no period',
#             'additional_details': 'Additional details under 2000 characters. Many special characters can be used.',
#             'is_booked': True,
#             'floor_no': 2,
#             'total_floors': 3,
#             'land_area': '500',
#             'is_parking_avilable': False,
#             'is_kitchen_available': True,
#             'is_furnished': False,
#             'user': user
#         }
#         self.client.post(reverse('lodging:create'),data)
#         self.client.get(reverse('lodging:create'))
#         data = {
#             'image-TOTAL_FORMS': '0',
#             'image-INITIAL_FORMS': '0',
#             'image-MAX_NUM_FORMS': '3',
#             'rent': '7000',
#             'lodging_type': Lodging.ROOM,
#             'location': BaseBusiness.MUNIRKA,
#             'address': 'Full address here',
#             'title': 'Just a title under seventy characters with no period',
#             'additional_details': 'Additional details under 2000 characters. Many special characters can be used.',
#             'available_from': datetime.date(2018,5,23),
#             'floor_no': 8,
#             'total_floors': 9,
#             'land_area': '5000',
#             'is_parking_avilable': False,
#             'is_kitchen_available': False,
#             'is_furnished': True,
#             'user': user
#         }
#         self.client.post(reverse('lodging:create'),data)
#         self.client.get(reverse('lodging:create'))
#         data = {
#             'image-TOTAL_FORMS': '2',
#             'image-INITIAL_FORMS': '0',
#             'image-MAX_NUM_FORMS': '3',
#             'image-0-image': SimpleUploadedFile(image1_location.split('/')[-1],
#                     get_binary_data(image1_location),
#                     content_type='image/'+os.path.splitext(image1_location)[-1]),
#             'image-1-image': SimpleUploadedFile(image2_location.split('/')[-1],
#                     get_binary_data(image2_location),
#                     content_type='image/'+os.path.splitext(image1_location)[-1]),
#             'rent': '6000',
#             'lodging_type': Lodging.ROOM,
#             'location': BaseBusiness.KAROL_BAGH,
#             'address': 'Full address here',
#             'title': 'Just a title under seventy characters with no period',
#             'additional_details': 'Additional details under 2000 characters. Many special characters can be used.',
#             'available_from': datetime.date(2018,3,21),
#             'floor_no': 0,
#             'total_floors': 3,
#             'land_area': '3000',
#             'is_parking_avilable': True,
#             'is_kitchen_available': True,
#             'is_furnished': False,
#             'user': user
#         }
#         self.client.post(reverse('lodging:create'),data)
#         try:
#             shutil.rmtree(os.path.join(settings.MEDIA_ROOT,user.mobile_number))
#         except:
#             pass

#     def test_lodging_multiple_locations(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MN','MU'],
#         })
#         self.assertEqual(len(response.context['ads']),2)
#         self.assertEqual(response.context['ads'][0].location,BaseBusiness.MUNIRKA)
#         self.assertEqual(response.context['ads'][1].location,BaseBusiness.MUKHERJEE_NAGAR)

#     def test_lodging_rent_range(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['KB','MU'],
#             'min_rent': 5000,
#             'max_rent': 8000
#         })
#         self.assertEqual(len(response.context['ads']),2)
#         self.assertEqual(response.context['ads'][0].rent>=5000,True)
#         self.assertEqual(response.context['ads'][0].rent<=8000,True)
#         self.assertEqual(response.context['ads'][1].rent>=5000,True)
#         self.assertEqual(response.context['ads'][1].rent<=8000,True)

#     def test_lodging_availability_range(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MU','KB'],
#             'lower_availability': datetime.date(2018,3,20),
#             'upper_availability': datetime.date(2018,3,23)
#         })
#         self.assertEqual(len(response.context['ads']),1)
#         self.assertEqual(response.context['ads'][0].location,BaseBusiness.KAROL_BAGH)

#     def test_lodging_top_floor_success(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MU'],
#             'top_floor': True
#         })
#         self.assertEqual(len(response.context['ads']),1)

#     def test_lodging_top_floor_fail(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MN'],
#             'top_floor': True
#         })
#         self.assertEqual(len(response.context['ads']),0)

#     def test_lodging_ground_floor_success(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MN'],
#             'ground_floor': True
#         })
#         self.assertEqual(len(response.context['ads']),1)

#     def test_lodging_ground_floor_fail(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MU'],
#             'ground_floor': True
#         })
#         self.assertEqual(len(response.context['ads']),0)

#     def test_lodging_furnished_success(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MU'],
#             'furnished': True
#         })
#         self.assertEqual(len(response.context['ads']),1)

#     def test_lodging_furnished_fail(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MN'],
#             'furnished': True
#         })
#         self.assertEqual(len(response.context['ads']),0)

#     def test_lodging_parking_success(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MN'],
#             'parking': True
#         })
#         self.assertEqual(len(response.context['ads']),1)

#     def test_lodging_parking_fail(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MU'],
#             'parking': True
#         })
#         self.assertEqual(len(response.context['ads']),0)

#     def test_lodging_lodging_type(self):
#         self.client.get(reverse('ads:lodging'))
#         response = self.client.post(reverse('ads:lodging'),{
#             'locations': ['MU'],
#             'lodging_type': ['R','P']
#         })
#         self.assertEqual(len(response.context['ads']),1)
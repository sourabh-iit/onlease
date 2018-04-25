from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from apps.user.tests import loginFunc
from django.contrib.auth import get_user_model
from .models import Lodging, ImageModel, CommonlyUsedLodgingModel
import datetime, os
from pathlib import Path
from django.conf import settings

User = get_user_model()

# TODO Mobie number cleaning test
# TODO Formset error handling

right_number = '8978978978'
wrong_number = '897897897'
password1 = 'Ss123456'
password2 = 'Ss123457'

valid_data = {
    'rent': '50000',
    'lodging_type': CommonlyUsedLodgingModel.FLAT,
    'location': CommonlyUsedLodgingModel.MUKHERJEE_NAGAR,
    'address': 'Full address here',
    'title': 'Just a title under seventy characters with no period',
    'additional_details': 'Additional details under 2000 characters. Many special characters can be used.',
    'available_from': datetime.date.today(),
    'floor_no': 5,
    'total_floors': 9,
    'land_area': '5000',
    'is_parking_available': True,
    'is_kitchen_available': True,
    'is_furnished': True,
}

invalid_data_flat = {
    'rent': '00000',
    'lodging_type': 'L',
    'location': 'BY',
    'address': '',
    'title': '',
    'additional_details': '<html>',
    'available_from': datetime.date(2018,2,28),
    'floor_no': 8,
    'total_floors': 8,
}

def delete_files(*args):
    for file in args:
        try:
            os.remove(settings.MEDIA_ROOT+'/'+file)
        except OSError as e:
            print(e)

def file_exists(file):
    return os.path.isfile(settings.MEDIA_ROOT+'/'+file)

def get_binary_data(image_location):
    bytes_data = b''
    with open(image_location,'rb') as imageFile:
        f = imageFile.read()
        bytes_data = bytearray(f)
    return bytes_data

def create_lodging(self):
    self.client.get(reverse('lodging:create'))
    data = {
        'image-TOTAL_FORMS': '2',
        'image-INITIAL_FORMS': '0',
        'image-MAX_NUM_FORMS': '3',
        'image-0-image': SimpleUploadedFile(self.image1_location.split('/')[-1],
                get_binary_data(self.image1_location),
                content_type='image/'+os.path.splitext(self.image1_location)[-1]),
        'image-1-image': SimpleUploadedFile(self.image2_location.split('/')[-1],
                get_binary_data(self.image2_location),
                content_type='image/'+os.path.splitext(self.image1_location)[-1]),
        'rent': valid_data['rent'],
        'lodging_type': valid_data['lodging_type'],
        'location': valid_data['location'],
        'address': valid_data['address'],
        'title': valid_data['title'],
        'additional_details': valid_data['additional_details'],
        'available_from': valid_data['available_from'],
        'total_floors': valid_data['total_floors'],
        'floor_no': valid_data['floor_no'],
        'land_area': valid_data['land_area'],
        'is_parking_available': valid_data['is_parking_available'],
        'is_furnished': valid_data['is_furnished']
    }
    response = self.client.post(reverse('lodging:create'),data)
    return response

class TestLodging(TestCase):

    def setUp(self):
        self.image1_location = settings.MEDIA_ROOT+'/test/images/beautiful-sunset.jpg'
        self.image2_location = settings.MEDIA_ROOT+'/test/images/cat-720.png'
        self.image3_location = settings.MEDIA_ROOT+'/test/images/python_file.png'
        self.image4_location = settings.MEDIA_ROOT+'/test/images/ASTRO2.BMP'
        self.image5_location = settings.MEDIA_ROOT+'/test/images/large_size.png'
        loginFunc(self)

    def test_lodging_create_success_type_flat(self):
        response = create_lodging(self)
        images = ImageModel.objects.all()
        for image in images:
            self.assertEqual(file_exists(image.image.name),True)
            self.assertEqual(file_exists(image.image_thumbnail.name),True)
            delete_files(image.image.name,image.image_thumbnail.name)
        self.assertEqual(Lodging.objects.count(),1)
        self.assertEqual(ImageModel.objects.count(),2)
        self.assertEqual(Lodging.objects.all()[0],ImageModel.objects.all()[0].lodging)
        self.assertRedirects(response,reverse('dashboard:home'))

    # def test_lodging_create_success_room(self):
    #     response = self.client.get(reverse('lodging:create'))
    #     self.assertEqual(response.client.session.test_cookie_worked(),True)
    #     data = {
    #         'image-TOTAL_FORMS': '2',
    #         'image-INITIAL_FORMS': '0',
    #         'image-MAX_NUM_FORMS': '3',
    #         'image-0-image': SimpleUploadedFile(self.image1_location.split('/')[-1],
    #                 get_binary_data(self.image1_location),
    #                 content_type='image/'+os.path.splitext(self.image1_location)[-1]),
    #         'image-1-image': SimpleUploadedFile(self.image2_location.split('/')[-1],
    #                 get_binary_data(self.image2_location),
    #                 content_type='image/'+os.path.splitext(self.image1_location)[-1]),
    #         'rent': valid_data['rent'],
    #         'lodging_type': CommonlyUsedLodgingModel.ROOM,
    #         'location': valid_data['location'],
    #         'address': valid_data['address'],
    #         'title': valid_data['title'],
    #         'additional_details': valid_data['additional_details'],
    #         'available_from': valid_data['available_from'],
    #         'total_floors': valid_data['total_floors'],
    #         'floor_no': valid_data['floor_no'],
    #         'land_area': valid_data['land_area'],
    #         'is_parking_available': valid_data['is_parking_available'],
    #         # 'is_kitchen_available': valid_data['is_kitchen_available'],
    #         'is_furnished': valid_data['is_furnished']
    #     }
    #     response = self.client.post(reverse('lodging:create'),data)
    #     self.assertEqual(Lodging.objects.count(),0)
    #     self.assertFormError(response,'sub_form','is_kitchen_available',['This field is required.'])

    # def test_lodging_create_form_invalid_field_errors(self):
    #     response = self.client.get(reverse('lodging:create'))
    #     self.assertEqual(response.client.session.test_cookie_worked(),True)
    #     data = {
    #         'image-TOTAL_FORMS': 2,
    #         'image-INITIAL_FORMS': 0,
    #         'image-0-image': SimpleUploadedFile('test_image1.jpg',
    #                 get_binary_data(self.image1_location),
    #                 content_type='image/jpeg'),
    #         'image-1-image': SimpleUploadedFile('test_image2.jpg',
    #                 get_binary_data(self.image2_location),
    #                 content_type='image/jpeg'),
    #         'rent': invalid_data_flat['rent'],
    #         'lodging_type': invalid_data_flat['lodging_type'],
    #         'location': invalid_data_flat['location'],
    #         'address': invalid_data_flat['address'],
    #         'title': invalid_data_flat['title'],
    #         'additional_details': invalid_data_flat['additional_details'],
    #         'available_from': invalid_data_flat['available_from']
    #     }
    #     response = self.client.post(reverse('lodging:create'),data)
    #     self.assertQuerysetEqual(Lodging.objects.all(),[])
    #     self.assertFormError(response,'sub_form','rent',['Enter a valid value.'])
    #     self.assertFormError(response,'sub_form','lodging_type',['Select a valid choice. L is not one of the available choices.'])
    #     self.assertFormError(response,'sub_form','location',['Select a valid choice. '+invalid_data_flat['location']+' is not one of the available choices.'])
    #     self.assertFormError(response,'form','address',['This field is required.'])
    #     self.assertFormError(response,'sub_form','title',['This field is required.'])
    #     self.assertFormError(response,'sub_form','additional_details',['Enter a valid value.'])
    #     self.assertFormError(response,'sub_form','available_from',['Enter a valid value.'])

    # def test_lodging_create_form_invalid_required_errors(self):
    #     response = self.client.get(reverse('lodging:create'))
    #     self.assertEqual(response.client.session.test_cookie_worked(),True)
    #     data = {
    #         'image-TOTAL_FORMS': 3,
    #         'image-INITIAL_FORMS': 0,
    #         'image-0-image': SimpleUploadedFile('test_image1.jpg',
    #                 get_binary_data(self.image3_location),
    #                 content_type='image/jpeg'),
    #         'image-1-image': SimpleUploadedFile('test_image2.jpg',
    #                 get_binary_data(self.image4_location),
    #                 content_type='image/jpeg'),
    #         'image-2-image': SimpleUploadedFile('test_image3.jpg',
    #                 get_binary_data(self.image5_location),
    #                 content_type='image/jpeg'),
    #         'rent': valid_data['rent'],
    #         'lodging_type': valid_data['lodging_type'],
    #         'location': valid_data['location'],
    #         'address': valid_data['address'],
    #         'title': valid_data['title'],
    #         'additional_details': valid_data['additional_details'],
    #         'available_from': valid_data['available_from'],
    #         'total_floors': valid_data['total_floors'],
    #         'floor_no': valid_data['floor_no'],
    #         'land_area': valid_data['land_area'],
    #         'is_parking_available': valid_data['is_parking_available'],
    #         # 'is_kitchen_available': valid_data['is_kitchen_available'],
    #         'is_furnished': valid_data['is_furnished']
    #     }
    #     response = self.client.post(reverse('lodging:create'),data)
    #     self.assertFormsetError(response,'formset',0,'image',['Upload a valid image. The file you uploaded was either not an image or a corrupted image.'])
    #     self.assertFormsetError(response,'formset',2,'image',['Upload a valid image. Only files with size less than 5mb are allowed.'])
    #     self.assertFormsetError(response,'formset',1,'image',['Upload a valid image. Only files with extensions png, jpg, jpeg and gif are allowed.'])

    # def test_lodging_edit_view_success(self):
    #     create_lodging(self)
    #     response = self.client.get(reverse('lodging:edit',args=[1]))
    #     data = {
    #         'imagemodel_set-TOTAL_FORMS': 2,
    #         'imagemodel_set-INITIAL_FORMS': 2,
    #         'imagemodel_set-0-image': SimpleUploadedFile('test_image1.jpg',
    #                 get_binary_data(self.image3_location),
    #                 content_type='image/jpeg'),
    #         'imagemodel_set-1-image': SimpleUploadedFile('test_image2.jpg',
    #                 get_binary_data(self.image4_location),
    #                 content_type='image/jpeg'),
    #         'rent': '4100',
    #         'update': 'any value'
    #     }
    #     response = self.client.post(reverse('lodging:edit',args=[1]),data)


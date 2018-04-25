from django.test import TestCase
from django.urls import reverse
from apps.user.tests import loginFunc

class TestDashboard(TestCase):

    def test_home_view(self):
        loginFunc(self)
        response = self.client.get(reverse('dashboard:home'))
        response.context
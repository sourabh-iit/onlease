from django.shortcuts import render

# Create your views here.
def front_page_view(request):
    return render(request,'home/landing-page.html',{})
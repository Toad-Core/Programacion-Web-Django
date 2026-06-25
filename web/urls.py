from django.urls import path
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('contacto/', views.contacto, name='contacto'),
    path('contacto/exito/', views.contacto_exito, name='contacto_exito'),
    path('catalogo/', views.catalogo, name='catalogo'),
    path('catalogo/<int:disfraz_id>/', views.detalle, name='detalle'),
]
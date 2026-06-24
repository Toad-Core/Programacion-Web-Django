from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
# from .models import Disfraz

# Create your views here.
def inicio(request):
    return render(request, 'index.html')
def contacto(request):
    return render(request, 'contacto/formulario.html')

def contacto_exito(request):
    return render(request, 'contacto/exito.html')

# def catalogo(request):
#    disfraces = Disfraz.objects.all()
#    return render(request, 'catalogo/catalogo.html', {'disfraces': disfraces})

# def detalle(request, disfraz_id):
#    disfraz = get_object_or_404(Disfraz, id=disfraz_id)
#    lista_tallas = [talla.strip() for talla in disfraz.tallas.split(',')]
#    
#    return render(request, 'catalogo/detalle.html', {
#        'disfraz': disfraz,
#        'lista_tallas': lista_tallas
#    })
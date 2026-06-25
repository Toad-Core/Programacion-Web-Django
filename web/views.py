from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Disfraz, Consulta

# Create your views here.
def inicio(request):
    return render(request, 'index.html')

@require_http_methods(["GET", "POST"])
def contacto(request):
    disfraz_param = request.GET.get('disfraz', '')
    if request.method == 'POST':
        nombre  = request.POST.get('nombre', '').strip()
        telefono = request.POST.get('telefono', '').strip()
        email   = request.POST.get('email', '').strip()
        tipo    = request.POST.get('tipoConsulta', '').strip()
        mensaje = request.POST.get('mensaje', '').strip()

        errores = {}
        if len(nombre) < 3:
            errores['nombre'] = 'El nombre debe tener al menos 3 caracteres.'
        if not telefono:
            errores['telefono'] = 'El teléfono es obligatorio.'
        if not email or '@' not in email:
            errores['email'] = 'Ingresa un correo electrónico válido.'
        if not tipo:
            errores['tipoConsulta'] = 'Selecciona un tipo de consulta.'
        if len(mensaje) < 10:
            errores['mensaje'] = 'El mensaje debe tener al menos 10 caracteres.'

        if errores:
            return JsonResponse({'ok': False, 'errores': errores}, status=400)

        Consulta.objects.create(
            nombre=nombre,
            telefono=telefono,
            email=email,
            tipo=tipo,
            mensaje=mensaje,
        )
        return JsonResponse({'ok': True, 'mensaje': '¡Consulta enviada con éxito! Te contactaremos pronto.'})

    return render(request, 'contacto/formulario.html', {'disfraz_param': disfraz_param})

def contacto_exito(request):
    return render(request, 'contacto/exito.html')

def catalogo(request):
    disfraces_qs = Disfraz.objects.all()
    disfraces = []
    for d in disfraces_qs:
        disfraces.append({
            'obj': d,
            'lista_tallas': [t.strip() for t in d.tallas.split(',')],
        })
    return render(request, 'catalogo/catalogo.html', {'disfraces': disfraces})

def detalle(request, disfraz_id):
    disfraz = get_object_or_404(Disfraz, id=disfraz_id)
    lista_tallas = [talla.strip() for talla in disfraz.tallas.split(',')]
    return render(request, 'catalogo/detalle.html', {
        'disfraz': disfraz,
        'lista_tallas': lista_tallas
    })
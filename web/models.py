from django.db import models

class Disfraz(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    tallas = models.CharField(max_length=200, default='S, M, L, XL')
    imagen = models.ImageField(upload_to='disfraces/', blank=True, null=True)

    def __str__(self):
        return self.nombre


TIPO_CONSULTA_OPCIONES = [
    ('disfraz', 'Consulta por disfraz'),
    ('stock', 'Disponibilidad'),
    ('personalizacion', 'Personalización'),
    ('otro', 'Otro'),
]

class Consulta(models.Model):
    nombre     = models.CharField(max_length=100, verbose_name='Nombre completo')
    telefono   = models.CharField(max_length=20,  verbose_name='Teléfono')
    email      = models.EmailField(verbose_name='Correo electrónico')
    tipo       = models.CharField(max_length=20, choices=TIPO_CONSULTA_OPCIONES,
                                  verbose_name='Tipo de consulta')
    mensaje    = models.TextField(verbose_name='Mensaje')
    fecha      = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de envío')
    respondida = models.BooleanField(default=False, verbose_name='Respondida')

    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Consulta'
        verbose_name_plural = 'Consultas'

    def __str__(self):
        return f'{self.nombre} — {self.get_tipo_display()} ({self.fecha:%d/%m/%Y %H:%M})'

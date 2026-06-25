from django.contrib import admin
from .models import Disfraz, Consulta

admin.site.register(Disfraz)

@admin.register(Consulta)
class ConsultaAdmin(admin.ModelAdmin):
    list_display  = ('nombre', 'email', 'telefono', 'tipo', 'fecha', 'respondida')
    list_filter   = ('tipo', 'respondida', 'fecha')
    search_fields = ('nombre', 'email', 'mensaje')
    readonly_fields = ('nombre', 'email', 'telefono', 'tipo', 'mensaje', 'fecha')
    list_editable = ('respondida',)
    ordering      = ('-fecha',)

/**
 * formulario.js — Skeleton Shop
 * Validación en tiempo real + envío AJAX (fetch) con feedback visual.
 */

$(document).ready(function () {

    /* ─── Restricciones de validación (validate.js) ─────────────────────── */
    const restricciones = {
        nombre: {
            presence: { allowEmpty: false, message: 'es obligatorio' },
            length:   { minimum: 3, maximum: 60, message: 'debe tener entre 3 y 60 caracteres' }
        },
        telefono: {
            presence: { allowEmpty: false, message: 'es obligatorio' },
            format: {
                pattern: '^\\+?56?\\s?9?\\s?\\d[\\d\\s]{7,}$',
                message: 'debe ser un número chileno válido'
            }
        },
        email: {
            presence: { allowEmpty: false, message: 'es obligatorio' },
            email:    { message: 'no es válido' }
        },
        tipoConsulta: {
            presence: { allowEmpty: false, message: 'debe seleccionar una opción' }
        },
        mensaje: {
            presence: { allowEmpty: false, message: 'es obligatorio' },
            length:   { minimum: 10, maximum: 500, message: 'debe tener entre 10 y 500 caracteres' }
        }
    };

    /* ─── Helpers UI ─────────────────────────────────────────────────────── */
    function marcarError(campo, texto) {
        const $el = $('#' + campo);
        $el.removeClass('is-valid').addClass('is-invalid');
        $el.next('.invalid-feedback').remove();
        $el.after(`<div class="invalid-feedback">${texto}</div>`);
    }

    function marcarOk(campo) {
        const $el = $('#' + campo);
        $el.removeClass('is-invalid').addClass('is-valid');
        $el.next('.invalid-feedback').remove();
    }

    function limpiarCampo(campo) {
        $('#' + campo).removeClass('is-invalid is-valid');
        $('#' + campo).next('.invalid-feedback').remove();
    }

    function mostrarToast(tipo, mensaje) {
        const $toast = $('#toast-notif');
        $toast.removeClass('toast-ok toast-err');
        if (tipo === 'ok') {
            $toast.addClass('toast-ok');
            $('#toast-icon').text('✅');
        } else {
            $toast.addClass('toast-err');
            $('#toast-icon').text('❌');
        }
        $('#toast-msg').text(mensaje);
        $toast.fadeIn(300);
        setTimeout(() => $toast.fadeOut(400), 5000);
    }

    function setLoading(activo) {
        const $btn     = $('#btn-enviar');
        const $texto   = $('#btn-texto');
        const $spinner = $('#btn-spinner');
        if (activo) {
            $btn.prop('disabled', true);
            $texto.text('Enviando…');
            $spinner.show();
        } else {
            $btn.prop('disabled', false);
            $texto.text('Enviar consulta');
            $spinner.hide();
        }
    }

    /* ─── Validación en tiempo real (blur / change) ──────────────────────── */
    $('#nombre, #telefono, #email, #tipoConsulta, #mensaje').on('blur change', function () {
        const id = $(this).attr('id');
        const valor = { [id]: $(this).val() };
        const restriccion = { [id]: restricciones[id] };
        const errores = validate(valor, restriccion);
        if (errores) {
            marcarError(id, errores[id][0]);
        } else {
            marcarOk(id);
        }
    });

    /* ─── Contador de caracteres ─────────────────────────────────────────── */
    $('#mensaje').on('input', function () {
        const len   = $(this).val().length;
        const $cont = $('#char-counter');
        $cont.text(`${len} / 500 caracteres`);
        $cont.removeClass('warn over');
        if (len > 450) $cont.addClass('over');
        else if (len > 350) $cont.addClass('warn');
    });

    /* ─── Envío AJAX ─────────────────────────────────────────────────────── */
    $('#formulario_contacto').on('submit', function (e) {
        e.preventDefault();

        /* 1. Validar todos los campos */
        const datos = {
            nombre:       $('#nombre').val(),
            telefono:     $('#telefono').val(),
            email:        $('#email').val(),
            tipoConsulta: $('#tipoConsulta').val(),
            mensaje:      $('#mensaje').val()
        };

        const errores = validate(datos, restricciones);

        // Limpiar estado anterior
        Object.keys(datos).forEach(limpiarCampo);
        $('.invalid-feedback').remove();

        if (errores) {
            for (const campo in errores) {
                marcarError(campo, errores[campo][0]);
            }
            mostrarToast('err', 'Por favor corrige los errores antes de enviar.');
            // Scroll al primer error
            const $primerError = $('.is-invalid').first();
            if ($primerError.length) {
                $('html, body').animate({ scrollTop: $primerError.offset().top - 100 }, 400);
            }
            return;
        }

        /* 2. Marcar todo como válido visualmente */
        Object.keys(datos).forEach(marcarOk);

        /* 3. Enviar con fetch */
        setLoading(true);

        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        const formData  = new FormData(this);

        fetch(window.location.pathname, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            setLoading(false);
            if (ok && data.ok) {
                mostrarToast('ok', data.mensaje);
                /* Limpiar formulario */
                document.getElementById('formulario_contacto').reset();
                $('#nombre, #telefono, #email, #tipoConsulta, #mensaje')
                    .removeClass('is-valid is-invalid');
                $('#char-counter').text('0 / 500 caracteres').removeClass('warn over');
            } else {
                /* Errores del servidor */
                if (data.errores) {
                    for (const campo in data.errores) {
                        marcarError(campo, data.errores[campo]);
                    }
                }
                mostrarToast('err', 'Hubo un problema. Revisa los campos e intenta de nuevo.');
            }
        })
        .catch(err => {
            setLoading(false);
            mostrarToast('err', 'Error de conexión. Intenta nuevamente.');
            console.error('Error al enviar:', err);
        });
    });

});
$(document).ready(function () {

    const restricciones_formulario = {

        nombre: {
            presence: {
                allowEmpty: false,
                message: "es obligatorio"
            },
            length: {
                minimum: 3,
                maximum: 60,
                message: "debe tener entre 3 y 60 caracteres"
            }
        },

        telefono: {
            presence: {
                allowEmpty: false,
                message: "es obligatorio"
            },
            format: {
                pattern: "^\\+56\\d{9}$",
                message: "debe tener formato +56 9 1234 5678"
            }
        },

        email: {
            presence: {
                allowEmpty: false,
                message: "es obligatorio"
            },
            email: {
                message: "no es válido"
            }
        },

        tipoConsulta: {
            presence: {
                allowEmpty: false,
                message: "debe seleccionar una opción"
            }
        },

        mensaje: {
            presence: {
                allowEmpty: false,
                message: "es obligatorio"
            },
            length: {
                minimum: 10,
                maximum: 500,
                message: "debe tener entre 10 y 500 caracteres"
            }
        }
    };

    function mostrar_error(nombre_campo, errores_campo) {

        const input_campo = $("#" + nombre_campo);

        input_campo.removeClass("is-valid");
        input_campo.addClass("is-invalid");

        input_campo.next(".invalid-feedback").remove();

        input_campo.after(`
            <div class="invalid-feedback">
                ${errores_campo[0]}
            </div>
        `);
    }

    function limpiar_error(nombre_campo) {

        const input_campo = $("#" + nombre_campo);

        input_campo.removeClass("is-invalid");
        input_campo.addClass("is-valid");

        input_campo.next(".invalid-feedback").remove();
    }

    function validar_campo(nombre_campo) {

        const datos_campo = {
            [nombre_campo]: $("#" + nombre_campo).val()
        };

        const restriccion_campo = {
            [nombre_campo]: restricciones_formulario[nombre_campo]
        };

        const errores_validacion = validate(datos_campo, restriccion_campo);

        if (errores_validacion) {

            mostrar_error(
                nombre_campo,
                errores_validacion[nombre_campo]
            );

            return false;
        }

        limpiar_error(nombre_campo);

        return true;
    }

    $("#nombre, #telefono, #email, #tipoConsulta, #mensaje")
        .on("blur change", function () {

            const nombre_campo = $(this).attr("id");

            validar_campo(nombre_campo);
        });

    $("#formulario_contacto").on("submit", function (evento) {

        evento.preventDefault();

        let formulario_valido = true;

        const datos_formulario = {
            nombre: $("#nombre").val(),
            telefono: $("#telefono").val(),
            email: $("#email").val(),
            tipoConsulta: $("#tipoConsulta").val(),
            mensaje: $("#mensaje").val()
        };

        const errores_formulario = validate(
            datos_formulario,
            restricciones_formulario
        );

        $(".invalid-feedback").remove();

        $("#nombre, #telefono, #email, #tipoConsulta, #mensaje")
            .removeClass("is-invalid is-valid");

        if (errores_formulario) {

            formulario_valido = false;

            for (const nombre_campo in errores_formulario) {

                mostrar_error(
                    nombre_campo,
                    errores_formulario[nombre_campo]
                );
            }
        }
        else {

            $("#nombre, #telefono, #email, #tipoConsulta, #mensaje")
                .addClass("is-valid");
        }

        if (formulario_valido) {

            this.submit();
        }
    });
});
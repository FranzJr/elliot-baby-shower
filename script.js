$(document).ready(function () {
    const regalos = [
        "Cuna",
        "Carrito",
        // Agrega aquí las 18 opciones adicionales de regalos
    ];

    $("#ruleta").click(function () {
        const regaloSeleccionado = regalos[Math.floor(Math.random() * regalos.length)];
        $("#regaloElegido").addClass("animate").text(`Regalo elegido: ${regaloSeleccionado}`);
        $("#regalo").val(regaloSeleccionado);

        // Eliminar la animación después de que termine
        setTimeout(() => {
            $("#regaloElegido").removeClass("animate");
        }, 2000);
    });

    $("#invitacion").submit(function (event) {
        event.preventDefault();

        const nombre = $("#nombre").val();
        const acompanantes = $("#acompanantes").val();
        const regalo = $("#regalo").val();

        // Asegúrate de tener configurado el acceso a la API de Google Sheets en tu proyecto
        const url = "https://sheets.googleapis.com/v4/spreadsheets/[ID_DE_HOJA_DE_CÁLCULO]/values/A1:append?valueInputOption=USER_ENTERED&access_token=[TOKEN_DE";
        // Reemplaza [ID_DE_HOJA_DE_CÁLCULO] y [TOKEN_DE_ACCESO] con los valores correspondientes de tu proyecto

        const datos = {
            "range": "A1",
            "majorDimension": "ROWS",
            "values": [
                [nombre, acompanantes, regalo]
            ]
        };

        $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function (response) {
                alert("Asistencia confirmada y regalo seleccionado guardados");
                $("#invitacion").trigger("reset");
                $("#regaloElegido").text("");
            },
            error: function (error) {
                alert("Hubo un error al guardar la información. Por favor, inténtalo de nuevo.");
            }
        });
    });
});

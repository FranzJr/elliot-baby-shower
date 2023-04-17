$(document).ready(function () {
    const regalos = [
        "Cuna",
        "Carrito",
        "Pañales",
        "Baberos",
        "Mantas",
        "Juguetes",
        "Ropa",
        "Silla de coche",
        "Monitor de bebé",
        "Esterilizador de biberones",
        "Bañera",
        "Cambiador",
        "Chupetes",
        "Mordedores",
        "Toallas",
        "Gimnasio de actividades",
        "Extractor de leche",
        "Bolsa de pañales",
        "Cobertor",
        "Termómetro"
    ];

    let spinning = false;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $("#spin").click(function () {
        if (!spinning) {
            spinning = true;
            const spinAngle = 360 * getRandomInt(5, 10);
            const selectedGiftIndex = getRandomInt(0, regalos.length - 1);
            const angle = 360 / regalos.length;
            const rotation = spinAngle - angle * selectedGiftIndex;

            $("#roulette").css("transform", `rotate(${rotation}deg)`);

            setTimeout(() => {
                $("#regaloElegido").addClass("animate").text(`Regalo elegido: ${regalos[selectedGiftIndex]}`);
                $("#regalo").val(regalos[selectedGiftIndex]);

                // Eliminar la animación después de que termine
                setTimeout(() => {
                    $("#regaloElegido").removeClass("animate");
                }, 2000);
                spinning = false;
            }, 6000);
        }
    });

});


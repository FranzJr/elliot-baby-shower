var startAngle = 0;
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var guest;
var eventObject;

$(document).ready(function () {
    const guestCheckURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/guest/check"
    const giftCreate = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/gift/create"
    const guestUpdateURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/guest/update"
    const giftUpdateURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/gift/update"
    const eventURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/event/"

    // GET DATA FROM INVITATION

    $('.step-two').hide();
    $('.step-three').hide();

    $('#map-link').hide();
    $('#calendar-link').hide();

    // Mostrar el paso 2 cuando se haga clic en el botón "Aceptar Invitación"
    $('#aceptar-btn').on('click', function () {
        $('.step').hide();
        $('.step-two').show();
    });

    // Mostrar el paso 3 cuando se haga clic en el botón "Finalizar Registro"
    $('#next').on('click', function () {
        $('.step-two').hide();
        $('.step-three').show();
    });

    const guestId = getParameterByName('id');
    $(".load").hide();

    if (guestId) {
        $.ajax({
            url: guestCheckURL,
            method: "GET",
            data: { id: guestId },
            success: function (response) {
                console.log(response);
                if (response.success) {
                    // Handle the guest data
                    guest = response.guest;
                    console.log('Guest name:', guest.Name);
                    $('h2.lead').html(`Hola <span class="dcolor"> ${guest.Name} </span> ¡Estás invitado! al`);
                    $('h2.lead').parent().removeClass("is-loading");

                    $('#_id').val(guest._id);
                    $('#name').val(guest.Name);
                    $('#phone').val(guest.Phone);
                    $('#moreGuest').val(guest.MoreGuest);
                    $('#giftsSelect').val(guest.GiftId);
                    $('#email').val(guest.Email);

                    const eventId = guest.EventId;
                    const fullURL = eventURL + eventId;

                    $.ajax({
                        url: fullURL,
                        method: "GET",
                        success: function (response) {
                            if (response.success) {
                                const eventData = response.event;
                                eventObject = eventData;

                                console.log(eventData);

                                $('p.place').html(`${eventData.Place} `);
                                $('p.date').html(`${eventData.Date} ${eventData.Time} `);

                                // Limpia la lista de actividades
                                $('ul.activities').empty();

                                // Itera sobre el array de actividades y crea un elemento <li> para cada actividad
                                eventData.Activities.forEach(activity => {
                                    const listItem = $('<li>').text(activity.trim());
                                    $('ul.activities').append(listItem);
                                });

                                $('.step-one').removeClass("is-loading");

                            } else {
                                console.error("Error al obtener el evento:", response.message);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error("Error al realizar la solicitud:", textStatus, errorThrown);
                        }
                    });


                } else {
                    console.log('Error:', response.message);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $('h2.lead').html(`Hola ¿Estás invitado? al <span>'Pregunta por tu enlace de invitación <a href="https://wa.me/573138930620">aquí</span>`);
                $('h2.lead').parent().removeClass("is-loading");
                console.log('Request failed:', textStatus, errorThrown);
            }
        });
    } else {
        $('h2.lead').html(`Hola ¿Estás invitado? <span>Pregunta por tu enlace de invitación <a href="https://wa.me/573138930620">aquí</span>`);
        $('h2.lead').parent().removeClass("is-loading");
        console.log('No guest ID found in URL');
    }



    $('form').on('submit', function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe de la forma predeterminada

        guest.Phone = $('#phone').val();
        guest.Email = $('#email').val();
        guest.MoreGuest = $('#moreGuest').val();
        guest.Assist = "TRUE";
        guest.GiftId = $('#giftsSelect').val();

        $.ajax({
            url: guestUpdateURL,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(guest),
            success: function (response) {
                if (response.success) {
                    $('#map-link').show().find('a').attr('href', eventObject.maps);
                    $('#calendar-link').show().find('a').attr('href', eventObject.calendar);
                    $('h2.lead').html(`<span class="dcolor"> ${guest.Name} </span> te esperamos`);
                    $('.elliot-img').hide();
                    $('#aceptar-btn').hide();
                    $('.step').show();
                    $('.step-two').hide();
                    $('.step-three').hide();
                } else {
                    console.error("Error al actualizar el invitado:", response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al realizar la solicitud:", textStatus, errorThrown);
            }
        });
    });


    $('#reportModal').on('shown.bs.modal', function () {
        getGifts();
    });
});

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


function getGifts() {
    let totalAssistance = 0;
    let notAccepted = 0;
    const giftCounts = {};
    fetch("https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/guests-with-gifts")
        .then(response => response.json())
        .then(data => {
            // Procesar la respuesta y obtener la información necesaria
            const guests = data.guestsWithGifts;

            guests.forEach(guest => {
                if (guest.Assist === "TRUE") {
                    const moreGuests = parseInt(guest.MoreGuest);
                    totalAssistance += isNaN(moreGuests) ? 1 : moreGuests + 1;
                } else if (guest.Assist === "") {
                    notAccepted += 1;
                }

                if (guest.giftName) {
                    if (giftCounts[guest.giftName]) {
                        giftCounts[guest.giftName] += 1;
                    } else {
                        giftCounts[guest.giftName] = 1;
                    }
                }
            });

            console.log("Total assistance:", totalAssistance);
            console.log("Not accepted:", notAccepted);
            console.log("Gift counts:", giftCounts);

            let htmlString = "<table class='table'><thead><tr><th>Regalo</th><th>Cantidad</th></tr></thead><tbody>";
            $.each(giftCounts, function (giftName, count) {
                htmlString += "<tr><td>" + giftName + "</td><td>" + count + "</td></tr>";
            });
            htmlString += "</tbody></table>";

            // Insertar el string HTML en el elemento HTML deseado
            $(".modal-body").html(htmlString);

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

}
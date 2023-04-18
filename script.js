var startAngle = 0;
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var guest;

$(document).ready(function () {
    const guestCheckURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/guest/check"
    const giftCreate = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/gift/create"
    const guestUpdateURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/guest/update"
    const giftUpdateURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/gift/update"
    const eventURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/event/"

    // GET DATA FROM INVITATION

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
                                console.log(eventData);

                                $('p.place').html(`${eventData.Place} `);
                                $('p.date').html(`${eventData.Date} ${eventData.Time} `);
                                $('p.activities').html(`${eventData.Date} `);
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
                $('h2.lead').text(`Hola ¿Estás invitado? al`);
                $('h2.lead').parent().removeClass("is-loading");
                console.log('Request failed:', textStatus, errorThrown);
            }
        });
    } else {
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
                    alert('Invitado actualizado correctamente');
                } else {
                    console.error("Error al actualizar el invitado:", response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al realizar la solicitud:", textStatus, errorThrown);
            }
        });
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
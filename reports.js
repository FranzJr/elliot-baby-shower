let totalAssistance = 0;
let notAccepted = 0;
const giftCounts = {};

// Realizar una solicitud GET al endpoint
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



        const assistanceCtx = document.getElementById("assistanceChart").getContext("2d");
        const assistanceChart = new Chart(assistanceCtx, {
            type: "pie",
            data: {
                labels: ["Asistencia confirmada", "Pendientes por confirmar"],
                datasets: [
                    {
                        data: [totalAssistance, notAccepted],
                        backgroundColor: ["#4caf50", "#f44336"],
                    },
                ],
            },
        });

        // Gráfico de regalos
        const giftLabels = Object.keys(giftCounts);
        const giftData = giftLabels.map(label => giftCounts[label]);

        const giftsCtx = document.getElementById("giftsChart").getContext("2d");
        const giftsChart = new Chart(giftsCtx, {
            type: "bar",
            data: {
                labels: giftLabels,
                datasets: [
                    {
                        label: "Cantidad de personas que seleccionaron el regalo",
                        data: giftData,
                        backgroundColor: "#3f51b5",
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                },
                indexAxis: "y",
            },
        });


    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

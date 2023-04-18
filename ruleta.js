const giftListURL = "https://70wibv14m7.execute-api.us-east-1.amazonaws.com/dev/babyshower/gift/list"


var options;
var arc;

var startAngle = 0;
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var giftsTimeout;


$.get(giftListURL, function (response) {
    if (response.success) {
        const gifts = response.gifts.filter(gift => gift.status === 1);
        console.log(gifts);
        options = gifts;
        arc = Math.PI / (options.length / 2);

        const windowWidth = $(window).width();

        if (windowWidth < 500) {
            $('#canvas').hide();
            $('#giftsList').show();

            $.each(options, function (index, gift) {
                $('#giftsList').append('<li id="' + gift._id + '">' + gift.Name + '</li>');
            });

            $('#spin').on('click', startRandomGifts);

        } else {
            drawRouletteWheel();
        }

        const $giftsSelect = $('#giftsSelect');
        $giftsSelect.empty();
        for (const gift of gifts) {
            $giftsSelect.append($('<option></option>').val(gift._id).text(gift.Name));
        }
    } else {
        console.error("Error al obtener la lista de regalos:", response.message);
    }
}).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("Error al realizar la solicitud:", textStatus, errorThrown);
});

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI * 2 / maxitem;

    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for (var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            //ctx.fillStyle = colors[i];
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i].Name;
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    var text = options[index].Name
    const windowWidth = $(window).width();

    if (windowWidth >= 500) {
        const $giftsSelect = $('#giftsSelect');
        $giftsSelect.val(options[index]._id);
    }
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}


function startRandomGifts() {
    giftsTimeout = setInterval(randomGifts, 100);
}

function stopRandomGifts() {
    clearTimeout(giftsTimeout);
}

function randomGifts() {
    const $giftsList = $('#giftsList');
    if ($giftsList.children().length > 1) {
        const randomIndex = Math.floor(Math.random() * $giftsList.children().length);
        $giftsList.children().eq(randomIndex).remove();
    } else {
        stopRandomGifts();
        const $giftsSelect = $('#giftsSelect');
        const firstChildId = $giftsList.children().first().attr('id');
        $giftsSelect.val(firstChildId);
    }
}
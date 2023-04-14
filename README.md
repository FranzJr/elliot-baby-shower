# elliot-baby-shower
Invitación Baby Shower Elliot: Web para confirmar asistencia, elegir regalos y almacenar información en Google Sheets - Elliot's Baby Shower Invite: Webpage for RSVP, gift selection, and storing info in Google Sheets - エリオットのベビーシャワー招待: 参加確認・ギフト選択のウェブ、情報はGoogleシートに保存 - 艾略特宝宝派对邀请：确认出席、选择礼物的网页，信息存储在Google表格

# Invitación al Baby Shower de Elliot

Este repositorio contiene el código fuente de una página web de invitación al baby shower de Elliot. La página permite a los invitados confirmar su asistencia, elegir un regalo de una lista predefinida y guardar la información en una hoja de cálculo de Google Sheets.

## Características

- Formulario para confirmar la asistencia
- Ruleta para elegir un regalo
- Almacenamiento de información en Google Sheets

## Instalación

1. Clona este repositorio
2. Configura la [API de Google Sheets](https://developers.google.com/sheets/api/guides/concepts) y obtén un token de acceso
3. Reemplaza `[ID_DE_HOJA_DE_CÁLCULO]` y `[TOKEN_DE_ACCESO]` en el archivo `script.js` con los valores correspondientes de tu proyecto
4. Personaliza la información del evento en el archivo `index.html` (dirección, fecha, hora, actividades)
5. Agrega las opciones de regalos restantes en el array `regalos` del archivo `script.js`
6. Sube los archivos a tu servicio de alojamiento web

## Licencia

[MIT License](LICENSE)

/*
To receive a client id, you have to register an app at https://dev.twitch.tv/console/apps/create
For further instructions take a look at the official Twitch guide: https://dev.twitch.tv/docs/v5
 */
CLIENT_ID="";
TOKEN=""; // With your client id you can generate one with https://github.com/serdrad0x/Twitch-API-Request-Tool
CHANNEL=""; // Name of your channel
CHANNEL_ID=""; // ID of your channel, you can request it with https://github.com/serdrad0x/Twitch-API-Request-Tool

MAX_HEIGHT=65; // Height of the element which contains the text
SQUARE_AMOUNT=19; // Amount of squares which are used for the transition
SQUARE_SPEED=8; // How fast each square appears. Total time = square_amount * square_amount * square_speed

/*
If you want to change the background or the position of the image you have to adjust the offset, because the position
is absolute
 */
BACKGROUND_OFFSET_X = 12;
BACKGROUND_OFFSET_Y = 14;
IMAGE_OFFSET_X = 20;
IMAGE_OFFSET_Y = 25;

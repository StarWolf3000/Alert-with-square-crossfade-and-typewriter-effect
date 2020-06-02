# Alert with square crossfade and typewriter effect

This is an alert which can actually be used for Twitch and with some changes for other platforms too. It will trigger
whenever there is one of the following events:

- Host
- Follow
- Raid

# Getting Started

Clone the repository and change the config.js to fit your needs. You have to set the following variables:

| Variable            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| CLIENT_ID           | To receive a client id, you have to register an app at https://dev.twitch.tv/console/apps/create <br> For further instructions take a look at the official Twitch guide: https://dev.twitch.tv/docs/v5                  |
| TOKEN               | You can use your client id to generate a token with https://github.com/serdrad0x/Twitch-API-Request-Tool |
| CHANNEL             | Name of your channel                          |
| CHANNEL_ID          | ID of your channel, you can request it with https://github.com/serdrad0x/Twitch-API-Request-Tool

Any other changes like a new image or order of elements may need additional changes in the according files!

Add the alert.html as new browser source in your streaming software, and you are good to go.

# Additionally used

There are no other dependencies, just good old plain Javascript but it uses cool stuff like asynchronous functions and 
promises! 

# Square crossfade animation
A defined amount of squares shows up randomly on an element until it is covered. The squares can have a color, or an image
as background. The size of the squares is determined by the size of the element to cover, and the amount of squares to
show up.<br>
It is also possible to set the speed of the appearing squares.

# Typewriter effect
The typewriter effect shows the well-known cursor | next to newly written text. The cursor won't show any blinking animation
while writing and starts blinking, after the text is completely written. Same for removing text from an element.

The typewriter effect works across multiple lines.
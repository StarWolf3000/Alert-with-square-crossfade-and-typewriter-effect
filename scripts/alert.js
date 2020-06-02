/**
 * resizeText changes the font-size of a given element to contain the text within.
 *
 * @param {Object} element Element which contains the text.
 * @param {string} text Text which should fit in the element.
 * @param {number} maxHeight Allowed maximum height of the element with the text
 */
function resizeText(element, text, maxHeight){
    let copy = element.cloneNode(true); // We need a copy of the element, which will contain the text to determine the font-size
    copy.style.visibility = "hidden";
    copy.innerText = text;
    element.append(copy); // You can't check the scrollHeight without adding the copy to the DOM

    /*
    The element can't have a height, otherwise it will not change the scrollHeight and we won't be able to determine the
    font-size.
    Therefore we have to add a maxHeight, which is equal to the height, the element should have.
     */
    while(copy.scrollHeight < maxHeight){
        copy.style.fontSize = parseInt(copy.style.fontSize, 10) + 1 + "px";
    }

    while(copy.scrollHeight > maxHeight){
        copy.style.fontSize = parseInt(copy.style.fontSize, 10) - 1 + "px";
    }
    // The order of while scrollHeight < maxHeight / scrollHeight > maxHeight results in a font-size, which will fit

    element.style.fontSize = copy.style.fontSize;

    copy.remove();
}

/**
 * It can show and also hide a already created transition with this function. Squares will show up randomly until the
 * complete element is filled.
 *
 * @param {Object} element Element which contains the transition
 * @param {number} amount Number of squares which should be created
 * @param {number} speed How fast the squares show up
 * @param {Object} overlay It's either a color -> {"color": "rgb(172,174,173)"} or an image -> {"image": "path-to-image"}
 * @param {number} x Position on the x-axes
 * @param {number} y Position on the y-axes
 * @returns {Promise<void>}
 */
async function transition(element, amount, speed, overlay, x, y) {
    // Transition already happened ones, no need to generate new divs just use the available ones.
    if(element.classList.contains("transition")){
        /*
        We need a random element from the children array and we can't just take a random element, because the element
        shouldn't be taken twice. Also we can't remove any childNodes, therefore a id array is generated where a random
        id is taken from and removed afterwards.
         */
        let id = [];
        for (let i = 0; i < (amount*amount); i++){
            id.push(i);
        }

        let children = element.childNodes;
        let randomId;
        for (let j = id.length - 1; j >= 0; j--){
            randomId = id.splice(Math.floor(Math.random() * id.length), 1)[0]; // Take random id and remove it

            if("color" in overlay) { // Check if it is a color object
                children[randomId].style.backgroundImage = "";
                children[randomId].style.backgroundColor = overlay["color"];
            } else if("image" in overlay){ // Check if it is a image object
                children[randomId].style.backgroundImage = "url('"+overlay["image"]+"')";
                children[randomId].style.backgroundColor = "rgba(0,0,0,0)";
            } else {
                throw "Error";
            }

            await delay(speed);
        }
    } else { // Transition for the first time for element
        element.classList.add("transition");

        let width = parseInt(element.style.width, 10); // element.style.width is a string e.g. 42px and parseInt generates 42 as a number.
        let height = parseInt(element.style.height, 10);

        // Same amount of squares with different width and height
        let squareWidth = width / amount;
        let squareHeight = height / amount;

        let squares = [];

        for(let i = 0; i < amount; i++) {
            for (let j = 0; j < amount; j++) {
                let square = document.createElement("div");
                square.style.position = "fixed";
                square.style.width = squareWidth + "px";
                square.style.height = squareHeight + "px";
                square.style.left = x+(j * squareWidth) + "px";
                square.style.top = y+(i * squareHeight) + "px";
                if("color" in overlay){
                    square.style.backgroundColor = overlay["color"];
                } else if("image" in overlay) {
                    square.style.backgroundSize = width + "px" + " " + height + "px";
                    square.style.backgroundImage = "url('"+overlay["image"]+"')";
                    square.style.backgroundRepeat = "no-repeat";
                    // Every square has the same backgroundImage which has to have a different position for each square.
                    // So all squares contain a different part of the image.
                    square.style.backgroundPositionX = -(j * squareWidth) + "px";
                    square.style.backgroundPositionY = -(i * squareHeight) + "px";
                    square.style.visibility = "visible";
                } else {
                    throw "Error";
                }

                squares.push(square);
            }
        }

        for(let k = squares.length - 1; k >= 0; k--){
            element.append(squares.splice(Math.floor(Math.random() * squares.length), 1)[0]);
            await delay(speed);
        }
    }
}

/*
The element for redraw() will be changed by 1px but it can either be a positive or negative value. This has to be saved
in a global variable to avoid changing the size of the element over time.
 */
let one = 1;

/**
 * For example XSplit has a problem to show text which is added step by step to an element, therefore the element has to
 * be redrawn to solve this issue.
 *
 * @param {Object} element Element which should be redrawn
 */
function redraw(element){
    element.style.width = parseInt(element.style.width, 10) + one + "px";
    one *= -1;
}

/**
 * Removes an existing text from an element and adds a new text with a typewriter effect.
 *
 * @param {Object} element Element which contains the text
 * @param {string} newText Text that should be added to the element
 * @param {number} speed How fast should the text appear
 * @param {boolean} blinking Should the cursor blink or not
 * @returns {Promise<void>}
 */
async function writer(element, newText, speed, blinking){
    let oldText = element.innerText;

    /*
    If the cursor is already there, it is blinking and the blinking animation has to be removed.
    The cursor is only blinking when no text is written.
     */
    if(element.nextSibling !== null && element.nextSibling.innerText === "|"){
        if(element.nextSibling.classList.contains("blinking-cursor")){
            element.nextSibling.classList.remove("blinking-cursor");
        }
    } else {
        element.insertAdjacentHTML('afterend', '<span class="cursor">|</span>');
    }

    let alert = document.getElementById("alert"); // Needed for XSplit fix

    for (let i = 0; i < oldText.length; i++) {
        element.innerText = element.innerText.substr(0, element.innerText.length - 1);
        redraw(alert); // Needed for XSplit fix
        await delay(speed);
    }

    for (let i = 0; i <= newText.length; i++) {
        element.innerText = newText.substr(0, i); // It seems like element.innterText = newText[i] is eating some of the characters.
        redraw(alert); // Needed for XSplit fix
        await delay(speed);
    }

    if(blinking){
        if(!element.nextSibling.classList.contains("blinking-cursor")){
            element.nextSibling.classList.add("blinking-cursor");
        }
    } else {
        element.nextSibling.remove();
    }
}

let alertQueue = []; // Contains all the alerts

/**
 * Delays the further execution by a given ms time.
 *
 * @param {number} ms How long in milliseconds should be waited
 * @returns {Promise<number>}
 */
async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a "thank you" message for the alert.
 *
 * @param {string} type Is it a Host, Follow or Raid
 * @param {string} user Name of the user who triggered the alert
 * @returns {string} Message which is shown in the alert
 */
function genMessage(type, user){
    let firstHalf = [
        "Vielen Dank für den " + type,
        "Dankeschön für den " + type,
        "Das ist aber ein toller " + type,
        "Waren das schon alle " + type,
        "Nur ein " + type,
        "Besten Dank für den " + type,
        "Es ist Zeit für ein DuDuDu-" + type,
        "Pakt die Fischbrötchen aus wir haben einen " + type,
        "Die Lotl freuen sich über den " + type
    ]

    let secondHalf = [
        "aber da geht doch noch mehr " + user + "!",
        "kaufen kann ich mir davon aber nichts " + user + "!",
        "wenn doch nur alle "+ type + "s so toll wären wie die von " + user + ".",
        "mehr darf man von "+ user +" aber wohl nicht erwarten.",
        "da arbeiten wir aber nochmal dran " + user + "...",
        "schämst du dich nicht " + user + "?",
        "und wenn "+ user +" das kann, können die andern das sicher schon lange!"
    ]

    // Get a random element of the firstHalf and secondHalf and combine them to a message
    let message = firstHalf[Math.floor(Math.random() * firstHalf.length)] + ", " + secondHalf[Math.floor(Math.random() * secondHalf.length)];

    // Set font-size of the text containing element to avoid a text which is to big
    resizeText(document.getElementById("alert"), message, MAX_HEIGHT);

    return message;
}

/**
 * Checks for new events (alertQueue) and plays the transition.
 *
 * @returns {Promise<void>}
 */
async function event(){
    let working = true; // Event has an endless while loop
    let active = false; // False if no alert in alertQueue
    let oldText = ""; // Set the text back to which it was before the alert
    let follows = []; // Array of people who already followed to determine new followers
    let promises, // For the first execution play background-color transition and alert type at the same time. If multiple alerts follow, only the alert type may be changed.
        oldAlertType, // To check whether or not a new alert occurred
        controller, // Abort fetch if needed
        signal, // Signal from the controller
        requestSuccess; // Was fetch successful

    // Get these elements here to avoid requesting them over and over again in the loop
    let topDiv = document.getElementById("top");
    let textDiv = document.getElementById("text");
    let imageDiv = document.getElementById("image");
    let alertTextSpan = document.getElementById("alert-text");

    while (working) {
        oldAlertType = "";
        requestSuccess = false;
        controller = new AbortController();
        signal = controller.signal;

        while (alertQueue.length > 0){
            promises = [];
            if(!active){ // If there are multiple alerts in the queue, keep the background-color
                promises.push(transition(topDiv, SQUARE_AMOUNT, SQUARE_SPEED, {"color": "rgb(172,174,173)"}, BACKGROUND_OFFSET_X, BACKGROUND_OFFSET_Y));
                oldText = textDiv.innerText;
                active = true;
            }
            let alert = alertQueue.shift();

            // If there are multiple alerts of the same kind don't change the alert type and keep it
            if(oldAlertType !== alert["type"]){
                oldAlertType = alert["type"];
                promises.push(writer(textDiv, alert["type"], 150, false));
            }
            await Promise.all(promises);

            // Shows image of the user and the thank you message
            await Promise.all([
                transition(imageDiv, SQUARE_AMOUNT, SQUARE_SPEED, {"image": alert["image"]}, IMAGE_OFFSET_X, IMAGE_OFFSET_Y),
                writer(alertTextSpan, genMessage(alert["type"], alert["name"]), 50, true)
            ]);

            await delay(4000); // Otherwise image and text vanish

            // Remove image and message
            await Promise.all([
                transition(imageDiv, SQUARE_AMOUNT, SQUARE_SPEED, {"color": "rgba(0,0,0,0)"}, IMAGE_OFFSET_X, IMAGE_OFFSET_Y),
                writer(alertTextSpan, "", 50, false)
            ]);

            if(alertQueue.length === 0){
                // Remove background and alert
                await Promise.all([
                    transition(topDiv, SQUARE_AMOUNT, SQUARE_SPEED, {"color": "rgba(0,0,0,0)"}, BACKGROUND_OFFSET_X, BACKGROUND_OFFSET_Y),
                    writer(textDiv, oldText, 150, false)
                ]);
            }
        }
        active = false;

        // Check for new follower
        fetch('https://api.twitch.tv/kraken/channels/' + CHANNEL_ID + '/follows', {
            headers: {
                'client-id': CLIENT_ID,
                'accept': 'application/vnd.twitchtv.v5+json'
            },
            signal: signal
        })
            .then(resp => { return resp.json() })
            .then(resp => {
                if(follows.length !== 0){
                    for (let i = 0; i < resp['follows'].length; i++){
                        if(!(follows.includes(resp['follows'][i]["user"]["name"]))){ // key in list --> checks key | array.includes --> checks value
                            follows.push(resp['follows'][i]["user"]["name"]);
                            // Add to event queue!
                            addAlert("Follow", resp['follows'][i]["user"]["display_name"], resp['follows'][i]["user"]["name"])
                                .catch(err => { console.log("Add Follow Alert: " + err) });
                        }
                    }
                    requestSuccess = true;
                } else {
                    for (let i = 0; i < resp['follows'].length; i++) {
                        follows.push(resp['follows'][i]["user"]["name"]); // Initialize the array
                    }
                }

            });

        await delay(5000); // Check for new alerts in queue every x ms

        if(!requestSuccess){
            controller.abort(); // If fetch wasn't successful the request is aborted.
        }
    }
}

/**
 * Add a new alert to the alertQueue
 *
 * @param {string} type Whether it is Host/Follow/Raid
 * @param {string} display_name Name which is displayed in Twitch
 * @param {string} name
 * @returns {Promise<void>}
 */
async function addAlert(type, display_name, name){
    const controller = new AbortController();
    const signal = controller.signal;

    let image = "";
    // Users Endpoint needs OAuth Token
    fetch('https://api.twitch.tv/helix/users?login='+name, {
        headers: {
            'client-id': CLIENT_ID,
            'accept': 'application/vnd.twitchtv.v5+json',
            'authorization': "Bearer " + TOKEN
        },
        signal: signal // Signal of the AbortController
    })
        .then(resp => { return resp.json() })
        .then(resp => {
            image = resp["data"][0]["profile_image_url"];
        })
        .catch(err => { console.log("Profile Image Request: " + err) });

    await delay(3000)

    if(image === ""){
        controller.abort(); // Abort fetch if image can't be received within delay()
        image = "/img/default-user-image.png";
    }

    alertQueue.push({
        "type": type,
        "name": display_name,
        "image": image
    })
}

const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443"); // Websocket of Twitch-Chat

/**
 * Event which occurs when the socket is opened.
 *
 * @param {Event} e
 */
socket.onopen = function(e) {
    socket.send("CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands"); // Request Membership/Tags/Commands capacity
    socket.send("PASS oauth:" + TOKEN); // You can generate a token with https://github.com/serdrad0x/Twitch-API-Request-Tool
    socket.send("NICK " + CHANNEL); // Nickname will be the Nick associated with the OAuth Token
    socket.send("JOIN #" + CHANNEL); // Join a chatroom
}

/**
 * Event which occurs when the socket receives a message. It will handle PING requests and add Host/Raid-Alerts to the
 * alertQueue.
 *
 * @param {MessageEvent} e
 */
socket.onmessage = function (e) {
    // You have to answer a PING from Twitch with a PONG
    if (e.data.match(/PING\s:tmi\.twitch\.tv/)){
        socket.send("PONG :tmi.twitch.tv");
    }

    // Filter messages for :jtv!jtv@jtv.tmi.twitch.tv PRIVMSG name-of-the-channel :name-of-the-hoster is now hosting you.↵
    let host = e.data.match(/^:jtv!jtv@jtv\.tmi\.twitch\.tv\sPRIVMSG\s([A-Za-z0-9-_]+)\s:([A-Za-z0-9-_]+)\sis\snow\shosting\syou\./im);

    /*
    The only way to get a Host just in time without autohost is to listen to the "...is now hosting you" message from jtv
    which shows up in chat.
    The Kraken API -> https://api.twitch.tv/kraken/channels/<id>/hosts and the Helix API -> http://tmi.twitch.tv/hosts?include_logins=1&target=<id>
    will both show also autohost and you can't determine if it is one or not. Also it may take some time for the API to
    update. So this is the fastest (but not securest) way. If there are any problems with the chat, you won't receive
    alerts of follows.
     */
    if (host !== null){
        /*
        Dangerous, because we use the display_name also as name parameter. This could lead into problems, if someone
        with logograms in their name hosts.
         */
        addAlert("Host", host[2], host[2])
            .catch(err => { console.log("Add Host Alert: " + err) });
    } else {
        // Filter messages for :tmi.twitch.tv USERNOTICE #name-of-the-channel
        let raid = e.data.match(/^(.*)\s:tmi\.twitch\.tv\sUSERNOTICE\s#([A-Za-z0-9-_]+)$/im);

        if(raid !== null) {
            let badgeInfo = raid[1].split(";");
            let badgeUser = {};

            for (let i = 0; i < badgeInfo.length; i++) {
                let badgeElement = badgeInfo[i].split("=");
                badgeUser[badgeElement[0]] = badgeElement[1];
            }

            if ("msg-id" in badgeUser) {
                if (badgeUser["msg-id"] === "raid") {
                    // No need to request the user image, so we won't use the addAlert() function
                    alertQueue.push({
                        "type": "Raid",
                        "name": badgeUser["display-name"],
                        "image": badgeUser["msg-param-profileImageURL"],
                        "viewer": badgeUser["msg-param-viewerCount"]
                    })
                }
            }
        }
    }
}

/**
 * Event which occurs when the socket is closed
 *
 * @param {CloseEvent} e
 */
socket.onclose = function (e) {
    if (e.wasClean) {
        console.log("Closed");
    } else {
        console.log("Connection died");
    }
}

/**
 * Event which occurs when there is an error
 *
 * @param {Event} e
 */
socket.onerror = function (e) {
    console.log("Error on Socket");
}

// Execute the event handler
event()
    .catch(err => { console.log("Event: " + err) });

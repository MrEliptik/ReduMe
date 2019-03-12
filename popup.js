const input = document.getElementById('url-field');

document.addEventListener('paste', (e) => {
    readClipboard(e);
});


function readClipboard(e){
    // Read clipboard content
    long_url = e.clipboardData.getData('text/plain');

    if(isURL(long_url)){
        // Ask for shorter URL
        short_url = shortenURL(long_url);

        // Copy result to clipboard
        copyToClipboard(short_url)

        // Display short url in input
        input.value = short_url

        // Checkmark
        document.querySelector('.circle-loader').classList.toggle('load-complete');
        document.querySelector('.checkmark').style.display = 'block';
        input.style.border = '1px solid #8ecc5b';
        document.getElementById('text').textContent = "Short URL copied to clipboard!"
        //text.textContent = "Short URL successfully copied to clipboard !"
    }
}

function shortenURL(longURL) {
    console.log("URL shortened")

    const domain = "http://redu.me";

    var seed = (new Date).getTime() * Math.random();

    /* Create hash and short url */
    shortMURMUR = (Math.abs(murmurhash2_32_gc(longURL, seed))).toString();
    shortURL_MURMUR = domain + "/" + shortMURMUR;

    /* SEND TO SERVER */
    /* Create JSON */
    short_url_json = JSON.stringify({ "longURL": longURL, "shortURL": shortMURMUR, "date": "" });
    sendURL(short_url_json);

    return shortURL_MURMUR
}

function copyToClipboard(what) {
    /* Little trick to copy an element to the client clipboard
    Create a dummy element in wich will put what we want to Copy
    We select it and execute the commande 'copy'
    Then we remove the dummy element */
    var dummy = document.createElement('input');
    dummy.setAttribute('value', what);
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy)
}

function sendURL(urls_JSON) {
    const req_domain = "http://redu.me";

    /* Create and send request */
    request = new XMLHttpRequest();
    request.open("POST", req_domain + "/addURL", true);
    request.setRequestHeader("cache-control", "no-cache");
    request.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    request.send(urls_JSON);
}

function isURL(string) {
    var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
    var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
    var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

    if (typeof string !== 'string') {
        return false;
    }

    var match = string.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }

    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }

    if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
        return true;
    }

    return false;
}

function murmurhash2_32_gc(str, seed) {
    var
        l = str.length,
        h = seed ^ l,
        i = 0,
        k;

    while (l >= 4) {
        k =
            ((str.charCodeAt(i) & 0xff)) |
            ((str.charCodeAt(++i) & 0xff) << 8) |
            ((str.charCodeAt(++i) & 0xff) << 16) |
            ((str.charCodeAt(++i) & 0xff) << 24);

        k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        k ^= k >>> 24;
        k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

        l -= 4;
        ++i;
    }

    switch (l) {
        case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
        case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
        case 1: h ^= (str.charCodeAt(i) & 0xff);
            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    }

    h ^= h >>> 13;
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h ^= h >>> 15;

    return h >>> 0;
}



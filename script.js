const ipInput = document.getElementById('ip');
const addressIp = document.getElementById('addressIp');
const classIp = document.getElementById('classIp');
const mask = document.getElementById('mask');
const test = document.getElementById('test');
const networkAddress = document.getElementById('networkAddress');
const error = document.getElementById('error');


ipInput.addEventListener('change', countIp)


function countIp() {
    const ip = ipInput.value;
    let piecesOfIp = ip.split(".");


    /*WALIDACJA */
    if (piecesOfIp.length != 4) {
        error.innerHTML = "Error: Zły format adresu, operacja przerwana, użyj kropki do oddzielenia oktetów";
        return;
    } else {
        for (let i = 0; i < piecesOfIp.length; i++) {
            piecesOfIp[i] = parseInt(piecesOfIp[i]);

            if (piecesOfIp[i] > 255 || piecesOfIp[i] < 0) {
                error.innerHTML = "Error:   Przekroczona wartość";
                return;
            }
        }
        error.innerHTML = "";
    }


    test.innerHTML = ip;

    /*ADRES */
    showAddressIp(ip);

    /*KLASA */
    countClassIp(piecesOfIp[0]);

    /*MASK*/
    let maskTab = countMask(piecesOfIp[0]);
    mask.innerHTML = "Maska: " + maskTab.join('.');

    /*Adres sieci */

    countNetworkAddress(piecesOfIp, maskTab);

}


function showAddressIp(ip) {
    addressIp.innerHTML = "Adres Ip: " + ip;

}

function countClassIp(firstOctet) {
    if (firstOctet >= 0 && firstOctet < 128) {
        classIp.innerHTML = "Klasa: A";
    } else if (firstOctet > 127 && firstOctet < 192) {
        classIp.innerHTML = "Klasa: B";
    } else if (firstOctet > 191 && firstOctet < 224) {
        classIp.innerHTML = "Klasa: C";
    } else if (firstOctet > 223 && firstOctet < 240) {
        classIp.innerHTML = "Klasa: D";
    } else if (firstOctet > 239 && firstOctet < 256) {
        classIp.innerHTML = "Klasa: E";
    } else {
        classIp.innerHTML = "Klasa: Nieznana";
    }
}

function countMask(firstOctet) {
    let maskTab = [];
    if (firstOctet >= 0 && firstOctet < 128) {
        maskTab = [255, 0, 0, 0];
        return maskTab;
    } else if (firstOctet > 127 && firstOctet < 192) {
        maskTab = [255, 255, 0, 0];
        return maskTab;
    } else if (firstOctet > 191 && firstOctet < 224) {
        maskTab = [255, 255, 255, 0];
        return maskTab;
    } else {
        maskTab = ['Nieznana'];
        return maskTab;
    }

}

function countNetworkAddress(piecesOfIp, maskTab) {

    //for (let i = 0; i < 4; i++) {
    let i = 0; //testowo
    piecesOfIp[i] = piecesOfIp[i].toString(2)
    maskTab[i] = maskTab[i].toString(2);
    let nAddress = [];

    while (piecesOfIp[i].length < 8) {
        piecesOfIp[i] = "0" + piecesOfIp[0];
    }

    while (piecesOfIp[0].length < 8) {
        maskTab[i] = "0" + maskTab[0];
    }

    /*OPERACJA NOT */
    for (let j = 0; j < 8; j++) {
        if ((piecesOfIp[i].charAt(j)) == 1 && (maskTab[i].charAt(j) == 1)) {
            nAddress += "1";

        } else {
            nAddress += "0"
        }
    }
    console.log(nAddress);
    console.log(piecesOfIp[0]);
    console.log(maskTab[0]);

    // }

}
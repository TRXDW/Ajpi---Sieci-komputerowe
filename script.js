const ipInput = document.getElementById('ip');
const addressIp = document.getElementById('addressIp');
const classIp = document.getElementById('classIp');
const mask = document.getElementById('mask');
const test = document.getElementById('test');
const error = document.getElementById('error');


ipInput.addEventListener('change', countIp)


function countIp() {
    const ip = ipInput.value;
    test.innerHTML = ip;
    const piecesOfIp = ip.split(".");

    /*WALIDACJA */
    if (piecesOfIp.length != 4) {
        error.innerHTML = "Error: Zły adres, operacja przerwana";
        return;
    } else {
        for (let i = 0; i < piecesOfIp.length; i++) {
            if (piecesOfIp[i] > 255 || piecesOfIp[i] < 0) {
                error.innerHTML = "Error:   Przekroczona wartość";
                return;
            }
        }
        error.innerHTML = "";
    }

    /*ADRES */
    showAddressIp(ip);

    /*KLASA */
    countClassIp(piecesOfIp[0]);

    /*MASK*/
    let maskTab = countMask(piecesOfIp[0]);
    mask.innerHTML = "Maska: " + maskTab.join('.');

    /*Adres sieci */
    // let war = 255;
    // console.log(war.toString(2));
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
    console.log(piecesOfIp[0].toString(2));
    console.log(maskTab[0].toString(2));
    console.log(piecesOfIp);
    console.log(maskTab);

}
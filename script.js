const test = document.getElementById('test');
const ipInput = document.getElementById('ip');
const addressIp = document.getElementById('addressIp');
const classIp = document.getElementById('classIp');
const mask = document.getElementById('mask');
const broadcast = document.getElementById('broadcastAddress');
const networkAddress = document.getElementById('networkAddress');
const error = document.getElementById('error');


ipInput.addEventListener('change', countIp)


function countIp() {
    const ip = ipInput.value;
    let piecesOfIp = ip.split(".");


    /*WALIDACJA */
    if (piecesOfIp.length != 4) {
        return errors("Zły format adresu, operacja przerwana, użyj kropki do oddzielenia oktetów");
    } else if (false) {

    } else {
        for (let i = 0; i < piecesOfIp.length; i++) {
            piecesOfIp[i] = parseInt(piecesOfIp[i]);

            if (piecesOfIp[i] > 255 || piecesOfIp[i] < 0) {
                return errors('przekroczona wartość');
            }
        }
        errors("");
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
    let netAddressTab = countNetworkAddress(piecesOfIp, maskTab);

    /*Adres rozgłoszeniowy */
    countBroadcastAddress(maskTab, netAddressTab);
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

function countNetworkAddress(piecesOfIp, mTab) {
    if (piecesOfIp.length != 4 || mTab.length != 4) {
        return errors("Brak adresu sieci lub zły format ip");
    } else {
        let nAddressTab = [];
        let copyMTab = [];
        let copyPOI = [];
        for (let i = 0; i < 4; i++) {

            copyPOI[i] = piecesOfIp[i].toString(2)
            copyMTab[i] = mTab[i].toString(2);
            let nAddress = "";

            while (copyPOI[i].length < 8) {
                copyPOI[i] = "0" + copyPOI[i];
            }

            while (copyMTab[i].length < 8) {
                copyMTab[i] = "0" + copyMTab[i];
            }

            /*OPERACJA NOT */
            for (let j = 0; j < 8; j++) {
                if ((copyPOI[i].charAt(j)) == 1 && (copyMTab[i].charAt(j) == 1)) {
                    nAddress += "1";

                } else {
                    nAddress += "0";
                }
            }
            nAddressTab.push(parseInt(nAddress, 2));

        }

        networkAddress.innerHTML = "Adres sieci: " + nAddressTab.join('.');
        return nAddressTab;
    }
}

function countBroadcastAddress(mTab, netAddressTab) {
    if (netAddressTab.length != 4 || mTab.length != 4) {
        return errors("Brak adresu sieci lub zły format ip");
    }
    else {
        let broadcastAddressTab = [];
        let copyMTab = [];
        for (let i = 0; i < 4; i++) {
            let notMaskPiece = "";
            copyMTab[i] = mTab[i].toString(2);
            /*NOT */

            for (let j = 0; j < 8; j++) {
                if (copyMTab[i].charAt(j) == 1) {
                    notMaskPiece += "0";

                } else {
                    notMaskPiece += "1";
                }
            }
            copyMTab[i] = parseInt(notMaskPiece, 2);

            broadcast.innerHTML = "Adres rozgłoszeniowy: " + broadcastAddressTab.join('.');
            broadcastAddressTab.push(copyMTab[i] + netAddressTab[i]);

        }

        return broadcastAddressTab;
    }
}

function errors(err = "Nieznany") {
    if (err === "") {
        return error.innerHTML = "";
    }
    error.innerHTML = "Błąd: " + err;
}
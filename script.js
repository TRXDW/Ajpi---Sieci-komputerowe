const test = document.getElementById('test');
const ipInput = document.getElementById('ip');
const addressIp = document.getElementById('addressIp');
const classAjpi = document.getElementById('classIp');
const mask = document.getElementById('mask');
const shortMaskName = document.getElementById('shortMaskName');
const broadcast = document.getElementById('broadcastAddress');
const networkAddress = document.getElementById('networkAddress');
const firstHost = document.getElementById('firstHost');
const lastHost = document.getElementById('lastHost');
const numberOfHosts = document.getElementById('numberOfHosts');
const error = document.getElementById('error');


ipInput.addEventListener('change', countIp)


function countIp() {
    const ip = ipInput.value;
    let piecesOfIp = ip.split(".");


    /*WALIDACJA */
    if (ipValidation(piecesOfIp) === true) {
        return;
    }


    test.innerHTML = ip;



    /*KLASA */
    let classIp = countClassIp(piecesOfIp[0]);

    /*MASK*/
    let maskTab = countMask(piecesOfIp[0]);

    /*SKRÓCONY ZAPIS */
    let shortMask = countShortMaskName(maskTab);

    /*Adres sieci */
    let netAddressTab = countNetworkAddress(piecesOfIp, maskTab);


    /*Adres rozgłoszeniowy */
    let bAT = countBroadcastAddress(maskTab, netAddressTab);


    /*PIERWSZY HOST */
    const fH = fHost(netAddressTab).join('.');

    /*OSTATNI HOST */
    const lH = lHost(bAT);

    const numOfHosts = countNumberOfHosts(shortMask);

    /*POKAŻ NA STRONIE */
    showOnSite(ip, classIp, maskTab, shortMask, netAddressTab, bAT, fH, lH, numOfHosts)

}

function ipValidation(piecesOfIp) {
    if (piecesOfIp.length != 4) {
        errors("Zły format adresu, operacja przerwana, użyj kropki do oddzielenia oktetów");
        return true;
    } else if (false) {

    } else {
        for (let i = 0; i < piecesOfIp.length; i++) {
            piecesOfIp[i] = parseInt(piecesOfIp[i]);

            if (piecesOfIp[i] > 255 || piecesOfIp[i] < 0) {
                errors('przekroczona wartość');
                return true;
            }
        }
        errors("");
        return false;
    }
}

function errors(err = "Nieznany") {
    if (err === "") {
        return error.innerHTML = "";
    }
    return error.innerHTML = "Błąd: " + err;
}



function countClassIp(firstOctet) {
    if (firstOctet >= 0 && firstOctet < 128) {
        return "A";
    } else if (firstOctet > 127 && firstOctet < 192) {
        return "B";
    } else if (firstOctet > 191 && firstOctet < 224) {
        return "C";
    } else if (firstOctet > 223 && firstOctet < 240) {
        return "D";
    } else if (firstOctet > 239 && firstOctet < 256) {
        return "E";
    } else {
        return "Nieznana";
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
    } else if (firstOctet > 223 && firstOctet < 240) {
        maskTab = ['Nie dotyczy'];
        return maskTab;
    } else if (firstOctet > 239 && firstOctet < 256) {
        maskTab = ['Nie dotyczy'];
        return maskTab;
    } else {
        maskTab = ['Nieznana'];
        return maskTab;
    }

}

function countShortMaskName(mTab) {
    let numOfOne = 0;
    let copyMTab = [];

    for (let i = 0; i < mTab.length; i++) {
        copyMTab[i] = mTab[i].toString(2);

        for (let j = 0; j < 8; j++) {
            if (copyMTab[i].charAt(j) == "1") {
                numOfOne++;
            }
        }
    }

    return numOfOne;
}

function countNetworkAddress(piecesOfIp, mTab) {
    if (mTab[0] == 'Nie dotyczy') {
        networkAddress.innerHTML = "Adres sieci: " + mTab[0];
        return;
    } else if (piecesOfIp.length != 4 || mTab.length != 4) {
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

        return nAddressTab;
    }
}

function countBroadcastAddress(mTab, netAddressTab) {
    if (mTab[0] == 'Nie dotyczy') {
        broadcast.innerHTML = "Adres rozgłoszeniowy: " + mTab[0];
        return;
    } else if (netAddressTab.length != 4 || mTab.length != 4) {
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

            broadcastAddressTab.push(copyMTab[i] + netAddressTab[i]);

        }


        return broadcastAddressTab;
    }
}

function fHost(nAddressTab) {
    let fHostTab = [];

    if (nAddressTab === undefined) {
        fHostTab[0] = 'Nie dotyczy';
        return fHostTab;
    }
    for (let i = 0; i < nAddressTab.length; i++) {
        fHostTab[i] = nAddressTab[i];
    }
    fHostTab[3] = nAddressTab[3] + 1;

    return fHostTab;
}

function lHost(bAT) {
    let lHostTab = [];

    if (bAT.length != 4) {
        lHostTab[0] = 'Nie dotyczy';
        return lHostTab;
    }
    for (let i = 0; i < bAT.length; i++) {
        lHostTab[i] = bAT[i];
    }
    lHostTab[3] = bAT[3] - 1;

    return lHostTab;
}



function countNumberOfHosts(shortMaskName) {

    let exponentiation = 32 - shortMaskName;
    return Math.pow(2, exponentiation) - 2;
}

function showOnSite(ip, classIp, maskTab, shortMask, netAddressTab, bAT, fH, lH, numOfHosts) {
    addressIp.innerHTML = "Adres Ip: " + ip;
    classAjpi.innerHTML = "Klasa: " + classIp;
    mask.innerHTML = "Maska: " + maskTab.join('.');
    shortMaskName.innerHTML = "Skrócony zapis maski: /" + shortMask;
    networkAddress.innerHTML = "Adres sieci: " + netAddressTab.join('.');
    broadcast.innerHTML = "Adres rozgłoszeniowy: " + bAT.join('.');
    firstHost.innerHTML = "Pierwszy host: " + fH;
    lastHost.innerHTML = "Ostatni host: " + lH;
    numberOfHosts.innerHTML = "Hostów w sieci: " + numOfHosts;
}


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


ipInput.addEventListener('change', countIp);

if (document.getElementById("m")) {
    document.getElementById('m').addEventListener('change', countIp);
}


function countIp() {
    const ip = ipInput.value;


    let piecesOfIp = ip.split(".");


    /*WALIDACJA */
    if (ipValidation(piecesOfIp, ip) === true) {
        return;
    }



    let classIp = countClassIp(piecesOfIp[0]);

    let maskTab = countMask(piecesOfIp[0]);

    let shortMask = countShortMaskName(maskTab);

    let netAddressTab = countNetworkAddress(piecesOfIp, maskTab, shortMask);

    let bAT = countBroadcastAddress(maskTab, netAddressTab, shortMask);

    const fH = fHost(netAddressTab, shortMask).join('.');

    const lH = lHost(bAT, shortMask).join('.');

    const numOfHosts = countNumberOfHosts(shortMask);

    showOnSite(ip, classIp, maskTab, shortMask, netAddressTab, bAT, fH, lH, numOfHosts)

}


function ipValidation(piecesOfIp, ip) {
    if (ip == false) {
        return true;
    } else if (piecesOfIp.length != 4) {
        errors("Zły format adresu, operacja przerwana, użyj kropki do oddzielenia oktetów");
        return true;
    } else {

        for (let i = 0; i < piecesOfIp.length; i++) {
            if (isNaN(piecesOfIp[i]) || piecesOfIp[i] === " ") {
                errors("Input musi zawierać liczby oddzielone kropkami")
                return true;
            }
        }

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

    if (firstOctet > 223) {
        maskTab = ['Nie dotyczy'];
        return maskTab;
    } else if (document.getElementById('m')) {
        const maskInput = document.getElementById('m');

        const maskV = maskInput.value;
        maskTab = maskInput[maskV].innerHTML.split(".");

        for (let i = 0; i < maskTab.length; i++) {
            maskTab[i] = parseInt(maskTab[i]);
        }

        return maskTab;
    } else if (firstOctet >= 0 && firstOctet < 128) {
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

function countShortMaskName(mTab) {
    if (mTab[0] === 'Nie dotyczy') {
        return "Nie dotyczy";
    }
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

function countNetworkAddress(piecesOfIp, mTab, shortMask) {
    if (mTab[0] === 'Nie dotyczy' || shortMask >= 31) {
        return ['Nie dotyczy'];
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

function countBroadcastAddress(mTab, netAddressTab, shortMask) {
    if (mTab[0] == 'Nie dotyczy' || shortMask >= 31) {
        return ['Nie dotyczy'];
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

function fHost(nAddressTab, shortMask) {
    if (nAddressTab[0] === 'Nie dotyczy' || shortMask >= 31) {

        return ['Nie dotyczy'];
    } else {
        let fHostTab = [];
        for (let i = 0; i < nAddressTab.length; i++) {
            fHostTab[i] = nAddressTab[i];
        }
        fHostTab[3] = nAddressTab[3] + 1;

        return fHostTab;
    }

}

function lHost(bAT, shortMask) {
    let lHostTab = [];

    if (bAT.length != 4 || shortMask >= 31) {
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
    if (shortMaskName === 'Nie dotyczy' || shortMaskName >= 31) {
        return 'Nie dotyczy';
    }
    let exponentiation = 32 - shortMaskName;
    return Math.pow(2, exponentiation) - 2;
}

function showOnSite(ip, classIp, maskTab, shortMask, netAddressTab, bAT, fH, lH, numOfHosts) {
    addressIp.innerHTML = ip;
    classAjpi.innerHTML = classIp;
    mask.innerHTML = maskTab.join('.');
    shortMaskName.innerHTML = "/" + shortMask;
    networkAddress.innerHTML = netAddressTab.join('.');
    broadcast.innerHTML = bAT.join('.');
    firstHost.innerHTML = fH;
    lastHost.innerHTML = lH;
    numberOfHosts.innerHTML = numOfHosts;
}


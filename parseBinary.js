
const btn = document.getElementById('bin');


btn.addEventListener('click', () => {

    const obj = getAjpiObj();


    if (obj.addresArr.length !== 4) {
        return;
    }


    if (btn.innerHTML === "Dec") {
        btn.innerHTML = "Bin";
    } else {
        btn.innerHTML = "Dec";
    }

    if (obj.maskArr.length !== 4) {
        obj.maskArr[0] = "Nie dotyczy";
    }

    if (obj.broadcastArr.length !== 4) {
        obj.broadcastArr[0] = "Nie dotyczy";
    }

    if (obj.networkAddresArr.length !== 4) {
        obj.networkAddresArr[0] = "Nie dotyczy";
    }

    if (obj.firstHostArr.length !== 4) {
        obj.firstHostArr[0] = "Nie dotyczy";
    }

    if (obj.lastHostArr.length !== 4) {
        obj.lastHostArr[0] = "Nie dotyczy";
    }

    addressIp.innerHTML = obj.addresArr.join(".");
    mask.innerHTML = obj.maskArr.join(".");
    broadcast.innerHTML = obj.broadcastArr.join(".");
    networkAddress.innerHTML = obj.networkAddresArr.join(".");
    firstHost.innerHTML = obj.firstHostArr.join(".");
    lastHost.innerHTML = obj.lastHostArr.join(".");
})

function getAjpiObj(json = false) {
    let addresArr = addressIp.innerHTML.split(".");
    let classIp = classAjpi.innerHTML;
    let maskArr = mask.innerHTML.split(".");
    let shortMask = shortMaskName.innerHTML;
    let broadcastArr = broadcast.innerHTML.split(".");
    let networkAddresArr = networkAddress.innerHTML.split(".");
    let firstHostArr = firstHost.innerHTML.split(".");
    let lastHostArr = lastHost.innerHTML.split(".");
    let numOfH = numberOfHosts.innerHTML;

    let ipObj = {}

    if (addresArr[0].length > 5) {
        ipObj = {
            addresArr: addresArr.map(el => parseInt(el, 2)),
            classIp,
            maskArr: maskArr.map(el => parseInt(el, 2)),
            shortMask,
            broadcastArr: broadcastArr.map(el => parseInt(el, 2)),
            networkAddresArr: networkAddresArr.map(el => parseInt(el, 2)),
            firstHostArr: firstHostArr.map(el => parseInt(el, 2)),
            lastHostArr: lastHostArr.map(el => parseInt(el, 2)),
            numberOfHosts: numOfH
        }
    } else {
        ipObj = {
            addresArr: addresArr.map(el => dec2bin(el)),
            classIp,
            maskArr: maskArr.map(el => dec2bin(el)),
            shortMask,
            broadcastArr: broadcastArr.map(el => dec2bin(el)),
            networkAddresArr: networkAddresArr.map(el => dec2bin(el)),
            firstHostArr: firstHostArr.map(el => dec2bin(el)),
            lastHostArr: lastHostArr.map(el => dec2bin(el)),
            numberOfHosts: numOfH
        }


    }
    return ipObj;

}



function dec2bin(dec) {
    return (dec >>> 0).toString(2).padStart(8, '0');
}



const jsonBtn = document.getElementById('json');
jsonBtn.addEventListener('click', downloadJSON);

function downloadJSON() {

    const obj = getAjpiObj(true);
    if (obj.addresArr.length !== 4) {
        return;
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "ip.json");
    dlAnchorElem.click();
}

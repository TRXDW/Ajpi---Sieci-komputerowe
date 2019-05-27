
const btn = document.getElementById('btnTest');


btn.addEventListener('click', ()=> {
    console.log(addressIp.innerHTML);
    console.log(mask.innerHTML);
    console.log(broadcast.innerHTML);
    console.log(networkAddress.innerHTML);
    console.log(firstHost.innerHTML);
    console.log(lastHost.innerHTML);
    console.log("------------------");
})


function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

function dec2bin(dec){
    return (dec >>> 0).toString(2).padStart(8, '0');
}

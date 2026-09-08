function atualizarRelogio() {
    const agora = new Date();
    
    let horas = agora.getHours();
    let minutos = agora.getMinutes();
    let segundos = agora.getSeconds();

    horas = horas < 10 ? '0' + horas : horas;
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;

    document.getElementById('horas').textContent = horas;
    document.getElementById('minutos').textContent = minutos;
    document.getElementById('segundos').textContent = segundos;
}

atualizarRelogio();

setInterval(atualizarRelogio, 1000);


////////////////////////////////////////////////////////////////////////

const horas = document.querySelector('#horas')
const minutos = document.querySelector('#minutos')
const segundos = document.querySelector('#segundos')

setInterval(relogio,1000)

function relogio(){

        hoje = new Date()
        h = hoje.getHours()
        m = hoje.getMinutes()
        s = hoje.getSeconds()

if(h<10){
    h='0'+h
}
if(m<10){
    m='0'+m
}
if(s<10){
    s='0'+s
}

        horas.textContent = h
        minutos.textContent = m
        segundos.textContent = s
}
//DOM
const input = document.querySelector('#entrada')
const botao = document.querySelector('#botao')
const qrcode = document.querySelector('#qrcode')

//EVENTO
botao.addEventListener('click',gerar)

//AÇÃO
function gerar(){
    texto = input.value
    qrcode.innerHTML = ''
    new QRCode(qrcode,{
        text:texto,
        width: 300,
        height: 300,
        colorDark:'yellow',
        colorLight:'gray'
    })
}
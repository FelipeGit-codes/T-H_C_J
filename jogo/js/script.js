// DOM
const boneco = document.querySelector('#boneco');
posicao = 0

//Evento
document.addEventListener('keydown', controlar)
boneco.addEventListener('animationend',parar)

//Ação
function controlar(evento){
    if (evento.key == 'ArrowUp') {
        boneco.classList.add('pulando');
    }
    if (evento.key == 'ArrowLeft' & posicao>0) {
        posicao = posicao - 10;
    }
    if (evento.key == 'ArrowRight' && posicao< 600) {
        posicao = posicao + 10;
    }
    boneco.style.left = posicao + 'px';

}

function parar(){
    boneco.classList.remove('pulando');
}

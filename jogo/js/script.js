//DOM
const boneco = document.querySelector('#boneco')
posicao = 0

//EVENTO
document.addEventListener('keydown', controlar)
boneco.addEventListener('animationend',parar)

//AÇÃO

function controlar(evento){
    if(evento.key == 'ArrowUp'){
        boneco.classList.add('pulando')
    }
}

function parar(){
    boneco.classList.remove('pulando')
}
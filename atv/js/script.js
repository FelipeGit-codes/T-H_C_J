const uni1 = document.querySelector('#uni1')
const uni2 = document.querySelector('#uni2')
const uni3 = document.querySelector('#uni3')
const botao = document.querySelector('#botao')
const resultado1 = document.querySelector('#resultado1')
const resultado2 = document.querySelector('#resultado2')
const resultado3 = document.querySelector('#resultado3')

botao.addEventListener('click', nota)

function nota(){
    n1 = Number(uni1.value)
    n2 = Number(uni2.value)
    n3 = Number(uni3.value)
    calculo = (n1+n2+n3) / 3

    resultado1.textContent = `Sua média é ${calculo.toFixed(2)}`


    if(calculo>=5){
    resultado2.textContent = `Você está aprovado!`

    }else if(calculo<=4){
    resultado2.textContent = `Você está reprovado!`

}}
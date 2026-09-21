const dis = document.querySelector('#dis')
const con = document.querySelector('#con')
const pre = document.querySelector('#pre')
const botao = document.querySelector('#botao')
const resultado1 = document.querySelector('#resultado1')
const resultado2 = document.querySelector('#resultado2')
const resultado3 = document.querySelector('#resultado3')

botao.addEventListener('click', formula)

function formula(){
    n1 = Number(dis.value)
    n2 = Number(con.value)
    n3 = Number(pre.value)
    formula = (n1/n2) * n3

resultado1.textContent = `O valor total da viagem é R$ ${formula.toFixed(2)}`

}
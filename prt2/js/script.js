const pre = document.querySelector('#pre')
const qua = document.querySelector('#qua')
const des = document.querySelector('#des')
const botao = document.querySelector('#botao')
const resultado1 = document.querySelector('#resultado1')

botao.addEventListener('click', formula)

function formula(){
    n1 = Number(pre.value)
    n2 = Number(qua.value)
    n3 = Number(des.value)

    calculo = (n1 * n2) - ((n1 * n2) * (n3 / 100))

    resultado1.textContent = `Valor final: R$ ${calculo.toFixed(2)}`
}

//Por esse desconto foi de quebrar kkkkkk
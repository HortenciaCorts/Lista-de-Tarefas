feather.replace()

// let arrayTask = [
//     { index: 0, input: 'estudar JavaScript', check: true },
//     { index: 1, input: 'correr', check: false },
//     { index: 2, input: 'limpar a casa', check: false },
//     { index: 3, input: 'ler', check: false },
// ];

let inputForm = document.querySelector('form input')
let erro = document.querySelector('.erro')
let isUpdate = false
let idEdit = -1

const Storage = {
    //Pegando um array com os valores armazenados, se não tiver retorna um array vazio
    get() {
        return JSON.parse(localStorage.getItem('listOfTask') || [])
    },
    //Enviando os valores do array no localStorage (sempre que o App.init for chamado irá atualizar)
    set(task) {
        localStorage.setItem('listOfTask', JSON.stringify(task))
    }
}
//Adicionar os valores do localStorage no array
let arrayTask = Storage.get()
//Descobri o maior index existente no array para não repetir
const arrayIndex = mapIndex()
var startIndex = arrayIndex.reduce(function(a, b) {
  return Math.max(a, b);
});
//Analizando as informações para organizar a lista de forma crescente ou decrescente
let isCrescent = true
let isUp = true;
const Order = {
    //Atualizar os valores do HTML de descrição(input) ou checked
    pDescript: document.querySelector('#descript'),
    check: document.querySelector('#checked'),
    //Organiza na ordem que foi adicionada
    index(){
        arrayTask.sort((a, b) => {
            return a.index > b.index ? 1 : -1
        });
    },
    //Quando chamado irá adicionar o icone conforme a ordem (crescente ou decrescente)
    isCrescent(){
        const iconUp = `Descrição <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>`
        const iconDown = `Descrição <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>`

        if(isCrescent){
            Order.pDescript.innerHTML = iconDown;
        }else if(!isCrescent){
            Order.pDescript.innerHTML = iconUp;
        }
    },
    //Organiza em ordem do nome das tarefas
    description() {
        Order.isCrescent()

        if (isCrescent) {
            isCrescent = false
            arrayTask.sort((a, b) => {
                return a.input.toLowerCase() > b.input.toLowerCase() ? 1 : -1
            });
        } else if (!isCrescent) {
            isCrescent = true
            arrayTask.sort((a, b) => {
                return a.input.toLowerCase() < b.input.toLowerCase() ? 1 : -1
            });
        }
        App.reload()
    },
    //Quando chamado irá adicionar o icone conforme a ordem (crescente ou decrescente)
    isUp(){
        const iconUp = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-up"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg>`
        const iconDown = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-down"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>`

        if(isUp){
            Order.check.innerHTML = iconDown;
        }else if(!isUp){
            Order.check.innerHTML = iconUp;
        }
    },
    //Organiza conforme marcado com checado (ordem crescente ou decrescente)
    checked() {
        Order.isUp()

        if (isUp) {
            isUp = false;
            arrayTask.sort((a, b) => {
                return a.check < b.check ? -1 : 1
            });
        }
        else if (!isUp) {
            isUp = true;
            arrayTask.sort((a, b) => {
                return a.check > b.check ? -1 : 1
            });
        }
        App.reload()
    }
}
// Order.index()
//Chamando as funções de organização ao clicar nos botões
document.querySelector('#descript').addEventListener('click', Order.description)
document.querySelector('#checked').addEventListener('click', Order.checked)
//Criando um array com todos os valores de index
function mapIndex() {
    let arrayIndex = arrayTask.map(function (item, i) {
        return arrayTask[i].index
    })
    return arrayIndex
}
//Função para abrir/fechar o modal e limpando o input
function modal() {
    document.querySelector('.modal-overlay').classList.toggle('active')
    inputForm.value = ""
}
function addingHTML(input, index) {
    //Buscando o array com todos os index
    const arrayIndex = mapIndex();

    const html = `
    <input type="checkbox">
    <div class="details">
        <p>${input}</p>
    <div class="edit">
        <svg onclick="editTask(${index})" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        <svg onclick="remove(${index})" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </div>
    </div>
    `;
    if (isUpdate) {
        //Verificar onde o item clicado está - 
        const getNewIndex = arrayIndex.indexOf(index)
        //Atualiza a tarefa, modificando o nome da tarefa e deixando a tafera pendente
        arrayTask[getNewIndex].check = false;
        arrayTask[getNewIndex].input = input;
        const item = document.querySelectorAll('.item')
        item[getNewIndex].innerHTML = html
        isUpdate = false
        modal()
        App.reload()
        checkTask()
    } else if (input != "") {
        //Adicionando os itens no array
        const divItem = document.createElement('div')
        divItem.setAttribute('class', 'item')
        divItem.innerHTML = html
        document.querySelector('.to-do-list').appendChild(divItem)

        //Verifica se o item já existe (no array do Storage do navegador), se não existir adiciona a nova tarefa no array
        const contains = arrayIndex.includes(index);
        if (!contains) {
            arrayTask.push({ index: index, input: input, check: false })
            modal()
            App.reload()
        }
        checkTask()
        // Fechando o modal e verificando se os itens estavam checados
    } else {
        //Se o campo input estiver vazio, mostra a mensagem
        erro.innerHTML = 'Campo vazio. Informe a tarefa'
    }
}
//Ao clicar no botão para adicionar um novo item:
document.querySelector('#newItem').addEventListener('click', function (event) {
    event.preventDefault()
    //Será limpado o campo do erro
    erro.innerHTML = ""
    //Adcionado uma variável para pegar o valor da quantidade de elementos no array
    //Seguido sempre de uma atualização para o ultimo index
    let newIndex = startIndex
    if (idEdit != -1) {
        //Se estive editando a tarefa, o index será o index que está sendo editado
        newIndex = idEdit;
        //Voltando a variável editar para false
        idEdit = -1;
    } else {
        //Se o index ainda não existir será dado um valor novo para adiciona-lo no final do array
        newIndex++
        //Atualizando o ultimo index
        startIndex = newIndex;
    }
    //Chamando a função de adiconar elementos passando o valor do input e o index
    addingHTML(inputForm.value, newIndex)
})
//Checando se o elemento está com o atributo check
function checkTask() {
    const checkbox = document.querySelectorAll('input[type="checkbox"]')
    //Percorrendo o array e adicionando uma classe nos elementos que estão checados para marca-los como lidos
    checkbox.forEach(function (item, index) {
        const task = document.querySelectorAll('.item p')
        if (arrayTask[index].check === true) {
            task[index].classList.add('done')
            item.setAttribute('checked', 'checked')
        }
        //Quando clicar no input checked adicionar a classe para marca-lo como lido
        item.addEventListener('click', function () {
            if (item.checked) {
                task[index].classList.add('done')
                arrayTask[index].check = item.checked;
            } else {
                //Se clicar novamente e desmarcar a classe será removida
                task[index].classList.remove('done')
                arrayTask[index].check = item.checked;
            }
            App.reload()
        });
    });
}
//Clicando no icone de editar
function editTask(index) {
    //Verificar onde o item clicado está
    //É necessário chamar o mapIndex para trazer o array de index atualizado
    let arrayIndex = mapIndex();
    arrayIndex = arrayIndex.indexOf(index)
    //Fechar o modal
    modal()
    //Adicionar no input o valor atual que será editado
    inputForm.value = arrayTask[arrayIndex].input;
    //Atualizar a variável para true pois é um elemento será editado (não é um novo elemento)
    isUpdate = true
    //Atualizar o index que está sendo editado
    idEdit = index;
}
//Removendo a tarefa desejada
function remove(index) {
    //Verificar onde o item clicado está
    //É necessário chamar o mapIndex para trazer o array de index atualizado
    let arrayIndex = mapIndex()
    arrayIndex = arrayIndex.indexOf(index)
    //Removendo o item clicado
    arrayTask.splice(arrayIndex, 1)
    //Atualizando o HTML
    App.reload()
}
//Aplicação
const App = {
    init() {
        //Adicionando no HTML todos os elementos do array
        arrayTask.forEach(function (item) {
            addingHTML(item.input, item.index)
        })

        Storage.set(arrayTask)
    },
    reload() {
        //Limpando o HTML para adicionar os elementos do array novamente
        const containerTask = document.querySelector('.to-do-list')
        containerTask.innerHTML = ""

        App.init()
    }
}

//Fechando o modal ao clicar no icon 'x' e ao clicar em cancelar
document.querySelector('#button-modal').addEventListener('click', modal);
document.querySelector('#close').addEventListener('click', modal);
//Inicializando a aplicação
App.init()
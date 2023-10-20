// https://api.b7web.com.br/cinema/

axios.get('https://api.b7web.com.br/cinema/')
  .then(response => {
    catalogo = response.data
    catalogo.map((item, index)=>{
      let filmes = document.querySelector('.lista-filmes', '.films-container').cloneNode(true);


      const tituloElement = filmes.querySelector('.films-container');
      filmes.querySelector('.titulo').innerHTML = item.titulo
      filmes.querySelector('.img-cartaz').src = item.avatar

      //usando LocalStorage

      tituloElement.addEventListener('click', () => {
        const posicao = catalogo.indexOf(item);
        const tituloFilme = catalogo[posicao].titulo;
      
        localStorage.setItem('tituloFilme', tituloFilme);
        window.location.href = '../pages/salaHorario.html';
  
      });
      document.querySelector('.catalogo-filme').append(filmes)
    })
   
  })
  .catch(error => {
    console.log('Ocorreu um erro:', error);
  });

//salaHorario

// Variáveis para armazenar as cadeiras selecionadas e a confirmação
let assentosSelecionados = [];
let confirmado = false;

// Função para selecionar/desmarcar um assento
function selecionarAssento(fileira, coluna) {
  // Verificar se já foi confirmado, se sim, não permitir mais seleções
  if (confirmado) {
    return;
  }

  let assento = fileira + coluna;
  let index = assentosSelecionados.indexOf(assento);

  if (index > -1) {
    // O assento já foi selecionado, desmarcar
    assentosSelecionados.splice(index, 1);
    document.getElementById(assento).classList.remove('selecionado');
  } else {
    // O assento não foi selecionado, marcar
    assentosSelecionados.push(assento);
    document.getElementById(assento).classList.add('selecionado');
  }

  // Atualizar a lista de cadeiras selecionadas
  atualizarCadeirasSelecionadas();
  console.log("Cadeiras selecionadas:", assentosSelecionados);
}

// Função para atualizar a lista de cadeiras selecionadas no HTML
function atualizarCadeirasSelecionadas() {
  let listaCadeiras = document.getElementById('listaCadeiras');
  listaCadeiras.innerHTML = '';

  for (let i = 0; i < assentosSelecionados.length; i++) {
    let assento = assentosSelecionados[i];
    let li = document.createElement('li');
    let label = document.createElement('label');
    label.textContent = assento;
    let select = document.createElement('select');
    select.name = 'ingresso-' + assento;
    let optionInteira = document.createElement('option');
    optionInteira.value = 'inteira';
    optionInteira.textContent = 'Inteira';
    let optionMeia = document.createElement('option');
    optionMeia.value = 'meia';
    optionMeia.textContent = 'Meia Entrada';

    select.appendChild(optionInteira);
    select.appendChild(optionMeia);
    li.appendChild(label);
    li.appendChild(select);
    listaCadeiras.appendChild(li);
  }
}

// Função para confirmar a seleção
const divElement = document.getElementById('cadeirasSelecionadas');
function confirmarSelecao() {
  // Verificar se pelo menos uma cadeira foi selecionada
  if (assentosSelecionados.length === 0) {
    alert("Selecione pelo menos uma cadeira!");
    return;
  }

  confirmado = true;
  document.getElementById('confirmar').style.display = 'none';
  document.getElementById('alterar').style.display = 'block';
  document.getElementById('total').style.display = 'block';
  document.getElementById('btn-pagamento').style.display = 'block';
  divElement.classList.add('disabled-div');
  

  // Calcular o total a pagar
  let totalPagar = calcularTotalPagar();
  document.getElementById('total').textContent = 'Total a Pagar: R$ ' + totalPagar.toFixed(2);

  // Criar um array com as cadeiras selecionadas e o tipo de ingresso
  let cadeirasSelecionadas = [];

  for (let i = 0; i < assentosSelecionados.length; i++) {
    let assento = assentosSelecionados[i];
    let select = document.getElementsByName('ingresso-' + assento)[0];
    let tipoIngresso = select.value;
    cadeirasSelecionadas.push({ assento: assento, ingresso: tipoIngresso });
  }

  console.log("Cadeiras selecionadas:", cadeirasSelecionadas);
  console.log("Total a pagar: R$", totalPagar.toFixed(2));
}

// Função para calcular o total a pagar
function calcularTotalPagar() {
  let total = 0;
  let valorInteira = 32;
  let valorMeia = 16;

  for (let i = 0; i < assentosSelecionados.length; i++) {
    let assento = assentosSelecionados[i];
    let select = document.getElementsByName('ingresso-' + assento)[0];
    let tipoIngresso = select.value;

    if (tipoIngresso === 'inteira') {
      total += valorInteira;
    } else if (tipoIngresso === 'meia') {
      total += valorMeia;
    }
  }

  return total;
}

// Função para permitir alterar a seleção
function permitirAlterar() {
  confirmado = false;
  assentosSelecionados = [];
  document.getElementById('confirmar').style.display = 'block';
  document.getElementById('alterar').style.display = 'none';
  document.getElementById('total').style.display = 'none';
  document.getElementById('btn-pagamento').style.display = 'none';
  divElement.classList.remove('disabled-div');
  atualizarCadeirasSelecionadas();

  let assentosDiv = document.getElementsByClassName('assento');
  for (let i = 0; i < assentosDiv.length; i++) {
    assentosDiv[i].classList.remove('selecionado');
  }
}

// Criar os assentos no HTML
document.addEventListener('DOMContentLoaded', function() {
  // Criar os assentos no HTML
  let assentosDiv = document.getElementById('assentos');
  let fileiras = 'ABCDEFGHIJ';
  let numColunas = 15;

  for (let i = 0; i < fileiras.length; i++) {
    let fileira = fileiras.charAt(i);
    let fileiraDiv = document.createElement('div');

    for (let j = 1; j <= numColunas; j++) {
      let assento = fileira + j;
      let assentoDiv = document.createElement('div');
      assentoDiv.id = assento;
      assentoDiv.className = 'assento';
      assentoDiv.textContent = fileira + j;
      assentoDiv.setAttribute('onclick', 'selecionarAssento("' + fileira + '", ' + j + ')');
      fileiraDiv.appendChild(assentoDiv);
    }

    assentosDiv.appendChild(fileiraDiv);
  }
});




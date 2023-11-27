const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let inputNome = document.getElementById('nome');
let inputTelefone = document.getElementById('telefone');
let inputEmail = document.getElementById('email');
let inputEndereco = document.getElementById('endereco');
let inputCPF = document.getElementById('cpf');
let inputSenha = document.getElementById('senha');
let form = document.getElementById('formulario');
let cidade = document.getElementById('cidade');
// let citySelect = document.getElementById('city');

async function listaCidades() {
  let resposta = await fetch('http://localhost:3000/cidade');
  
  if (resposta.ok) {
    let cidadesJson = await resposta.json();
    
    let nomesCidades = cidadesJson.map(cidade => cidade.nome);

    console.log(nomesCidades);

    popularDropdown(nomesCidades);
  } else {
    console.error('Erro ao obter a lista de cidades');
  }
}

function popularDropdown(cidades) {
  const dropdown = $('#cidade');

  dropdown.empty();

  dropdown.append('<option selected>Selecione a cidade</option>');

  cidades.forEach((cidade) => {
    dropdown.append(`<option value="${cidade}">${cidade}</option>`);
  });
}

$(document).ready(() => {
  listaCidades();
});

//FALTA VALIDAÇÃO


async function buscarDados () {
  let resposta = await fetch('http://localhost:3000/usuario/' + id);
  if (resposta.ok) {
    let usuario = await resposta.json();
    inputNome.value = usuario.nome;
    inputTelefone.value = usuario.telefone;
    inputEmail.value = usuario.email;
    inputEndereco.value = usuario.endereco;
    inputCPF.value = usuario.cpf;
    inputSenha.value = usuario.senha;
  } else if (resposta.status === 422) {
    let e = await resposta.json();
    alert(e.error);
  } else {
    alert('Ops! Algo deu errado!');
  }
}

if (id) {
  buscarDados();
}

citySelect.addEventListener('change', () => {
  setCities(stateSelect.value);
});

form.addEventListener('submit', async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let payload = {
    nome: inputNome.value,
    telefone: inputTelefone.value,
    email: inputEmail.value,
    endereco: inputEndereco.value,
    cpf: inputCPF.value,
    senha: inputSenha.value
  }

  let url = 'http://localhost:3000/usuario';
  let method = 'POST';
  if (id) {
    url += '/' + id;
    method = 'PUT';
  }

  let resposta = await fetch(url, {
    method: method,
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (resposta.ok) {
    window.location.href = 'index.html'
  } else {
    alert('Ops! Algo deu errado!');
  }
});

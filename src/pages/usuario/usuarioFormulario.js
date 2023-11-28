const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let inputNome = document.getElementById("nome");
let inputTelefone = document.getElementById("telefone");
let inputEmail = document.getElementById("email");
let inputEndereco = document.getElementById("endereco");
let inputCPF = document.getElementById("cpf");
let inputSenha = document.getElementById("senha");
let form = document.getElementById("formulario");
let cidade = document.getElementById("cidade");
let cidadeSelect = document.getElementById("cidade");

async function listaCidades() {
  let resposta = await fetch("http://localhost:3000/cidade");

  if (resposta.ok) {
    let cidadesJson = await resposta.json();

    let nomesCidades = cidadesJson.map((cidade) => cidade.nome);

    popularDropdown(nomesCidades);
  } else {
    console.error("Erro ao obter a lista de cidades");
  }
}

function popularDropdown(cidades) {
  cidadeSelect.innerHTML = "";

  cidadeSelect.innerHTML = "<option selected>Selecione a cidade</option>";

  cidades.forEach((cidade) => {
    let option = document.createElement("option");
    option.value = cidade;
    option.textContent = cidade;
    cidadeSelect.appendChild(option);
    console.log(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  listaCidades();
});

async function buscarDados() {
  let resposta = await fetch("http://localhost:3000/usuario/" + id);
  if (resposta.ok) {
    let usuario = await resposta.json();
    inputNome.value = usuario.nome;
    inputTelefone.value = usuario.telefone;
    inputEmail.value = usuario.email;
    inputEndereco.value = usuario.endereco;
    inputCPF.value = usuario.cpf;
    cidadeSelect.value = usuario.cidade.nome;
  } else if (resposta.status === 422) {
    let e = await resposta.json();
    alert(e.error);
  } else {
    alert("Ops! Algo deu errado!");
  }
  console.log(cidadeSelect.value);
}

if (id) {
  buscarDados();
}

form.addEventListener("submit", async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let payload = {
    nome: inputNome.value,
    email: inputEmail.value,
    senha: inputSenha.value,
    cpf: inputCPF.value,
    telefone: inputTelefone.value,
    endereco: inputEndereco.value,
    cidadeId: cidade.value,
  };

  let url = "http://localhost:3000/usuario";
  let method = "POST";
  if (id) {
    url += "/" + id;
    method = "PUT";
  }

  let resposta = await fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resposta.ok) {
    window.location.href = "index.html";
  } else {
    alert("Ops! Algo deu errado!");
  }
});

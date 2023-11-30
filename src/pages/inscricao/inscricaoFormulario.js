const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let inputUsuario = document.getElementById("usuario");
let inputEvento = document.getElementById("evento");
let inputStatus = document.getElementById("status");
let form = document.getElementById("formulario");


async function listaUsuarios() {
  let resposta = await fetch("http://localhost:3000/usuario");

  if (resposta.ok) {
    let usuariosJson = await resposta.json();

    let nomesUsuarios = usuariosJson.map((usuario) => usuario.nome);

    popularDropdown(nomesUsuarios);
  } else {
    console.error("Erro ao obter a lista de usuarios");
  }
  if (id) {
    let resposta = await fetch("http://localhost:3000/inscricao/" + id);
    let inscricao = await resposta.json();
    inputUsuario.value = inscricao.usuario.nome;
  }
}

function popularDropdown(usuario) {
  inputUsuario.innerHTML = "";

  inputUsuario.innerHTML = "<option selected>Selecione a cidade</option>";

  usuario.forEach((usuario) => {
    let option = document.createElement("option");
    option.value = usuario;
    option.textContent = usuario;
    inputUsuario.appendChild(option);
    console.log(option);
  });
}

async function listaEventos() {
  let resposta = await fetch("http://localhost:3000/evento");

  if (resposta.ok) {
    let eventosJson = await resposta.json();

    let nomesEventos = eventosJson.map((evento) => evento.titulo);

    popularDropdown(nomesEventos);
  } else {
    console.error("Erro ao obter a lista de eventos");
  }
  if (id) {
    let resposta = await fetch("http://localhost:3000/inscricao/" + id);
    let inscricao = await resposta.json();
    inputUsuario.value = inscricao.usuario.nome;
  }
}

function popularDropdown(evento) {
  inputEvento.innerHTML = "";

  inputEvento.innerHTML = "<option selected>Selecione a cidade</option>";

  evento.forEach((evento) => {
    let option = document.createElement("option");
    option.value = evento;
    option.textContent = evento;
    inputEvento.appendChild(option);
    // console.log(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  listaEventos();
});

async function buscarDados() {
  let resposta = await fetch("http://localhost:3000/inscricao/" + id);
  if (resposta.ok) {
    let inscricao = await resposta.json();
    inputUsuario.value = inscricao.id_usuario;
    inputEvento.value = inscricao.id_evento;
    inputStatus.value = inscricao.status;
  } else if (resposta.status === 422) {
    let e = await resposta.json();
    alert(e.error);
  } else {
    alert("Ops! Algo deu errado!");
  }
  // console.log(cidadeSelect.value);
}

if (id) {
  buscarDados();
}

form.addEventListener("submit", async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let payload = {
    id_usuario: inputUsuario.value,
    id_evento: inputEvento.value,
    id_status: inputStatus.value,
  };

  let url = "http://localhost:3000/inscricao";
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

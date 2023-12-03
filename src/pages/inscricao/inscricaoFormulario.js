const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let inputUsuario = document.getElementById("usuario");
let inputEvento = document.getElementById("evento");
let inputStatus = document.getElementById("status");
let form = document.getElementById("formulario");
let eventoSelecionado;
let authorization = localStorage.getItem("Authorization");
let role = localStorage.getItem("Role");
let idUsuario = localStorage.getItem("IdUser");
let nomeUsuario = localStorage.getItem("Nome");
let emailUsuario = localStorage.getItem("Email");

if (role != "user") {
  alert("Somente usuários podem se inscrever em eventos!");
  window.location.href = "index.html";
}
console.log(role);

async function listaUsuarios() {
  let response = await fetch("http://localhost:3000/usuario", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  if (response.ok) {
    let usuarios = await response.json();
    popularDropdownUsuario(usuarios);
  } else {
    console.error("Erro ao obter a lista de eventos");
  }
  if (id) {
    let resposta = await fetch("http://localhost:3000/inscricao/" + id);
    let inscricao = await resposta.json();
    inputUsuario.value = inscricao.usuario.id;
  }
}

function popularDropdownUsuario(usuario) {
  inputUsuario.innerHTML = "";

  inputUsuario.innerHTML = "<option selected>Selecione o usuario</option>";

  usuario.forEach((usuario) => {
    let option = document.createElement("option");
    option.value = usuario.id;
    option.textContent = usuario.nome;
    inputUsuario.appendChild(option);
    console.log(option);
  });
}

async function listaEventos() {
  let response = await fetch("http://localhost:3000/evento", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  if (response.ok) {
    let eventos = await response.json();

    popularDropdownEvento(eventos);
  } else {
    console.error("Erro ao obter a lista de eventos");
  }
  if (id) {
    let resposta = await fetch("http://localhost:3000/inscricao/" + id);
    let inscricao = await resposta.json();
    inputEvento.value = inscricao.evento.id;
  }
}

function popularDropdownEvento(evento) {
  inputEvento.innerHTML = "";

  inputEvento.innerHTML = "<option selected>Selecione o evento</option>";

  evento.forEach((evento) => {
    let option = document.createElement("option");
    option.value = evento.id;
    option.textContent = evento.titulo;
    inputEvento.appendChild(option);
    console.log(option);
  });
}

inputEvento.addEventListener("change", () => {
  const selectedIndex = inputEvento.selectedIndex;
  eventoSelecionado = inputEvento.options[selectedIndex].textContent;
});

document.addEventListener("DOMContentLoaded", () => {
  listaEventos();
  listaUsuarios();
});

async function buscarDados() {
  let resposta = await fetch("http://localhost:3000/inscricao/" + id);
  if (resposta.ok) {
    let inscricao = await resposta.json();
    // inputUsuario.value = inscricao.usuario.id;
    // inputEvento.value = inscricao.evento.id;
    //   inputStatus.value = inscricao.status;
    // } else if (resposta.status === 422) {
    //   let e = await resposta.json();
    //   alert(e.error);
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
    status: "I",
  };

  let payloadEmail = {
    email: emailUsuario,
    nome: nomeUsuario,
    evento: eventoSelecionado,
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
    let enviarEmail = await fetch("http://localhost:3000/usuarioemail", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payloadEmail),
    });
    window.location.href = "index.html";
  } else {
    alert("Você já está cadastrado nesse evento!");
  }
});

let cidadeSelect = document.getElementById("cidade");
let adminSelect = document.getElementById("admin");

let inputDescricao = document.getElementById("descricao");
let inputDataInicio = document.getElementById("dataInicio");
let inputDataFim = document.getElementById("dataFim");
let inputHoraInicio = document.getElementById("horaInicio");
let inputHoraFim = document.getElementById("horaFim");
let inputLocal = document.getElementById("local");

let form = document.getElementById("formulario");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function buscarCidades() {
  let response = await fetch("http://localhost:3000/cidade", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  let cidades = await response.json();
  return cidades;
}

async function buscarAdmins() {
  let response = await fetch("http://localhost:3000/admin", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  let admins = await response.json();
  return admins;
}

async function definirCidades() {
  let cidades = await buscarCidades();
  let selectOption = document.createElement("option");
  selectOption.selected = true;
  selectOption.disabled = true;
  selectOption.innerText = "Selecione";
  cidadeSelect.appendChild(selectOption);

  for (let cidade of cidades) {
    let option = document.createElement("option");
    option.value = cidade.id;
    option.innerText = cidade.nome;

    cidadeSelect.appendChild(option);
  }
}

async function definirAdmins() {
  let admins = await buscarAdmins();
  let selectOption = document.createElement("option");
  selectOption.selected = true;
  selectOption.disabled = true;
  selectOption.innerText = "Selecione";
  adminSelect.appendChild(selectOption);

  for (let admin of admins) {
    let option = document.createElement("option");
    option.value = admin.id;
    option.innerText = admin.nome;

    adminSelect.appendChild(option);
  }
}

definirCidades();
definirAdmins();

async function buscarDados() {
  let resposta = await fetch("http://localhost:3000/evento/" + id);
  if (resposta.ok) {
    let evento = await resposta.json();
    inputDescricao.value = evento.descricao;
    inputDataInicio.value = evento.dataInicio;
    inputDataFim.value = evento.dataFim;
    inputHoraInicio.value = evento.horaInicio;
    inputHoraFim.value = evento.horaFim;
    inputLocal.value = evento.local;
    cidadeSelect.value = evento.cidade.id;
    adminSelect.value = evento.admin.id;
  } else if (resposta.status === 422) {
    let e = await resposta.json();
    alert(e.error);
  } else {
    alert("Ops! Algo deu errado!");
  }
}

if (id) {
  buscarDados();
}

form.addEventListener("submit", async (e) => {
  e.stopPropagation();
  e.preventDefault();

  let descricao = inputDescricao.value;
  let dataInicio = inputDataInicio.value;
  let dataFim = inputDataFim.value;
  let horaInicio = inputHoraInicio.value;
  let horaFim = inputHoraFim.value;
  let local = inputLocal.value;
  let id_cidade = cidadeSelect.value;
  let id_admin = adminSelect.value;

  let payload = {
    descricao,
    dataInicio,
    dataFim,
    horaInicio,
    horaFim,
    local,
    id_cidade,
    id_admin,
  };

  console.log(payload);

  let url = "http://localhost:3000/evento";
  let method = "POST";

  if (id) {
    url += "/" + id;
    method = "PUT";
    console.log(url);
  }

  let resposta = await fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      // Authorization: authorization,
    },
    body: JSON.stringify(payload),
  });

  if (resposta.ok) {
    window.location.href = `index.html`;
  } else {
    alert("Algo deu errado!");
  }
});

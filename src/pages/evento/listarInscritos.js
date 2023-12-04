const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let titulo = document.getElementById("title-page");
let corpoTabela = document.getElementById("corpo-tabela");

titulo.innerText += " teste";

async function listarInscritos(id) {
  if (id) {
    let response = await fetch("http://localhost:3000/inscricao");

    let eventos = await response.json();

    for (let evento of eventos) {
      if (evento.evento.id == id) {
        let tr = document.createElement("tr");
        let tdNome = document.createElement("td");
        let tdEmail = document.createElement("td");
        let tdStatus = document.createElement("td");

        tdNome.innerText = evento.usuario.nome;
        tdEmail.innerText = evento.usuario.email;
        tdStatus.innerText =
          evento.status === "C"
            ? "Check-in realizado"
            : "Inscrito/Não compareceu";

        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        tr.appendChild(tdStatus);
        corpoTabela.appendChild(tr);
      }
    }
  } else {
    alert("");
  }
}

listarInscritos(id);

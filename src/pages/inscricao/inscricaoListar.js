let corpoTabela = document.getElementById("corpo-tabela");

let authorization = localStorage.getItem("Authorization");
let role = localStorage.getItem("Role");
let idUsuario = localStorage.getItem("IdUser");

async function buscarInscricoes() {
  let resposta = await fetch("http://localhost:3000/inscricao");
  let inscricoes = await resposta.json();

  for (let inscricao of inscricoes) {
    if (idUsuario == inscricao.id_usuario) {
      console.log(inscricao);
      let tr = document.createElement("tr");
      let tdUsuario = document.createElement("td");
      let tdEvento = document.createElement("td");
      let tdStatus = document.createElement("td");
      let tdAcoes = document.createElement("td");

      tdUsuario.innerText = inscricao.usuario.nome;
      tdEvento.innerText = inscricao.evento.titulo;
      tdStatus.innerText = inscricao.status;

      tdAcoes.innerHTML += `
        <a class="btn btn-outline-primary btn-sm" href="formulario.html?id=${inscricao.id}">Fazer Check-in</a>
        <button class="btn btn-outline-danger btn-sm" onclick="excluir(${inscricao.id})">Cancelar Inscrição</button>
      `;

      tdAcoes.classList = "text-center";
      tr.appendChild(tdUsuario);
      tr.appendChild(tdEvento);
      tr.appendChild(tdStatus);
      tr.appendChild(tdAcoes);

      corpoTabela.appendChild(tr);
    }
  }
}

async function excluir(id) {
  let confirma = confirm(
    "Deseja cancelar sua inscrição? Esta ação não pode ser revertida."
  );
  if (confirma) {
    await fetch("http://localhost:3000/inscricao/" + id, {
      method: "DELETE",
    });

    window.location.reload();
  }
}

buscarInscricoes();

function download(content, mimeType, filename) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}

async function exportPdf() {
  let pdf = await fetch("http://localhost:3000/inscricoespdf", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await pdf.blob(), "application/x-pdf", "ListaInscricoes.pdf");
}

async function exportCsv() {
  let csv = await fetch("http://localhost:3000/inscricoescsv", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await csv.text(), "text/csv", "ListaInscricoes.csv");
}

let corpoTabela = document.getElementById("corpo-tabela");

async function buscarEventos() {
  let resposta = await fetch("http://localhost:3000/evento");
  let eventos = await resposta.json();

  for (let evento of eventos) {
    let tr = document.createElement("tr");
    let tdDescricao = document.createElement("td");
    let tdDataInicio = document.createElement("td");
    let tdDataFim = document.createElement("td");
    let tdHoraInicio = document.createElement("td");
    let tdHoraFim = document.createElement("td");
    let tdLocal = document.createElement("td");
    let tdCidade = document.createElement("td");
    let tdAcoes = document.createElement("td");

    tdDescricao.innerText = evento.descricao;
    tdDataInicio.innerText = evento.dataInicio;
    tdDataFim.innerText = evento.dataFim;
    tdHoraInicio.innerText = evento.horaInicio;
    tdHoraFim.innerText = evento.horaFim;
    tdLocal.innerText = evento.local;
    tdCidade.innerText = evento.cidade.nome;

    tdAcoes.innerHTML = `
      <a class="btn btn-outline-primary btn-sm" href="formulario.html?id=${evento.id}">Editar</a>
      <button class="btn btn-outline-danger btn-sm" onclick="excluir(${evento.id})">Excluir</button>
    `;

    tdAcoes.classList = "text-center";
    tr.appendChild(tdDescricao);
    tr.appendChild(tdDataInicio);
    tr.appendChild(tdDataFim);
    tr.appendChild(tdHoraInicio);
    tr.appendChild(tdHoraFim);
    tr.appendChild(tdLocal);
    tr.appendChild(tdCidade);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
}

async function excluir(id) {
  let confirma = confirm(
    "Deseja excluir esse cliente? Esta ação não pode ser revertida."
  );
  if (confirma) {
    await fetch("http://localhost:3000/evento/" + id, {
      method: "DELETE",
    });

    window.location.reload();
  }
}

buscarEventos();

function download(content, mimeType, filename) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}

async function exportPdf() {
  let pdf = await fetch("http://localhost:3000/eventoPdf", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await pdf.blob(), "application/x-pdf", "ListaEventos.pdf");
}

async function exportCsv() {
  let csv = await fetch("http://localhost:3000/eventoCsv", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await csv.text(), "text/csv", "ListaEventos.csv");
}

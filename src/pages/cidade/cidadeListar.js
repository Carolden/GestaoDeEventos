let corpoTabela = document.getElementById("corpo-tabela");

async function buscarCidades() {
  let resposta = await fetch("http://localhost:3000/cidade");
  let cidades = await resposta.json();

  for (let cidade of cidades) {
    let tr = document.createElement("tr");
    let tdNome = document.createElement("td");
    let tdAcoes = document.createElement("td");

    tdNome.innerText = cidade.nome;
    tdAcoes.innerHTML = `
      <a class="btn btn-outline-primary btn-sm" href="formulario.html?id=${cidade.id}">Editar</a>
      <button class="btn btn-outline-danger btn-sm" onclick="excluir(${cidade.id})">Excluir</button>
    `;

    tdAcoes.classList = "text-center";
    tr.appendChild(tdNome);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
}

async function excluir(id) {
  let confirma = confirm(
    "Deseja excluir essa Cidade? Esta ação não pode ser revertida."
  );
  if (confirma) {
    await fetch("http://localhost:3000/cidade/" + id, {
      method: "DELETE",
    });

    window.location.reload();
  }
}

buscarCidades();

function download(content, mimeType, filename) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}

async function exportPdf() {
  let pdf = await fetch("http://localhost:3000/cidadepdf", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await pdf.blob(), "application/x-pdf", "ListaCidade.pdf");
}

async function exportCsv() {
  let csv = await fetch("http://localhost:3000/cidadecsv", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await csv.text(), "text/csv", "ListaCidade.csv");
}

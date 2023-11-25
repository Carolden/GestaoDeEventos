let corpoTabela = document.getElementById("corpo-tabela");

async function buscarAdmins() {
  let resposta = await fetch("http://localhost:3000/admin");
  let admins = await resposta.json();

  for (let admin of admins) {
    let tr = document.createElement("tr");
    let tdNome = document.createElement("td");
    let tdEmail = document.createElement("td");
    let tdSenha = document.createElement("td");
    let tdAcoes = document.createElement("td");

    tdNome.innerText = admin.nome;
    tdEmail.innerText = admin.email;
    tdSenha.innerText = admin.senha;

    tdAcoes.innerHTML = `
      <a class="btn btn-outline-primary btn-sm" href="formulario.html?id=${admin.id}">Editar</a>
      <button class="btn btn-outline-danger btn-sm" onclick="excluir(${admin.id})">Excluir</button>
    `;

    tdAcoes.classList = "text-center";
    tr.appendChild(tdNome);
    tr.appendChild(tdEmail);
    tr.appendChild(tdSenha);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
}

async function excluir(id) {
  let confirma = confirm(
    "Deseja excluir esse cliente? Esta ação não pode ser revertida."
  );
  if (confirma) {
    await fetch("http://localhost:3000/admin/" + id, {
      method: "DELETE",
    });

    window.location.reload();
  }
}

buscarAdmins();

function download(content, mimeType, filename) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}

async function exportPdf() {
  let pdf = await fetch("http://localhost:3000/adminpdf", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await pdf.blob(), "application/x-pdf", "ListaAdmins.pdf");
}

async function exportCsv() {
  let csv = await fetch("http://localhost:3000/admincsv", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await csv.text(), "text/csv", "ListaAdmins.csv");
}

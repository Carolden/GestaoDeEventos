let corpoTabela = document.getElementById('corpo-tabela');

async function buscarUsuarios () {
  let resposta = await fetch('http://localhost:3000/usuario');
  let usuarios = await resposta.json();

  for (let usuario of usuarios) {
    let tr = document.createElement('tr');
    let tdNome = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdCPF = document.createElement('td');
    let tdTelefone = document.createElement('td');
    // let tdEndereco = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdNome.innerText = usuario.nome;
    tdEmail.innerText = usuario.email;
    tdCPF.innerText = usuario.cpf;
    tdTelefone.innerText = usuario.telefone;
    // tdEndereco.innerText = tdEndereco.endereco;

    tdAcoes.innerHTML = `
      <a class="btn btn-outline-primary btn-sm" href="formulario.html?id=${usuario.id}">Editar</a>
      <button class="btn btn-outline-danger btn-sm" onclick="excluir(${usuario.id})">Excluir</button>
    `;

    tdAcoes.classList = "text-center";
    tr.appendChild(tdNome);
    tr.appendChild(tdEmail);
    tr.appendChild(tdCPF);
    tr.appendChild(tdTelefone);
    // tr.appendChild(tdEndereco);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
  }
}

async function excluir (id) {
  let confirma = confirm("Deseja excluir esse cliente? Esta ação não pode ser revertida.")
  if(confirma) {
    await fetch('http://localhost:3000/usuario/' + id, {
    method: 'DELETE'
  });

  window.location.reload();
  }

}

buscarUsuarios();

function download(content, mimeType, filename) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}

async function exportPdf() {
  let pdf = await fetch("http://localhost:3000/usuariopdf", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await pdf.blob(), "application/x-pdf", "ListaUsuarios.pdf");
}

async function exportCsv() {
  let csv = await fetch("http://localhost:3000/usuariocsv", {
    headers: {
      "Content-type": "application/json",
      Acccept: "appplication/json",
      // Authorization: authorization,
    },
  });
  download(await csv.text(), "text/csv", "ListaUsuarios.csv");
}

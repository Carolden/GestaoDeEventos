document.getElementById("form").addEventListener("submit", async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  let payload = {
    email,
    senha,
  };

  let url = "http://localhost:3000/usuario/login";
  let method = "POST";

  let resposta = await fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (resposta.ok) {
    let dados = await resposta.json();
    let authorization = `${dados.type} ${dados.token}`;
    let role = `${dados.role}`;
    let idUser = `${dados.idUsuario}`;
    localStorage.setItem("Authorization", authorization);
    localStorage.setItem("Role", role);
    if (dados.idUsuario != undefined) {
      localStorage.setItem("IdUser", idUser);
    }

    window.location.href = "./../home/index.html";
  } else {
    alert("Usuário ou senha incorretos!");
  }
});

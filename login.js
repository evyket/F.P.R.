document.getElementById('login-form').addEventListener ('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email && password) {
    alert('Login realizado com sucesso!');
    
  } else {
    alert('Por favor, preencha todos os campos.');
  }
});

document.getElementById('cadastroForm').addEventListener ('submit', function(e) {
  e.preventDefault(); 

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  
  console.log("Nome:", nome);
  console.log("Email:", email);
  console.log("Senha:", senha);

 
});

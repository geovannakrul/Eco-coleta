// =========================================================================
// PARTE 1: BACK-END SIMPLES EM MEMÓRIA (Campo Mourão - PR)
// =========================================================================
var usuarioLogado = null;




// Endereços oficiais dos pontos de coleta em Campo Mourão - PR
var enderecosPontos = {
  "Praça do Fórum": "Av. José Custódio de Oliveira, 2065 - Centro, Campo Mourão - PR",
  "Centro Social Urbano": "Rua São Josafat, 1085 - Vila Urupês, Campo Mourão - PR",
  "Bosque": "Av. Comendador Norberto Marcondes, s/n - Centro, Campo Mourão - PR"
};




var usuariosCadastrados = [
  {
      nome: "Usuário Teste",
      email: "teste@ecocoleta.com",
      senha: "123456"
  }
];




var agendamentos = [];




var comentarios = [
  {
      autor: "Mariana Silva",
      texto: "Muito legal essa iniciativa aqui em Campo Mourão! Já separei minhas garrafas PET para levar no Bosque.",
      data: "19/11/2026"
  }
];




// =========================================================================
// PARTE 2: NAVEGAÇÃO ENTRE TELAS E LOGIN
// =========================================================================
function mostrarTela(idTela) {
  document.getElementById("telaInicio").style.display = "none";
  document.getElementById("telaLogin").style.display = "none";
  document.getElementById("conteudoPrincipal").style.display = "none";
  document.getElementById("telaConfirmacao").style.display = "none";




  document.getElementById(idTela).style.display = "block";
  window.scrollTo(0, 0);
}




function trocarSubtelaLogin(idSubtela) {
  document.getElementById("boxEntrar").style.display = "none";
  document.getElementById("boxCadastrar").style.display = "none";
  document.getElementById("boxRecuperar").style.display = "none";




  document.getElementById("msgLogin").style.display = "none";
  document.getElementById("msgCadastro").style.display = "none";
  document.getElementById("msgRecuperar").style.display = "none";




  document.getElementById(idSubtela).style.display = "block";
}




function alternarSenha(idCampo) {
  var campo = document.getElementById(idCampo);
  campo.type = (campo.type === "password") ? "text" : "password";
}




function alternarSenhasCadastro() {
  alternarSenha("cadSenha");
  alternarSenha("cadConfirmar");
}




function exibirAlerta(idElemento, texto, tipo) {
  var caixa = document.getElementById(idElemento);
  caixa.textContent = texto;
  caixa.className = "mensagem-alerta " + tipo;
  caixa.style.display = "block";
}




function fazerLogin(event) {
  event.preventDefault();




  var email = document.getElementById("loginEmail").value;
  var senha = document.getElementById("loginSenha").value;
  var encontrado = null;




  for (var i = 0; i < usuariosCadastrados.length; i++) {
      if (usuariosCadastrados[i].email === email && usuariosCadastrados[i].senha === senha) {
          encontrado = usuariosCadastrados[i];
          break;
      }
  }




  if (encontrado) {
      usuarioLogado = encontrado;
      document.getElementById("nomeUsuarioTopo").textContent = usuarioLogado.nome;
    
      document.getElementById("nome").value = usuarioLogado.nome;
      document.getElementById("autor").value = usuarioLogado.nome;




      document.getElementById("loginSenha").value = "";
      document.getElementById("msgLogin").style.display = "none";




      mostrarTela("conteudoPrincipal");
      mostrarComentariosNaTela();
  } else {
      exibirAlerta("msgLogin", "❌ E-mail ou senha incorretos.", "erro");
  }
}




function cadastrarUsuario(event) {
  event.preventDefault();




  var nome = document.getElementById("cadNome").value;
  var email = document.getElementById("cadEmail").value;
  var senha = document.getElementById("cadSenha").value;
  var confirmar = document.getElementById("cadConfirmar").value;




  if (senha !== confirmar) {
      exibirAlerta("msgCadastro", "❌ As duas senhas não conferem!", "erro");
      return;
  }




  for (var i = 0; i < usuariosCadastrados.length; i++) {
      if (usuariosCadastrados[i].email === email) {
          exibirAlerta("msgCadastro", "❌ Este e-mail já está cadastrado!", "erro");
          return;
      }
  }




  usuariosCadastrados.push({ nome: nome, email: email, senha: senha });




  document.getElementById("cadNome").value = "";
  document.getElementById("cadEmail").value = "";
  document.getElementById("cadSenha").value = "";
  document.getElementById("cadConfirmar").value = "";




  trocarSubtelaLogin("boxEntrar");
  document.getElementById("loginEmail").value = email;
  exibirAlerta("msgLogin", "✅ Conta criada com sucesso! Digite sua senha para entrar.", "sucesso");
}




function recuperarSenha(event) {
  event.preventDefault();




  var email = document.getElementById("recEmail").value;
  var existe = false;




  for (var i = 0; i < usuariosCadastrados.length; i++) {
      if (usuariosCadastrados[i].email === email) {
          existe = true;
          break;
      }
  }




  if (existe) {
      exibirAlerta("msgRecuperar", "📧 Link de redefinição enviado para " + email + ".", "sucesso");
  } else {
      exibirAlerta("msgRecuperar", "❌ E-mail não encontrado no sistema.", "erro");
  }
}




function sairDaConta() {
  usuarioLogado = null;
  trocarSubtelaLogin("boxEntrar");
  mostrarTela("telaInicio");
}




// =========================================================================
// PARTE 3: SIMULADOR, MAPA DE CAMPO MOURÃO, AGENDAMENTO E COMENTÁRIOS
// =========================================================================
function travarLimite100(campo) {
  if (Number(campo.value) > 100) {
      alert("O limite máximo permitido é de 100 kg!");
      campo.value = 100;
  }
}




function mostrarNoMapa(nomeDoLocal) {
  if (nomeDoLocal === "" || !enderecosPontos[nomeDoLocal]) return;




  var enderecoExato = enderecosPontos[nomeDoLocal];
  document.getElementById("legendaMapa").textContent = "🗺️ Exibindo: " + nomeDoLocal + " — " + enderecoExato;




  var buscaCompleta = nomeDoLocal + ", " + enderecoExato;
  var linkMapa = "https://maps.google.com/maps?q=" + encodeURIComponent(buscaCompleta) + "&t=&z=16&ie=UTF8&iwloc=&output=embed";
  document.getElementById("mapaColeta").src = linkMapa;
}




function calcularPontos() {
  var material = document.getElementById("tipoMaterial").value;
  var peso = Number(document.getElementById("pesoMaterial").value);
  var pontosPorKg = 0;




  if (peso <= 0 || isNaN(peso)) {
      alert("Por favor, digite um peso maior que zero!");
      return;
  }




  if (material === "papel") pontosPorKg = 10;
  else if (material === "plastico") pontosPorKg = 15;
  else if (material === "metal") pontosPorKg = 20;
  else if (material === "vidro") pontosPorKg = 25;




  var total = peso * pontosPorKg;
  document.getElementById("resultadoPontos").textContent = "🎉 Você vai ganhar: " + total + " pontos!";
}




function confirmarAgendamento(event) {
  event.preventDefault();




  var nome = document.getElementById("nome").value;
  var endereco = document.getElementById("endereco").value;
  var local = document.getElementById("local").value;
  var dataEscolhida = document.getElementById("dataAgendamento").value;




  var protocolo = "ECO-" + (1001 + agendamentos.length);
  var enderecoPontoEscolhido = enderecosPontos[local];




  var partes = dataEscolhida.split("-");
  var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];




  var novoAgendamento = {
      protocolo: protocolo,
      nome: nome,
      endereco: endereco,
      local: local,
      enderecoPonto: enderecoPontoEscolhido,
      data: dataFormatada
  };




  agendamentos.push(novoAgendamento);




  document.getElementById("resProtocolo").textContent = novoAgendamento.protocolo;
  document.getElementById("resNome").textContent = novoAgendamento.nome;
  document.getElementById("resEndereco").textContent = novoAgendamento.endereco;
  document.getElementById("resLocal").textContent = novoAgendamento.local;
  document.getElementById("resEnderecoPonto").textContent = novoAgendamento.enderecoPonto;
  document.getElementById("resData").textContent = novoAgendamento.data;




  document.getElementById("endereco").value = "";
  document.getElementById("local").value = "";
  document.getElementById("dataAgendamento").value = "";




  mostrarTela("telaConfirmacao");
}




function mostrarComentariosNaTela() {
  var area = document.getElementById("listaComentarios");
  area.innerHTML = "<h3 style='margin-top: 25px;'>Comentários da Comunidade:</h3>";




  for (var i = 0; i < comentarios.length; i++) {
      var item = comentarios[i];
      var div = document.createElement("div");
      div.className = "comentario-item";
      div.innerHTML = "<b>" + item.autor + "</b> <span class='data-comentario'>(" + item.data + ")</span><p>" + item.texto + "</p>";
      area.appendChild(div);
  }
}




function adicionarComentario(event) {
  event.preventDefault();




  var autor = document.getElementById("autor").value;
  var texto = document.getElementById("texto").value;
  var hoje = new Date().toLocaleDateString("pt-BR");




  comentarios.push({
      autor: autor,
      texto: texto,
      data: hoje
  });




  document.getElementById("texto").value = "";
  mostrarComentariosNaTela();
}
</script>




</body>
</html>







js
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Coleta Seletiva - EcoColeta Campo Mourão</title>
<style>
body {
 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 background: linear-gradient(180deg, #e3f2e6 0%, #f4f8f5 100%);
 color: #2c3e50;
 margin: 0;
 padding: 20px;
 min-height: 100vh;
 box-sizing: border-box;
}


.tela {
 max-width: 700px;
 margin: 25px auto;
 background-color: #ffffff;
 padding: 35px;
 border-radius: 16px;
 border: 1px solid #e1efe3;
 box-shadow: 0 10px 25px rgba(27, 94, 32, 0.08);
}


.tela-login-box {
 max-width: 420px;
 margin: 40px auto;
 background-color: #ffffff;
 padding: 40px 35px;
 border-radius: 16px;
 border: 1px solid #e1efe3;
 box-shadow: 0 10px 30px rgba(27, 94, 32, 0.12);
}


#telaLogin, #conteudoPrincipal, #telaConfirmacao {
 display: none;
}


#telaInicio, #telaConfirmacao {
 text-align: center;
}


#telaInicio {
 padding: 50px 35px;
}


.icone-destaque {
 font-size: 46px;
 background-color: #e8f5e9;
 width: 86px;
 height: 86px;
 line-height: 86px;
 border-radius: 50%;
 margin: 0 auto 18px auto;
 text-align: center;
 box-shadow: 0 4px 10px rgba(46, 125, 50, 0.15);
}


.frase-efeito {
 background-color: #f6fbf7;
 border-left: 4px solid #2e7d32;
 padding: 15px 20px;
 border-radius: 8px;
 color: #4a5d4e;
 font-style: italic;
 margin: 25px 0;
 line-height: 1.6;
}


header {
 background: linear-gradient(135deg, #1b5e20, #2e7d32);
 color: white;
 text-align: center;
 padding: 25px 20px;
 border-radius: 12px;
 box-shadow: 0 6px 15px rgba(27, 94, 32, 0.2);
}


header h1 {
 color: white;
 margin: 0;
 font-size: 32px;
 letter-spacing: 0.5px;
}


header p {
 margin: 6px 0 0 0;
 font-size: 16px;
 opacity: 0.9;
}


.barra-usuario {
 display: flex;
 justify-content: space-between;
 align-items: center;
 background-color: #f1f8e9;
 border: 1px solid #c8e6c9;
 padding: 10px 16px;
 border-radius: 10px;
 margin-bottom: 20px;
 font-size: 14px;
}


.btn-sair-topo {
 background: #ffffff;
 color: #c62828;
 border: 1px solid #ef9a9a;
 padding: 6px 14px;
 border-radius: 6px;
 font-size: 13px;
 font-weight: bold;
 cursor: pointer;
 margin: 0;
 box-shadow: none;
}


.btn-sair-topo:hover {
 background: #ffebee;
 transform: none;
 box-shadow: none;
}


h1, h2, h3 {
 color: #1b5e20;
}


h2 {
 border-bottom: 2px solid #e8f5e9;
 padding-bottom: 8px;
 margin-top: 30px;
}


table {
 width: 100%;
 border-collapse: collapse;
 margin-top: 15px;
 border-radius: 10px;
 overflow: hidden;
 box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}


th, td {
 padding: 14px 16px;
 text-align: left;
 border-bottom: 1px solid #edf5ee;
}


th {
 background-color: #e8f5e9;
 color: #1b5e20;
 font-weight: 600;
}


tr:hover {
 background-color: #f9fdf9;
}


.etiqueta-pontos {
 background-color: #e8f5e9;
 color: #1b5e20;
 padding: 5px 12px;
 border-radius: 20px;
 font-weight: bold;
 font-size: 14px;
}


.caixa-destaque {
 background-color: #f6fbf7;
 border: 1px solid #cde4d0;
 padding: 20px;
 border-radius: 12px;
 margin-top: 20px;
}


.caixa-destaque h3 {
 margin-top: 0;
}


.card-local {
 background-color: #f9fcf9;
 border: 1px solid #dcebdc;
 border-left: 5px solid #2e7d32;
 padding: 14px 16px;
 border-radius: 8px;
 margin-bottom: 10px;
 cursor: pointer;
 display: flex;
 justify-content: space-between;
 align-items: center;
 gap: 12px;
 transition: 0.2s;
}


.card-local:hover {
 background-color: #e8f5e9;
 transform: translateX(4px);
}


.endereco-texto {
 font-size: 13px;
 color: #546e7a;
 margin-top: 4px;
}


.tag-mapa {
 background-color: #2e7d32;
 color: white;
 font-size: 12px;
 padding: 6px 12px;
 border-radius: 12px;
 font-weight: bold;
 white-space: nowrap;
}


.caixa-mapa {
 margin-top: 12px;
 border-radius: 12px;
 overflow: hidden;
 border: 2px solid #2e7d32;
 box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}


.caixa-comprovante {
 background-color: #f6fbf7;
 border: 2px dashed #2e7d32;
 padding: 22px;
 border-radius: 12px;
 text-align: left;
 margin: 25px 0;
}


.caixa-comprovante p {
 margin: 10px 0;
 font-size: 16px;
 border-bottom: 1px solid #e3efe5;
 padding-bottom: 6px;
}


.caixa-comprovante p:last-child {
 border-bottom: none;
 padding-bottom: 0;
}


label {
 display: block;
 margin-top: 14px;
 font-weight: 600;
 color: #34495e;
 font-size: 14px;
}


input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="date"],
select,
textarea {
 width: 100%;
 padding: 12px 14px;
 margin-top: 6px;
 border: 1.5px solid #d5e5d6;
 border-radius: 8px;
 box-sizing: border-box;
 font-size: 15px;
 font-family: inherit;
 transition: 0.25s;
}


input:focus, select:focus, textarea:focus {
 border-color: #2e7d32;
 background-color: #fcfffc;
 outline: none;
 box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
}


button {
 background: linear-gradient(135deg, #2e7d32, #388e3c);
 color: white;
 padding: 13px 25px;
 border: none;
 border-radius: 8px;
 cursor: pointer;
 font-size: 16px;
 font-weight: bold;
 margin-top: 18px;
 box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
 transition: 0.25s;
}


button:hover {
 background: linear-gradient(135deg, #1b5e20, #2e7d32);
 transform: translateY(-2px);
 box-shadow: 0 6px 15px rgba(46, 125, 50, 0.35);
}


.botao-secundario {
 background: #607d8b;
 box-shadow: 0 4px 10px rgba(96, 125, 139, 0.2);
 margin-left: 8px;
}


.botao-secundario:hover {
 background: #455a64;
 box-shadow: 0 6px 14px rgba(96, 125, 139, 0.3);
}


.linha-opcoes-login {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-top: 12px;
 font-size: 14px;
}


.checkbox-area {
 display: flex;
 align-items: center;
 gap: 6px;
 cursor: pointer;
 color: #3c4043;
 margin-top: 0;
 font-weight: normal;
}


.checkbox-area input {
 width: 16px;
 height: 16px;
 margin: 0;
 accent-color: #2e7d32;
 cursor: pointer;
}


.link-acao {
 background: none;
 border: none;
 color: #2e7d32;
 font-weight: 600;
 font-size: 14px;
 padding: 0;
 margin: 0;
 box-shadow: none;
 cursor: pointer;
}


.link-acao:hover {
 background: none;
 text-decoration: underline;
 color: #1b5e20;
 transform: none;
 box-shadow: none;
}


.rodape-login {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-top: 25px;
}


.rodape-login button[type="submit"] {
 margin-top: 0;
}


.mensagem-alerta {
 padding: 10px 14px;
 border-radius: 8px;
 font-size: 14px;
 margin-bottom: 15px;
 display: none;
}


.erro {
 background-color: #fdecea;
 color: #b71c1c;
 border: 1px solid #f5c6cb;
}


.sucesso {
 background-color: #e8f5e9;
 color: #1b5e20;
 border: 1px solid #c8e6c9;
}


.comentario-item {
 background-color: #f6fbf7;
 border: 1px solid #e0efe2;
 border-left: 5px solid #2e7d32;
 padding: 14px 16px;
 margin-top: 12px;
 border-radius: 8px;
}


.comentario-item p {
 margin: 6px 0 0 0;
 color: #444;
}


.data-comentario {
 font-size: 12px;
 color: #7f8c8d;
 margin-left: 8px;
}


hr {
 border: none;
 border-top: 1px solid #e1efe3;
 margin: 30px 0;
}


footer {
 text-align: center;
 margin-top: 30px;
 padding-top: 15px;
 border-top: 1px solid #edf5ee;
 font-size: 13px;
 color: #7f8c8d;
}
</style>
</head>
<body>


<!-- TELA 1: BOAS-VINDAS -->
<div id="telaInicio" class="tela">
 <div class="icone-destaque">🌿</div>
 <h1>Seja Bem-vindo!</h1>
 <p style="color: #555; font-size: 18px; margin-top: -8px;">Plataforma Oficial <b>EcoColeta — Campo Mourão</b></p>
 <div class="frase-efeito">
   "Cuidar do meio ambiente é entender que cada pedaço de papel, plástico ou metal que reciclamos hoje é um pedaço de futuro que garantimos para as próximas gerações."
 </div>
 <button onclick="mostrarTela('telaLogin')">Acessar o Sistema</button>
</div>


<!-- TELA 2: LOGIN, CADASTRO E RECUPERAÇÃO -->
<div id="telaLogin" class="tela-login-box">


 <!-- Subtela 2A: Fazer Login -->
 <div id="boxEntrar">
   <div style="text-align: center; margin-bottom: 24px;">
     <div class="icone-destaque" style="width: 72px; height: 72px; line-height: 72px; font-size: 36px;">🔐</div>
     <h1 style="margin: 0; font-size: 24px;">Fazer login</h1>
     <p style="margin: 6px 0 0 0; color: #5f6368; font-size: 15px;">Use sua Conta <b>EcoColeta</b></p>
   </div>


   <div id="msgLogin" class="mensagem-alerta"></div>


   <form onsubmit="fazerLogin(event)">
     <label for="loginEmail">E-mail</label>
     <input type="email" id="loginEmail" required placeholder="seuemail@exemplo.com">


     <label for="loginSenha">Digite sua senha</label>
     <input type="password" id="loginSenha" required placeholder="••••••••">


     <div class="linha-opcoes-login">
       <label class="checkbox-area">
         <input type="checkbox" onclick="alternarSenha('loginSenha')">
         Mostrar senha
       </label>
       <button type="button" class="link-acao" onclick="trocarSubtelaLogin('boxRecuperar')">
         Esqueceu a senha?
       </button>
     </div>


     <div class="rodape-login">
       <button type="button" class="link-acao" onclick="trocarSubtelaLogin('boxCadastrar')">
         Criar conta
       </button>
       <button type="submit">Entrar</button>
     </div>
   </form>
 </div>


 <!-- Subtela 2B: Criar Nova Conta -->
 <div id="boxCadastrar" style="display: none;">
   <div style="text-align: center; margin-bottom: 24px;">
     <div class="icone-destaque" style="width: 72px; height: 72px; line-height: 72px; font-size: 36px;">♻️</div>
     <h1 style="margin: 0; font-size: 24px;">Criar sua Conta</h1>
     <p style="margin: 6px 0 0 0; color: #5f6368; font-size: 15px;">Cadastre-se para agendar suas coletas</p>
   </div>


   <div id="msgCadastro" class="mensagem-alerta"></div>


   <form onsubmit="cadastrarUsuario(event)">
     <label for="cadNome">Nome completo</label>
     <input type="text" id="cadNome" required placeholder="Digite seu nome">


     <label for="cadEmail">Seu e-mail</label>
     <input type="email" id="cadEmail" required placeholder="seuemail@exemplo.com">


     <label for="cadSenha">Crie uma senha (mínimo 6 caracteres)</label>
     <input type="password" id="cadSenha" required minlength="6" placeholder="Crie uma senha">


     <label for="cadConfirmar">Confirme a senha</label>
     <input type="password" id="cadConfirmar" required minlength="6" placeholder="Repita a senha">


     <div class="linha-opcoes-login">
       <label class="checkbox-area">
         <input type="checkbox" onclick="alternarSenhasCadastro()">
         Mostrar senhas
       </label>
     </div>


     <div class="rodape-login">
       <button type="button" class="link-acao" onclick="trocarSubtelaLogin('boxEntrar')">
         Já tenho conta
       </button>
       <button type="submit">Cadastrar</button>
     </div>
   </form>
 </div>


 <!-- Subtela 2C: Recuperar Senha -->
 <div id="boxRecuperar" style="display: none;">
   <div style="text-align: center; margin-bottom: 24px;">
     <div class="icone-destaque" style="width: 72px; height: 72px; line-height: 72px; font-size: 36px;">🔑</div>
     <h1 style="margin: 0; font-size: 24px;">Recuperar acesso</h1>
     <p style="margin: 6px 0 0 0; color: #5f6368; font-size: 15px;">Informe seu e-mail cadastrado</p>
   </div>


   <div id="msgRecuperar" class="mensagem-alerta"></div>


   <form onsubmit="recuperarSenha(event)">
     <label for="recEmail">E-mail da conta</label>
     <input type="email" id="recEmail" required placeholder="seuemail@exemplo.com">


     <div class="rodape-login">
       <button type="button" class="link-acao" onclick="trocarSubtelaLogin('boxEntrar')">
         Voltar ao login
       </button>
       <button type="submit">Enviar</button>
     </div>
   </form>
 </div>


</div>


<!-- TELA 3: SISTEMA PRINCIPAL ECOCOLETA -->
<div id="conteudoPrincipal" class="tela">
 <div class="barra-usuario">
   <span>👤 Olá, <b id="nomeUsuarioTopo">Visitante</b>!</span>
   <button type="button" class="btn-sair-topo" onclick="sairDaConta()">Sair da conta</button>
 </div>


 <header>
   <h1>♻️ EcoColeta</h1>
   <p>Campo Mourão - PR • Ambiente limpo, futuro melhor!</p>
 </header>


 <h2>1. Pontuação por Material</h2>
 <p>Veja quantos pontos você ganha a cada 1kg do material entregue:</p>
 <table>
   <tr>
     <th>Material</th>
     <th>Pontos por KG</th>
   </tr>
   <tr>
     <td>📄 Papel / Papelão</td>
     <td><span class="etiqueta-pontos">10 pontos</span></td>
   </tr>
   <tr>
     <td>🥤 Plástico (PET/PVC)</td>
     <td><span class="etiqueta-pontos">15 pontos</span></td>
   </tr>
   <tr>
     <td>🥫 Metal / Alumínio</td>
     <td><span class="etiqueta-pontos">20 pontos</span></td>
   </tr>
   <tr>
     <td>🫙 Vidro</td>
     <td><span class="etiqueta-pontos">25 pontos</span></td>
   </tr>
 </table>


 <div class="caixa-destaque">
   <h3>🧮 Simulador de Pontos (Limite de 100 kg)</h3>
   <p style="margin-top: -5px; font-size: 14px; color: #555;">Calcule seus pontos antes de levar seus recicláveis (máximo <b>100 kg</b>):</p>
  
   <label for="tipoMaterial">Escolha o Material:</label>
   <select id="tipoMaterial">
     <option value="papel">Papel / Papelão (10 pts/kg)</option>
     <option value="plastico">Plástico (15 pts/kg)</option>
     <option value="metal">Metal / Alumínio (20 pts/kg)</option>
     <option value="vidro">Vidro (25 pts/kg)</option>
   </select>


   <label for="pesoMaterial">Peso aproximado (em KG - Máximo 100 kg):</label>
   <input type="number" id="pesoMaterial" placeholder="Ex: 5" min="1" max="100" oninput="travarLimite100(this)">


   <button type="button" onclick="calcularPontos()">Calcular Pontos</button>
   <p id="resultadoPontos" style="font-weight: bold; color: #1b5e20; margin-top: 12px; font-size: 16px;"></p>
 </div>


 <h2>2. Pontos de Encontro em Campo Mourão - PR</h2>
 <p>Clique em um dos pontos abaixo para visualizar o endereço exato no mapa (atendimento das 08h às 17h):</p>
  <div class="card-local" onclick="mostrarNoMapa('Praça do Fórum')">
   <div>
     <b>📍 Praça do Fórum (Fórum de Campo Mourão)</b>
     <div class="endereco-texto">Av. José Custódio de Oliveira, 2065 - Centro, Campo Mourão - PR</div>
   </div>
   <span class="tag-mapa">🗺️ Ver no Mapa</span>
 </div>


 <div class="card-local" onclick="mostrarNoMapa('Centro Social Urbano')">
   <div>
     <b>📍 Centro Social Urbano (CSU)</b>
     <div class="endereco-texto">Rua São Josafat, 1085 - Vila Urupês, Campo Mourão - PR</div>
   </div>
   <span class="tag-mapa">🗺️ Ver no Mapa</span>
 </div>


 <div class="card-local" onclick="mostrarNoMapa('Bosque')">
   <div>
     <b>📍 Bosque (Parque Municipal Joaquim Teodoro de Oliveira)</b>
     <div class="endereco-texto">Av. Comendador Norberto Marcondes, s/n - Centro, Campo Mourão - PR</div>
   </div>
   <span class="tag-mapa">🗺️ Ver no Mapa</span>
 </div>


 <p id="legendaMapa" style="font-size: 14px; color: #1b5e20; font-weight: bold; margin-top: 15px;">
   🗺️ Exibindo: Praça do Fórum — Av. José Custódio de Oliveira, 2065 - Centro, Campo Mourão - PR
 </p>
 <div class="caixa-mapa">
   <iframe
     id="mapaColeta"
     width="100%"
     height="280"
     style="border:0; display: block;"
     loading="lazy"
     src="https://maps.google.com/maps?q=Pra%C3%A7a%20do%20F%C3%B3rum%2C%20Av.%20Jos%C3%A9%20Cust%C3%B3dio%20de%20Oliveira%2C%202065%20-%20Centro%2C%20Campo%20Mour%C3%A3o%20-%20PR&t=&z=16&ie=UTF8&iwloc=&output=embed">
   </iframe>
 </div>


 <h2>3. Faça seu Agendamento</h2>
 <form onsubmit="confirmarAgendamento(event)">
   <label for="nome">Nome Completo:</label>
   <input type="text" id="nome" required placeholder="Digite seu nome completo">


   <label for="endereco">Seu Endereço Completo (Campo Mourão - PR):</label>
   <input type="text" id="endereco" required placeholder="Rua, número e bairro">


   <label for="local">Escolha o Ponto de Coleta:</label>
   <select id="local" required onchange="mostrarNoMapa(this.value)">
     <option value="">-- Selecione um local --</option>
     <option value="Praça do Fórum">Praça do Fórum — Av. José Custódio de Oliveira, 2065 (Centro)</option>
     <option value="Centro Social Urbano">Centro Social Urbano — Rua São Josafat, 1085 (Vila Urupês)</option>
     <option value="Bosque">Bosque Municipal — Av. Comendador Norberto Marcondes (Centro)</option>
   </select>


   <label for="dataAgendamento">📅 Escolha a Data no Calendário:</label>
   <input type="date" id="dataAgendamento" required>


   <button type="submit">Confirmar Agendamento</button>
 </form>


 <hr>


 <h2>4. Deixe seu Comentário</h2>
 <form onsubmit="adicionarComentario(event)">
   <label for="autor">Seu Nome:</label>
   <input type="text" id="autor" required placeholder="Digite seu nome">


   <label for="texto">Comentário ou Sugestão:</label>
   <textarea id="texto" rows="3" required placeholder="Escreva sua mensagem aqui..."></textarea>


   <button type="submit">Publicar Comentário</button>
 </form>


 <div id="listaComentarios"></div>


 <footer>
   <p>Projeto EcoColeta • Campo Mourão - Paraná</p>
 </footer>
</div>


<!-- TELA 4: COMPROVANTE DE CONFIRMAÇÃO -->
<div id="telaConfirmacao" class="tela">
 <div class="icone-destaque">✅</div>
 <h1>Agendamento Confirmado!</h1>
 <p style="color: #555;">Sua solicitação de coleta foi registrada com sucesso.</p>


 <div class="caixa-comprovante">
   <p><b>🎫 Protocolo:</b> <span id="resProtocolo"></span></p>
   <p><b>👤 Nome:</b> <span id="resNome"></span></p>
   <p><b>🏠 Seu Endereço:</b> <span id="resEndereco"></span></p>
   <p><b>📍 Ponto de Coleta:</b> <span id="resLocal"></span></p>
   <p><b>🗺️ Endereço do Ponto:</b> <span id="resEnderecoPonto"></span></p>
   <p><b>📅 Data Escolhida:</b> <span id="resData"></span></p>
   <p><b>⏰ Horário:</b> Das 08h às 17h</p>
 </div>


 <p style="color: #4a5d4e;"><i>💡 Lembre-se de levar seus materiais limpos e separados no dia informado!</i></p>


 <button onclick="mostrarTela('conteudoPrincipal')">Fazer Novo Agendamento</button>
 <button class="botao-secundario" onclick="sairDaConta()">Sair da Conta</button>
</div>


<!-- CONEXÃO COM O ARQUIVO DE BACK-END -->
<script src="lg.js"></script>
</body>
</html>

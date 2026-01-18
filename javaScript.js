// Histórico salvo
let historico = JSON.parse(localStorage.getItem('poolData')) || [];

// Limpa campos específicos
function limparCampos() {
    document.getElementById('data-manutencao').value = "";
    document.getElementById('desc-manutencao').value = "";
    document.getElementById('litragem').value = "";

    const resultado = document.getElementById('resultado-texto');
    if (resultado) resultado.innerHTML = "";
}

// Navegação entre telas
function navegar(idTela, limpar = false) {

    if (limpar) limparCampos();

    document.querySelectorAll('.screen')
        .forEach(screen => screen.classList.remove('active'));

    document.getElementById(idTela).classList.add('active');
}

// Salvar manutenção
function salvarManutencao() {
    const data = document.getElementById('data-manutencao').value;
    const desc = document.getElementById('desc-manutencao').value;

    if (!data || !desc) {
        alert("Não deixe nenhum campo vazio!");
        return;
    }

    historico.push({ data, desc });
    localStorage.setItem('poolData', JSON.stringify(historico));

    alert("Manutenção salva com sucesso!");
    navegar('decisao-manutencao', true);
}

// Mostrar histórico
function verHistorico() {
    const lista = document.getElementById('lista-historico');

    lista.innerHTML = historico
        .map(item => `<li>${item.data}: ${item.desc}</li>`)
        .join('');

    document.getElementById('msg-sem-historico').style.display =
        historico.length ? 'none' : 'block';

    navegar('historico');
}

function calcularProdutos() {
    // Pega os valores dos campos
    const tipoPiscina = document.getElementById('tipo-piscina').value;
    const clima = document.getElementById('clima').value;
    const litragemStr = document.getElementById('litragem').value;

    // Validação básica
    if (!tipoPiscina || !clima || !litragemStr) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const litragem = parseFloat(litragemStr);
    if (isNaN(litragem) || litragem <= 0) {
        alert("Litragem deve ser um número positivo.");
        return;
    }

    const produto = litragem / 1000; // converte para "unidades"

    // Funções de cálculo
    function climasol(x) {
        const ajusteCloro = 1.3;
        const ajusteAlgicida = 1.2;
        const cloroliquido = (x * 15) * ajusteCloro;
        const clorogranulado = (x * 8) * ajusteCloro;
        const algicida = (x * 6) * ajusteAlgicida;
        const ph = x * 5;
        const Clarificante = x * 4;
        const Floculante = x * 10;
        return { cloroliquido, clorogranulado, algicida, ph, Clarificante, Floculante};
    }

    function climanublado(x) {
        const ajusteCloro = 0.7;
        const ajusteAlgicida = 0.5;
        const cloroliquido = (x * 15) * ajusteCloro;
        const clorogranulado = (x * 8) * ajusteCloro;
        const algicida = (x * 6) * ajusteAlgicida;
        const ph = x * 5;
        const Clarificante = x * 4;
        const Floculante = x * 10;
        return { cloroliquido, clorogranulado, algicida, ph, Clarificante, Floculante};
    }

    function climachuva(x) {
        const ajusteCloro = 1.2;
        const ajusteAlgicida = 1.2;
        const cloroliquido = (x * 15) * ajusteCloro;
        const clorogranulado = (x * 8) * ajusteCloro;
        const algicida = (x * 6) * ajusteAlgicida;
        const ph = x * 5;
        const Clarificante = x * 4;
        const Floculante = x * 10;
        return { cloroliquido, clorogranulado, algicida, ph, Clarificante, Floculante};
    }

    
    let resultado;
    if (clima == 'sol'){
        resultado = climasol(produto)
    }
    else if (clima == 'nublado'){
        resultado = climanublado(produto);
    } 
    else if (clima === 'chuva') {
        resultado = climachuva(produto);
    }
    else {
        alert("Clima inválido.");
        return;
    }

    // Arredonda os valores
    const cloroliquido = parseFloat(resultado.cloroliquido.toFixed(2));
    const clorogranulado = parseFloat(resultado.clorogranulado.toFixed(2));
    const algicida = parseFloat(resultado.algicida.toFixed(2));
    const ph = parseFloat(resultado.ph.toFixed(2));
    const Clarificante = parseFloat(resultado.Clarificante.toFixed(2));
    const Floculante = parseFloat(resultado.Floculante.toFixed(2));

    // Atualiza o conteúdo da div de resultado
    const resultadoDiv = document.getElementById('resultado-texto');
    
    if (resultadoDiv) {
        if (tipoPiscina == 'alvenaria'){
            resultadoDiv.innerHTML = `
                <h2>Recomendação</h2>
                <p><strong>Cloro líquido:</strong> ${cloroliquido} mL</p>
                <p><strong>Cloro granulado:</strong> ${clorogranulado} g</p>
                <p><strong>Algicida:</strong> ${algicida} mL</p>
                <p><strong>pH:</strong> ${ph} mL</p>
                <p><strong>Clarificante:</strong> ${Clarificante} mL<p>
                <p><strong>Floculante:</strong> ${Floculante} mL <p>
            `;
        }
        else if (tipoPiscina == 'vinil'){
            resultadoDiv.innerHTML = `
                <h2>Recomendação</h2>
                <p><strong>Cloro líquido:</strong> ${cloroliquido} mL <span style= 'font-size: 12px';'color: grey';> * Diminuir em 10%</span></p>
                <p><strong>Cloro granulado:</strong> ${clorogranulado} g <span style= 'font-size: 12px';'color: grey';> * Dissolver o produto em um 
                balde com água ou usar um dosador/flutuador.</span></p>
                <p><strong>Algicida:</strong> ${algicida} mL <span style= 'font-size: 12px';'color: grey';>* Não metálico</span></p>
                <p><strong>pH:</strong> ${ph} mL <span style= 'font-size: 12px';'color: grey';> * pH-: bisulfato de sódio, 
                pH+: carbonato de sódio</span></p>
                <p><strong>Clarificante:</strong> ${Clarificante} mL <span style= 'font-size: 12px';'color: grey';> * Evitar produtos com sulfato de alumínio 
                agressivo</span><p>
                <p><strong>Floculante:</strong> ${Floculante} mL <span style= 'font-size: 12px';'color: grey';> * Evitar produtos ácidos</span><p>
            `;
        }
        else if (tipoPiscina == 'fibra'){
            resultadoDiv.innerHTML = `
                <h2>Recomendação</h2>
                <p><strong>Cloro líquido:</strong> ${cloroliquido} mL</p>
                <p><strong>Cloro granulado:</strong> ${clorogranulado} g</p>
                <p><strong>Algicida:</strong> ${algicida} mL<span style= 'font-size: 12px';'color: grey';> * Não metálico</span></p>
                <p><strong>pH:</strong> ${ph} mL <span style= 'font-size: 12px';'color: grey';> * pH-: bisulfato de sódio, 
                pH+: carbonato de sódio</span></p>
                <p><strong>Clarificante:</strong> ${Clarificante} mL<p>
                <p><strong>Floculante:</strong> ${Floculante} mL <span style= 'font-size: 12px';'color: grey';> Evitar produtos ácidos</span><p>
            `; 
        }
    }

    // Mostra a tela de resultado
    navegar('calculo');
}

function toggleSenha() {
  const campos = document.querySelectorAll('.senha');

  campos.forEach(campo => {
    if (campo.type === 'password') {
      campo.type = 'text';
    } else {
      campo.type = 'password';
    }
  });
}

const senhaInput = document.getElementById('senharegistro');
    const mensagem = document.getElementById('mensagem');

    senhaInput.addEventListener('input', () => {
    const senha = senhaInput.value;
    const temMinuscula = /[a-z]/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temSimbolo = /[@$!%*?&]/.test(senha);
    const tem8Caracteres = senha.length >= 8;

    let erros = [];
    if (!tem8Caracteres) erros.push("pelo menos 8 caracteres");
    if (!temMinuscula) erros.push("uma letra minúscula");
    if (!temMaiuscula) erros.push("uma letra maiúscula");
    if (!temNumero) erros.push("um número");
    if (!temSimbolo) erros.push("um símbolo (@$!%*?&)");

    if (erros.length > 0) {
    mensagem.textContent = "Sua senha precisa ter: " + erros.join(", ") + ".";
    mensagem.style.color = 'red'
    } 
    else {
    mensagem.textContent = "Senha forte! ✅";
    mensagem.style.color = "green";
    }
});

// Registrar
function registrar() {
  const user = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senharegistro').value;

  if (!user || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

  if (usuarios[user]) {
    alert("Usuário já existe!");
    return;
  }

  usuarios[user] = btoa(senha); // codifica a senha
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert("Registrado com sucesso!");
  navegar('inicio');
}

// Login
function login() {
  const nome = document.getElementById('usuarioLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  if (!nome || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
  const senhaSalva = usuarios[nome];

  if (senhaSalva && senhaSalva === btoa(senha)) {
    localStorage.setItem('usuarioLogado', nome);
    navegar('opcoes');
    document.getElementById('nome-usuario').textContent = nome;
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

function logout() {
  // 1. Remove o dado que indica que alguém está logado
  localStorage.removeItem('usuarioLogado');

  // 2.limpa campos
  const nomeElement = document.getElementById('nome-usuario');
  if (nomeElement) {
    nomeElement.textContent = ''; // ou "Visitante", etc.
  }

  // 3. Volta para a tela inicial
  navegar('inicio');
}



// Cria uma conexão com o servidor WebSocket
const socket = io();

// Seleciona elementos do DOM
const form = document.getElementById('form');
const input = document.getElementById('input');
const urgencyCodeField= document.getElementById('input1');
const sectorField = document.getElementById('input2');
const autenticationCamp = document.getElementById('inputAutenticator');
const messages = document.getElementById('messages');


// Adiciona um listener ao formulário para o envio
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Verifica se os campos estão preenchidos
  if (urgencyCodeField.value && sectorField.value) {
    // Monta a mensagem com quebras de linha em HTML
    const message = 
    `Código: ${urgencyCodeField.value}<br>
     Título: ${sectorField.value}<br>
    Informações adicional: ${input.value}
    `;

    if(!input.value){

      input.value='Sem informações adicionais';

    }

    if(urgencyCodeField.value && sectorField.value == null){

        alert("Preencha todos os campos necessários para a ocorrência !")

    }

    // Emite a mensagem para o servidor
    socket.emit('chat message', message);

    // Limpa os campos do formulário
    input.value = '';
    urgencyCodeField.value = '';
    sectorField.value = '';
  }
});

// Recebe as mensagens anteriores do servidor e as exibe na lista de mensagens
socket.on('previousMessages', (messagesArray) => {
  messagesArray.reverse().forEach((msg) => {
    addMessageToDOM(msg.message, msg.created_at);
  });
});

// Recebe novas mensagens do servidor e as exibe na lista de mensagens
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = msg;  // Usa innerHTML para exibir a mensagem com as quebras de linha
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);

  // Exibe notificação ao receber nova mensagem
  showNotification(msg);
});

// Solicita permissão para notificações
if (Notification.permission === 'default') {
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') {
      console.log('Permissão de notificação não concedida');
    }
  });
}

// Função para criar uma notificação
function showNotification(message) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Atenção! Alerta!', {
      body: message.replace(/<br>/g, '\n'), // Substitui <br> por quebras de linha nas notificações
      icon: "/Hsclogo.jpg"
    });

    // Quando o usuário clicar na notificação, a aba será focada
    notification.onclick = () => {
      window.open('http://localhost:3000'); // Abre a aba
      window.focus(); // Foca na aba do navegador
    };
  }
}

function getFormattedDate() {
  const date = new Date();

  // Extrai dia, mês, ano, horas, minutos e segundos
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Retorna no formato desejado: dia/mês/ano, hh:mm:ss
  return `${day}/${month}/${year}, ${hour}:${minutes}:${seconds}`;
}

function FormattedDate(dateString) {

  return dateString;
}

// Função para adicionar mensagem ao DOM
function addMessageToDOM(message, created_at) {
  const hourNow = FormattedDate(created_at);
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${hourNow}:</strong> ${message}`;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;  // Rolagem automática para o fim
}

// Função para abrir uma nova janela popup
function openNewWindow(message) {
  const popupWindow = window.open('', 'Nova Mensagem', 'width=400,height=300');
  popupWindow.document.write('<h1>Nova Mensagem Recebida</h1>');
  popupWindow.document.write(`<p>${message}</p>`);
}


//Autenticação

// Obtendo o modal e o botão de login com querySelector
const modal = document.querySelector("#loginModal");
const btn = document.querySelector("#loginBtn");

// Obtendo o botão "X" para fechar o modal
const closeBtn = document.querySelector(".close");

// Função para abrir o modal
btn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Função para fechar o modal ao clicar no "X"
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Função para fechar o modal ao clicar fora da janela
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


// Usuário 

const checkUser = (inputAutenticator) => {
  const query = `SELECT user FROM users WHERE user = ? AND canSendMessages = 1`;

  db.all(query, [inputAutenticator], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    
    if (rows.length > 0) {
      console.log("Usuário pode enviar mensagens.");
      return true;
    } else {
      console.log("Usuário não encontrado ou não pode enviar mensagens.");
      return false;
    }
  });
};
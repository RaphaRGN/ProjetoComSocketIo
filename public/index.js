// Cria uma conexão com o servidor WebSocket
// TODO: ARRUMAR HORÁRIO BANCO
const socket = io();

// Seleciona elementos do DOM
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const campo1 = document.getElementById('input1');
const campo2 = document.getElementById('input2');


// Adiciona um listener ao formulário para o envio
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Verifica se os campos estão preenchidos
  if (campo1.value && campo2.value) {
    // Monta a mensagem com quebras de linha em HTML
    const message = 
    `Código: ${campo1.value}<br>
     Título: ${campo2.value}<br>
    Informações adicional: ${input.value}
    `;

    if(!input.value){

      input.value='Sem informações adicionais';

    }

    // Emite a mensagem para o servidor
    socket.emit('chat message', message);

    // Limpa os campos do formulário
    input.value = '';
    campo1.value = '';
    campo2.value = '';
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

function Dataformatada(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');

}

// Função para adicionar mensagem ao DOM
function addMessageToDOM(message, created_at) {
  const HoraAtual = Dataformatada(created_at);
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${HoraAtual}:</strong> ${message}`;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;  // Rolagem automática para o fim
}

// Função para abrir uma nova janela popup
function openNewWindow(message) {
  const popupWindow = window.open('', 'Nova Mensagem', 'width=400,height=300');
  popupWindow.document.write('<h1>Nova Mensagem Recebida</h1>');
  popupWindow.document.write(`<p>${message}</p>`);
}
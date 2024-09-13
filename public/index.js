//cria o IO
const socket = io();

// Pega as inforações dos campos com os seguintes ID's
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  //
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });


  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission !== "granted") {
        console.log("Permissão de notificação não concedida");
      }
    });
  }
  
  // Função para criar uma notificação
  function showNotification(message) {
    if (Notification.permission === "granted") {
      const notification = new Notification("Nova mensagem!", {
        body: message,
        icon: "/Hsclogo.jpg" // Caminho para o ícone da sua notificação
      });
  
      // Quando o usuário clicar na notificação, a aba será focada
      notification.onclick = () => {
        window.focus();  // Foca na aba do navegador
        
      };
    }
    //Função para abrir uma nova janela
    function openNewWindow(message) {
      const popupWindow = window.open("", "Nova Mensagem", "width=400,height=300");
      popupWindow.document.write("<h1>Nova Mensagem Recebida</h1>");
      popupWindow.document.write(`<p>${message}</p>`);
    }

  }
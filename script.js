// Gestion du panneau Chatbot
const chatbotTrigger = document.getElementById('chatbot-trigger');
const chatbotPanel = document.getElementById('chatbot-panel');
const closeChat = document.getElementById('close-chat');

chatbotTrigger.addEventListener('click', () => {
    chatbotPanel.classList.remove('hidden');
    chatbotTrigger.style.display = 'none'; // Cache le bouton quand ouvert
});

closeChat.addEventListener('click', () => {
    chatbotPanel.classList.add('hidden');
    chatbotTrigger.style.display = 'block'; // Réaffiche le bouton
});

// Simulation de l'IA (Logique de Chat basique)
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
}

sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text === '') return;

    // Afficher le message utilisateur
    addMessage(text, 'user');
    userInput.value = '';

    // Simuler la réponse de l'IA après 1 seconde
    setTimeout(() => {
        addMessage("Excellente requête ! L'Agence étudie vos paramètres temporels... (Ceci est une simulation, connectez mon API pour que je vous réponde vraiment !)", 'ai');
    }, 1000);
});

// Permettre l'envoi avec la touche Entrée
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
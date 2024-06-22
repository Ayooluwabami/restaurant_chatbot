document.addEventListener('DOMContentLoaded', function () {
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  const apiUrl = 'http://localhost:3000/api';

  // Function to append messages to the chat box
  const appendMessage = (message, isBot = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.className = isBot ? 'bot-message' : 'user-message';
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // Function to send user message to the backend and process response
  const sendMessage = async (message) => {
    appendMessage(message, false);
    try {
      const response = await fetch(`${apiUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      appendMessage(data.message, true);
      processUserInput(message); // Process user input after displaying bot's response
    } catch (error) {
      console.error('Error sending message:', error);
      appendMessage('Error sending message', true);
    }
  };

  // Function to display bot's message in the chat
  const displayBotMessage = (message) => {
    appendMessage(message, true);
  };

  // Initial greeting and options display
  displayBotMessage('Welcome to Restaurant ChatBot! Please select one of the following options:');
  displayBotMessage('Select 1: Place an order');
  displayBotMessage('Select 99: Checkout order');
  displayBotMessage('Select 98: See order history');
  displayBotMessage('Select 97: See current order');
  displayBotMessage('Select 0: Cancel order');

  // Event listener for send button click
  sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
      chatInput.value = '';
    }
  });

  // Event listener for pressing Enter in the input field
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = chatInput.value.trim();
      if (message) {
        sendMessage(message);
        chatInput.value = '';
      }
    }
  });

  // Function to handle user input commands and display appropriate bot responses
  const processUserInput = (input) => {
    const userInput = input.trim().toLowerCase();

    switch (userInput) {
      case '1':
        displayBotMessage('Here are the menu items:');
        displayBotMessage('1. Pizza - $10');
        displayBotMessage('2. Burger - $8');
        displayBotMessage('3. Salad - $6');
        break;
      case '99':
        displayBotMessage('Order placed');
        break;
      case '98':
        displayBotMessage('Here is your order history:');
        displayBotMessage('1. Pizza - $10');
        displayBotMessage('2. Burger - $8');
        
        break;
      case '97':
        displayBotMessage('Current order: No items');
        break;
      case '0':
        displayBotMessage('Order canceled');
        break;
      default:
        displayBotMessage('I did not understand that. Please select a valid option.');
    }
  };
});

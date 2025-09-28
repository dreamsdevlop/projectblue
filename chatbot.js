// Gemini AI Chatbot Integration with Voice and Text Features
class GeminiChatbot {
    constructor() {
        this.apiKey ='AIzaSyCSmSOczf-c1Mq41IbdUy9tBAmnSNLq1lw'; // Replace with your actual API key
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.chatHistory = [];
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.createChatInterface();
        this.initializeSpeechRecognition();
        this.bindEvents();
        this.loadChatHistory();
    }
    
    createChatInterface() {
        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <div id="chatbot-toggle" class="fixed bottom-6 right-6 z-50">
                <button class="bg-navy text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110">
                    <svg id="chat-icon" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <svg id="close-icon" class="w-8 h-8 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div id="notification-badge" class="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hidden animate-pulse">
                    !
                </div>
            </div>

            <!-- Chatbot Interface -->
            <div id="chatbot-container" class="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl z-40 transform translate-y-full opacity-0 transition-all duration-300 border border-gray-200">
                <!-- Header -->
                <div class="bg-navy text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold">Property AI Assistant</h3>
                            <p class="text-xs text-blue-200">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="voice-toggle" class="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                            <svg id="mic-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                            <svg id="mic-off-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 5.586l12.828 12.828M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </button>
                        <button id="clear-chat" class="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div id="chat-messages" class="flex-1 p-4 overflow-y-auto h-64 space-y-3">
                    <div class="flex items-start space-x-2">
                        <div class="w-8 h-8 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p class="text-sm text-charcoal">Hello! I'm your AI property assistant. I can help you with property verification, legal questions, market analysis, and more. How can I assist you today?</p>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2">
                        <div class="flex-1 relative">
                            <input 
                                type="text" 
                                id="chat-input" 
                                placeholder="Ask about properties, legal advice, or say 'help'..."
                                class="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                            >
                            <button id="voice-input-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-navy transition-colors">
                                <svg id="voice-btn-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                </svg>
                            </button>
                        </div>
                        <button id="send-message" class="bg-navy text-white p-3 rounded-lg hover:bg-blue-800 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="voice-status" class="mt-2 text-xs text-center text-gray-500 hidden">
                        <span class="inline-flex items-center">
                            <span class="animate-pulse w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Listening... Speak now
                        </span>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div id="typing-indicator" class="px-4 pb-2 hidden">
                    <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 bg-navy rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                document.getElementById('voice-status').classList.remove('hidden');
                document.getElementById('voice-btn-icon').classList.add('text-red-500');
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                document.getElementById('voice-status').classList.add('hidden');
                document.getElementById('voice-btn-icon').classList.remove('text-red-500');
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chat-input').value = transcript;
                this.sendMessage(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showNotification('Voice recognition error. Please try again.', 'error');
            };
        }
    }
    
    bindEvents() {
        // Toggle chatbot
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        // Send message
        document.getElementById('send-message').addEventListener('click', () => {
            const input = document.getElementById('chat-input');
            if (input.value.trim()) {
                this.sendMessage(input.value.trim());
                input.value = '';
            }
        });
        
        // Enter key to send
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = e.target;
                if (input.value.trim()) {
                    this.sendMessage(input.value.trim());
                    input.value = '';
                }
            }
        });
        
        // Voice input button
        document.getElementById('voice-input-btn').addEventListener('click', () => {
            this.toggleVoiceInput();
        });
        
        // Voice toggle in header
        document.getElementById('voice-toggle').addEventListener('click', () => {
            this.toggleVoiceInput();
        });
        
        // Clear chat
        document.getElementById('clear-chat').addEventListener('click', () => {
            this.clearChat();
        });
    }
    
    toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (this.isOpen) {
            container.classList.add('translate-y-full', 'opacity-0');
            chatIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            this.isOpen = false;
        } else {
            container.classList.remove('translate-y-full', 'opacity-0');
            chatIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            this.isOpen = true;
            document.getElementById('notification-badge').classList.add('hidden');
        }
    }
    
    toggleVoiceInput() {
        if (!this.recognition) {
            this.showNotification('Voice recognition not supported in this browser', 'error');
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    async sendMessage(message) {
        this.addMessage(message, 'user');
        this.showTypingIndicator();
        
        try {
            const response = await this.callGeminiAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            
            // Text-to-speech for bot response
            if (this.synthesis && this.synthesis.speaking === false) {
                this.speakText(response);
            }
            
        } catch (error) {
            this.hideTypingIndicator();
            console.error('Gemini API error:', error);
            this.addMessage('I apologize, but I\'m having trouble connecting to my AI service. Please try again later or contact us at 03490417705 for immediate assistance.', 'bot');
        }
        
        this.saveChatHistory();
    }
    
    async callGeminiAPI(message) {
        // Enhanced context for property-related queries
        const propertyContext = `You are an AI assistant for Shahid Mehmood Property Adviser & Consultant, Pakistan's trusted property legal hub. 
        
        Key information:
        - Contact number: 03490417705
        - Services: Property verification, legal documentation, consultation
        - Coverage: All major Pakistani cities (Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad)
        - Specialties: Property law, verification, fraud prevention, legal compliance
        
        Provide helpful, accurate information about Pakistani property law, verification processes, and real estate matters. 
        Always be professional and offer to connect users with our experts at 03490417705 for complex matters.
        
        User question: ${message}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: propertyContext
                }]
            }]
        };
        
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    
    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-2 ${sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`;
        
        const avatar = sender === 'user' 
            ? `<div class="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
               </div>`
            : `<div class="w-8 h-8 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
               </div>`;
        
        const messageClass = sender === 'user' 
            ? 'bg-navy text-white' 
            : 'bg-gray-100 text-charcoal';
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="${messageClass} rounded-lg p-3 max-w-xs">
                <p class="text-sm">${this.formatMessage(message)}</p>
                <span class="text-xs opacity-70 mt-1 block">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to chat history
        this.chatHistory.push({
            message,
            sender,
            timestamp: new Date().toISOString()
        });
        
        // Show notification if chatbot is closed
        if (!this.isOpen && sender === 'bot') {
            document.getElementById('notification-badge').classList.remove('hidden');
        }
    }
    
    formatMessage(message) {
        // Format message with links and highlights
        return message
            .replace(/03490417705/g, '<a href="tel:03490417705" class="underline font-semibold">03490417705</a>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    speakText(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to use a female voice if available
            const voices = this.synthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('woman') ||
                voice.gender === 'female'
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }
    
    showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }
    
    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = `
            <div class="flex items-start space-x-2">
                <div class="w-8 h-8 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p class="text-sm text-charcoal">Hello! I'm your AI property assistant. I can help you with property verification, legal questions, market analysis, and more. How can I assist you today?</p>
                </div>
            </div>
        `;
        this.chatHistory = [];
        this.saveChatHistory();
    }
    
    saveChatHistory() {
        localStorage.setItem('chatbot_history', JSON.stringify(this.chatHistory));
    }
    
    loadChatHistory() {
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
            // Optionally restore recent messages
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-success text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-alert text-white' :
            'bg-navy text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if API key is set
    const apiKey ='AIzaSyCSmSOczf-c1Mq41IbdUy9tBAmnSNLq1lw'; // Replace with your actual API key
    if (apiKey === 'YOUR_GEMINI_API_KEY') {
        console.warn('Please set your Gemini API key in chatbot.js');
    }
    
    window.geminiChatbot = new GeminiChatbot();
});
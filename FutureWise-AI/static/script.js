const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Add a message to the chat
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "user-message" : "bot-message";
    messageDiv.innerHTML = message;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to Flask backend
async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    // Show user's message
    addMessage(message, "user");

    userInput.value = "";

    // Show typing indicator
    const typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing";
    typing.innerHTML = "🤖 FutureWise AI is thinking...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        typing.remove();

        addMessage(data.reply, "bot");

    } catch (error) {

        typing.remove();

        addMessage("❌ Something went wrong.", "bot");
    }
}

// Button click
sendBtn.addEventListener("click", sendMessage);

// Press Enter
userInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        sendMessage();
    }

});
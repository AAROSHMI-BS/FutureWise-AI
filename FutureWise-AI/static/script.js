const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
function formatMessage(message){

    return message
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/### (.*?)/g, "<h3>$1</h3>")
        .replace(/\n/g, "<br>");

}


// Add message to chat
function addMessage(message, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.className = sender === "user"
        ? "user-message"
        : "bot-message";

    messageDiv.innerHTML = formatMessage(message);

    // Animation
    messageDiv.style.opacity = "0";
    messageDiv.style.transform = "translateY(10px)";

    chatBox.appendChild(messageDiv);


    setTimeout(() => {
        messageDiv.style.transition = "0.3s ease";
        messageDiv.style.opacity = "1";
        messageDiv.style.transform = "translateY(0)";
    }, 50);


    chatBox.scrollTop = chatBox.scrollHeight;
}



// Typing animation
function showTyping() {

    const typing = document.createElement("div");

    typing.className = "bot-message typing";
    typing.id = "typing";

    typing.innerHTML = `
        🤖 FutureWise AI is thinking
        <span class="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `;


    chatBox.appendChild(typing);

    chatBox.scrollTop = chatBox.scrollHeight;
}



// Send message
async function sendMessage() {

    const message = userInput.value.trim();


    if(message === "") return;


    // Display user message
    addMessage(message, "user");


    // Clear input
    userInput.value = "";


    // Disable button while AI responds
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Thinking...";


    // Show AI typing
    showTyping();


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();


        // Remove typing animation
        document.getElementById("typing")?.remove();


        // Display AI response
        addMessage(data.reply, "bot");


    }


    catch(error){

        document.getElementById("typing")?.remove();
        

        addMessage(
            "❌ Sorry, I couldn't connect right now.",
            "bot"
        );

        console.error(error);

    }


    finally{

        // Enable button again
        sendBtn.disabled = false;
        sendBtn.innerHTML = "Send";

        userInput.focus();

    }

}



// Send button click
sendBtn.addEventListener(
    "click",
    sendMessage
);




// Enter key support
userInput.addEventListener(
    "keydown",
    function(event){


        if(event.key === "Enter" && !event.shiftKey){

            event.preventDefault();

            sendMessage();

        }

    }
);
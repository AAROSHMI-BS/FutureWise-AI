const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
function formatMessage(message){

    return message
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/### (.*?)/g, "<h3>$1</h3>")
        .replace(/\n/g, "<br>");

}



function addMessage(message, sender){

    const messageDiv = document.createElement("div");

    messageDiv.className = sender === "user"
        ? "user-message"
        : "bot-message";


    if(sender === "bot"){

        messageDiv.innerHTML = `
            <div class="bot-header">
                <div class="ai-avatar">🤖</div>
                <span>FutureWise AI</span>
            </div>

            <div class="bot-text">
                ${formatMessage(message)}
            </div>
        `;

    }
    else{

        messageDiv.innerHTML = `
            <div class="user-text">
                ${message}
            </div>
        `;

    }


    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

}



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




async function sendMessage() {

    const message = userInput.value.trim();


    if(message === "") return;


    
    addMessage(message, "user");


    
    userInput.value = "";


    
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Thinking...";


    
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

        
        sendBtn.disabled = false;
        sendBtn.innerHTML = "Send";

        userInput.focus();

    }

}




sendBtn.addEventListener(
    "click",
    sendMessage
);





userInput.addEventListener(
    "keydown",
    function(event){


        if(event.key === "Enter" && !event.shiftKey){

            event.preventDefault();

            sendMessage();

        }

    }
);


const suggestions = document.querySelectorAll(".suggestion-btn");


suggestions.forEach(button => {

    button.addEventListener("click", () => {

        let prompt = button.innerText;


        if(prompt.includes("Career")){
            userInput.value =
            "Suggest career paths for a computer science student";
        }


        else if(prompt.includes("AI Skills")){
            userInput.value =
            "What AI skills should I learn in 2026?";
        }


        else if(prompt.includes("Learning")){
            userInput.value =
            "Create a learning roadmap for becoming an AI engineer";
        }


        sendBtn.click();

    });

});

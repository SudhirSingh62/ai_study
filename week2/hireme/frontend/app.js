const API_BASE_URL = "http://localhost:8000";

const form = document.querySelector("#chat-form");
const input = document.querySelector("#question");
const messages = document.querySelector("#messages");
const suggestions = document.querySelector("#suggestions");
const apiDot = document.querySelector("#api-dot");
const apiStatus = document.querySelector("#api-status");
const themeToggle = document.querySelector("#theme-toggle");

function setApiStatus(online) {
  apiDot.className = `status-dot ${online ? "online" : "offline"}`;
  apiStatus.textContent = online ? "Profile ready" : "API unavailable";
}

function formatAssistantText(text) {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

function addMessage(text, role) {
  const message = document.createElement("div");
  message.className = `message ${role}-message`;
  message.innerHTML = role === "assistant"
    ? `<div class="message-avatar">H</div><div class="bubble"><p></p><span class="message-time">Just now</span></div>`
    : `<div class="bubble"><p></p><span class="message-time">Just now</span></div>`;
  if (role === "assistant") {
    message.querySelector("p").innerHTML = formatAssistantText(text);
  } else {
    message.querySelector("p").textContent = text;
  }
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

async function checkApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    setApiStatus(response.ok);
  } catch {
    setApiStatus(false);
  }
}

async function askQuestion(question) {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return;
  addMessage(trimmedQuestion, "user");
  input.value = "";
  input.disabled = true;
  form.querySelector("button").disabled = true;
  const thinking = addMessage("Thinking through the resume...", "assistant");

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: trimmedQuestion }),
    });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    if (!response.body) throw new Error("Streaming is not supported by this browser.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";
    const answerMessage = thinking.querySelector("p");
    let finished = false;

    while (!finished) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        if (!event.startsWith("data: ")) continue;
        const payload = event.slice(6);
        if (payload === "[DONE]") {
          finished = true;
          break;
        }
        const data = JSON.parse(payload);
        answer += data.content || "";
        answerMessage.innerHTML = formatAssistantText(answer);
        messages.scrollTop = messages.scrollHeight;
      }
      if (done) break;
    }

    answerMessage.innerHTML = formatAssistantText(
      answer || "I don't have enough information to answer that.",
    );
    thinking.querySelector(".message-time").textContent = "Just now";
    setApiStatus(true);
  } catch (error) {
    thinking.remove();
    addMessage("I couldn't reach the candidate profile right now. Please make sure the FastAPI server is running and try again.", "assistant");
    setApiStatus(false);
    console.error(error);
  } finally {
    input.disabled = false;
    form.querySelector("button").disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  askQuestion(input.value);
});

suggestions.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) askQuestion(button.dataset.question);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
});

checkApi();

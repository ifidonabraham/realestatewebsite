console.log("JavaScript is connected!");

if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
}

// --- DOM ELEMENTS ---
const propertyList = document.getElementById("propertyList");
const searchBox = document.getElementById("searchBox");
const priceFilter = document.getElementById("priceFilter");
const messageList = document.getElementById("messageList");

let allProperties = [];

// --- PROPERTY LISTING, SEARCH, FILTER ---
function displayProperties(properties) {
    if (!propertyList) return;
    propertyList.innerHTML = properties.map(property => `
        <div>
            <h3>${property.title}</h3>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Price:</strong> $${property.price}</p>
            <p>${property.description}</p>
            <p><strong>Agent:</strong> ${property.agent}</p>
            <button onclick="contactAgent('${property.agent}')">Contact Agent</button>
            <hr>
        </div>
    `).join("");
}

function filterAndDisplay() {
    let filtered = allProperties;

    // Filter by search text
    if (searchBox && searchBox.value.trim() !== "") {
        const searchText = searchBox.value.toLowerCase();
        filtered = filtered.filter(property =>
            property.title.toLowerCase().includes(searchText) ||
            property.location.toLowerCase().includes(searchText)
        );
    }

    // Filter by price
    if (priceFilter && priceFilter.value !== "") {
        const filterValue = priceFilter.value;
        filtered = filtered.filter(property => {
            if (filterValue === "low") return property.price < 500;
            if (filterValue === "medium") return property.price >= 500 && property.price <= 1000;
            if (filterValue === "high") return property.price > 1000;
            return true;
        });
    }

    displayProperties(filtered);
}

function fetchProperties() {
    fetch("http://localhost:3000/properties")
        .then(response => response.json())
        .then(properties => {
            allProperties = properties;
            filterAndDisplay();
        })
        .catch(error => console.error("Error fetching properties:", error));
}

if (propertyList) {
    fetchProperties();
    if (searchBox) searchBox.addEventListener("input", filterAndDisplay);
    if (priceFilter) priceFilter.addEventListener("change", filterAndDisplay);
}

// --- CONTACT AGENT ---
function contactAgent(agentEmail) {
    const client = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!client) {
        alert("You must be logged in to contact an agent.");
        return;
    }
    const message = prompt("Enter your message for the agent:");
    if (message) {
        const chatData = { client: client.email, agent: agentEmail, message };
        fetch("http://localhost:3000/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chatData)
        })
        .then(response => response.json())
        .then(() => alert("Message sent successfully!"))
        .catch(error => console.error("Error:", error));
    }
}
window.contactAgent = contactAgent;

// --- AGENT MESSAGES ---
if (messageList) {
    const agent = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!agent) {
        alert("You must be logged in to view messages.");
    } else {
        fetch("http://localhost:3000/messages")
            .then(response => response.json())
            .then(messages => {
                const agentMessages = messages.filter(msg => msg.agent === agent.email);
                messageList.innerHTML = agentMessages.length
                    ? agentMessages.map(msg => `<p><strong>${msg.client}:</strong> ${msg.message}</p><hr>`).join("")
                    : "<p>No messages yet.</p>";
            })
            .catch(error => console.error("Error fetching messages:", error));
    }
}

// --- REGISTER FORM ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        // Check if user already exists
        const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        const existing = await res.json();
        if (existing.length > 0) {
            alert("Email already registered.");
            return;
        }

        // Register user
        await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password, type: role })
        });

        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    });
}

// --- VERIFICATION ---
function verifyUser() {
    const enteredCode = document.getElementById("verificationCode").value;
    const pendingVerification = JSON.parse(localStorage.getItem("pendingVerification"));
    if (!pendingVerification) {
        alert("No verification process found. Please register again.");
        return;
    }
    fetch(`http://localhost:3000/users?email=${pendingVerification.email}`)
        .then(response => response.json())
        .then(users => {
            if (users.length === 0) {
                alert("User not found!");
                return;
            }
            const user = users[0];
            if (user.verificationCode == enteredCode) {
                fetch(`http://localhost:3000/users/${user.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ verified: true })
                })
                .then(() => {
                    alert("Verification successful! You can now log in.");
                    localStorage.removeItem("pendingVerification");
                    window.location.href = "login.html";
                });
            } else {
                alert("Incorrect verification code!");
            }
        })
        .catch(error => console.error("Error verifying user:", error));
}
window.verifyUser = verifyUser;

// --- RESET PASSWORD ---
function sendResetCode() {
    const input = document.getElementById("resetInput").value;
    fetch(`http://localhost:3000/users`)
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.email === input || u.phone === input);
            if (!user) {
                alert("No account found with this email or phone number.");
                return;
            }
            const resetCode = Math.floor(100000 + Math.random() * 900000);
            fetch(`http://localhost:3000/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetCode })
            })
            .then(() => {
                alert(`A reset code has been sent to your email/phone: ${resetCode}`);
                localStorage.setItem("resetUser", JSON.stringify({ id: user.id, resetCode: String(resetCode) }));
                window.location.href = "new-password.html";
            });
        })
        .catch(error => console.error("Error sending reset code:", error));
}
window.sendResetCode = sendResetCode;

function resetPassword() {
    const resetUser = JSON.parse(localStorage.getItem("resetUser"));
    if (!resetUser) {
        alert("No reset request found. Please try again.");
        return;
    }
    const enteredCode = document.getElementById("resetCode").value;
    const newPassword = document.getElementById("newPassword").value;
    if (!enteredCode || !newPassword) {
        alert("Please fill in all required fields.");
        return;
    }
    if (enteredCode !== resetUser.resetCode) {
        alert("Invalid reset code. Please try again.");
        return;
    }
    fetch(`http://localhost:3000/users/${resetUser.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("User not found.");
            }
            return response.json();
        })
        .then(user => {
            return fetch(`http://localhost:3000/users/${resetUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: newPassword, resetCode: null })
            });
        })
        .then(() => {
            alert("Password has been successfully reset.");
            localStorage.removeItem("resetUser");
            window.location.href = "login.html";
        })
        .catch(error => console.error("Error resetting password:", error));
}
window.resetPassword = resetPassword;

// --- LOGIN FORM ---
(function loginRedirectPatch(){
  const API = 'http://localhost:3000';
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailEl = loginForm.querySelector('#email');
    const passEl = loginForm.querySelector('#password');
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passEl ? passEl.value.trim() : '';
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      // json-server style lookup
      const res = await fetch(`${API}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await res.json();
      if (!users || users.length === 0) {
        alert('Invalid credentials');
        return;
      }
      const user = users[0];
      localStorage.setItem('currentUser', JSON.stringify(user));

      // redirect to saved destination or to showcase
      const redirect = localStorage.getItem('postLoginRedirect') || 'showcase.html';
      localStorage.removeItem('postLoginRedirect');
      window.location.href = redirect;
    } catch (err) {
      console.error('Login failed', err);
      alert('Login error. Check console for details.');
    }
  });
})();

// --- PROPERTY FORM ---
const propertyForm = document.getElementById("propertyForm");
if (propertyForm) {
    propertyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const location = document.getElementById("location").value;
        const price = document.getElementById("price").value;
        const description = document.getElementById("description").value;
        const agent = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!agent) {
            alert("You must be logged in to upload a property.");
            return;
        }
        const propertyData = {
            title,
            location,
            price,
            description,
            agent: agent.email
        };
        fetch("http://localhost:3000/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(propertyData)
        })
        .then(response => response.json())
        .then(() => {
            alert("Property uploaded successfully!");
            propertyForm.reset();
        })
        .catch(error => console.error("Error:", error));
    });
}

<button onclick="localStorage.removeItem('currentUser'); window.location.href='login.html';">Logout</button>
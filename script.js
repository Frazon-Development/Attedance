// User data from PDF
const users = {
    "FZWD#01": { name: "Aatheesh Kumaran", password: "pass123", role: "user" },
    "FZWD#02": { name: "Rohith R D", password: "pass123", role: "user" },
    "FZWD#03": { name: "Sanjay C", password: "pass123", role: "user" },
    "FZWD#04": { name: "Goushik", password: "pass123", role: "user" },
    "FZGD#01": { name: "Udhaya Priyan K", password: "pass123", role: "user" },
    "FZ3D#01": { name: "Ranjith S", password: "pass123", role: "user" },
    "FZPG#01": { name: "Aishwarya S", password: "pass123", role: "user" },
    "FZPG#02": { name: "Jothishree", password: "pass123", role: "user" },
    "FZCW#01": { name: "Jawahar Sadhique A", password: "pass123", role: "user" },
    "FZRD#01": { name: "Afsiya Mishal", password: "pass123", role: "user" },
    "FZRD#02": { name: "Hiba Shirin A", password: "pass123", role: "user" },
    
    "FZADMIN": { name: "Admin", password: "admin123", role: "admin" }
};

// Login function
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userRole", users[username].role);
        loadDashboard();
    } else {
        alert("Invalid login!");
    }
}

// Load user or admin panel
function loadDashboard() {
    let user = localStorage.getItem("loggedInUser");
    let role = localStorage.getItem("userRole");

    if (!user) {
        document.getElementById("login").style.display = "block";
        document.getElementById("user-panel").style.display = "none";
        document.getElementById("admin-panel").style.display = "none";
        return;
    }

    document.getElementById("login").style.display = "none";

    if (role === "admin") {
        document.getElementById("admin-panel").style.display = "block";
        generateAdminLogs();
    } else {
        document.getElementById("user-panel").style.display = "block";
        document.getElementById("user-name").innerText = users[user].name;
        generateUserLogs(user);
    }
}

// Mark Login
function markLogin() {
    let user = localStorage.getItem("loggedInUser");
    let today = new Date();
    let dateKey = today.toISOString().split("T")[0];

    let logs = JSON.parse(localStorage.getItem("workLogs")) || {};
    if (!logs[user]) logs[user] = {};
    
    if (logs[user][dateKey]?.login) {
        alert("You have already logged in today!");
        return;
    }

    logs[user][dateKey] = { login: today.toLocaleString(), logout: null };
    localStorage.setItem("workLogs", JSON.stringify(logs));

    generateUserLogs(user);
}

// Mark Logout
function markLogout() {
    let user = localStorage.getItem("loggedInUser");
    let today = new Date();
    let dateKey = today.toISOString().split("T")[0];

    let logs = JSON.parse(localStorage.getItem("workLogs")) || {};
    if (!logs[user] || !logs[user][dateKey]?.login) {
        alert("You need to login first!");
        return;
    }
    
    if (logs[user][dateKey]?.logout) {
        alert("You have already logged out today!");
        return;
    }

    logs[user][dateKey].logout = today.toLocaleString();
    localStorage.setItem("workLogs", JSON.stringify(logs));

    generateUserLogs(user);
}

// Generate User Work Log Table
function generateUserLogs(user) {
    let logs = JSON.parse(localStorage.getItem("workLogs")) || {};
    let userLogs = logs[user] || {};
    let table = "<tr><th>Date</th><th>Login Time</th><th>Logout Time</th></tr>";

    Object.keys(userLogs).forEach(date => {
        let loginTime = userLogs[date].login || "Not Logged In";
        let logoutTime = userLogs[date].logout || "Not Logged Out";
        table += `<tr><td>${date}</td><td>${loginTime}</td><td>${logoutTime}</td></tr>`;
    });

    document.getElementById("user-log-table").innerHTML = table;
}

// Generate Admin Logs Table
function generateAdminLogs() {
    let logs = JSON.parse(localStorage.getItem("workLogs")) || {};
    let table = "<tr><th>Employee ID</th><th>Name</th><th>Date</th><th>Login</th><th>Logout</th></tr>";

    Object.keys(logs).forEach(user => {
        Object.keys(logs[user]).forEach(date => {
            let login = logs[user][date].login || "Not Logged In";
            let logout = logs[user][date].logout || "Not Logged Out";
            table += `<tr><td>${user}</td><td>${users[user].name}</td><td>${date}</td><td>${login}</td><td>${logout}</td></tr>`;
        });
    });

    document.getElementById("admin-log-table").innerHTML = table;
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    location.reload();
}

// Auto Load Dashboard
window.onload = loadDashboard;

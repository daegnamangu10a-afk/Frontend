// =====================================================
// REGISTRATION
// =====================================================

function registerUser() {

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");

    const message = document.getElementById("registerMessage");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // -------------------------
    // Required fields
    // -------------------------
    if (name === "") {
        message.innerText = "Please enter your full name.";
        return;
    }

    if (email === "") {
        message.innerText = "Please enter your email address.";
        return;
    }

    if (password === "") {
        message.innerText = "Please enter your password.";
        return;
    }

    // -------------------------
    // Email regex
    // -------------------------
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;

    if (!emailRegex.test(email)) {
        message.innerText =
            "Please enter a valid email address.";
        return;
    }

    // -------------------------
    // Password regex
    // Minimum 6 characters
    // -------------------------

    const passwordRegex = /^.{6,}$/;

    if (!passwordRegex.test(password)) {
        message.innerText = "Password must contain at least 6 characters.";
        return;
    }

    message.innerText = "Creating your account...";

    // -------------------------
    // API request
    // -------------------------

    fetch(
        "https://electo-7p79.onrender.com/api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }
    )
    .then(response => {
        return response.text().then(data => {
            if (!response.ok) {
                throw new Error(data);
            }
            return data;
        });
    })
    .then(data => {
        console.log(
            "Electo registration response:",
            data
        );

        message.innerText =
            "Registration successful! Redirecting to login...";

        setTimeout(() => {
            window.location.href =
                "index.html";
        }, 1200);
    })
    .catch(error => {
        console.error(
            "Electo registration error:",
            error
        );

        message.innerText = error.message || "Registration failed. Please try again.";
    });
}

// =====================================================
// LOGIN
// =====================================================

function loginUser() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // -------------------------
    // Required fields
    // -------------------------
    if (email === "") {
        message.innerText = "Please enter your email address.";
        return;
    }

    if (password === "") {
        message.innerText = "Please enter your password.";
        return;
    }

    message.innerText = "Verifying credentials...";

    // -------------------------
    // API request
    // -------------------------

    fetch(
        "https://electo-7p79.onrender.com/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    )
    .then(response => {
        return response.text().then(data => {
            if (!response.ok) {
                throw new Error(data);
            }
            return data;
        });
    })
    .then(data => {
        data = data.trim();
        console.log(
            "Electo login response:",
            data
        );

        // -------------------------
        // ADMIN
        // -------------------------
        if (data === "ADMIN") {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRole", "ADMIN");

            message.innerText = "Login successful! Opening Admin Dashboard...";

            setTimeout(() => {
                window.location.href = "admin-dashboard.html";
            }, 700);
        }

        // -------------------------
        // VOTER
        // -------------------------
        else if (data === "VOTER") {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRole", "VOTER");

            message.innerText = "Login successful! Opening Voter Dashboard...";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);
        }

        // -------------------------
        // Unexpected response
        // -------------------------
        else {
            message.innerText =
                data;
        }
    })
    .catch(error => {
        console.error("Electo login error:", error);
        message.innerText = error.message || "Unable to login. Please try again.";
    });
}

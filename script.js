function sendOTP() {

    const emailInput = document.getElementById("email");
    const message = document.getElementById("message");

    const email = emailInput.value.trim();

    if (email === "") {
        message.innerText = "Please enter your email ID.";
        return;
    }

    message.innerText = "Sending OTP...";

    const url =
        "https://electo-7p79.onrender.com/api/otp/send?email=" +
        encodeURIComponent(email);

    fetch(url, {
        method: "POST"
    })
    .then(response => {

        return response.text().then(data => {

            if (!response.ok) {
                throw new Error(data);
            }

            return data;
        });
    })
    .then(data => {

        console.log("Electo server:", data);

        if (data.startsWith("OTP sent successfully")) {

            localStorage.setItem("userEmail", email);

            message.innerText =
                "OTP sent successfully! Check your email.";

            setTimeout(() => {
                window.location.href = "otp.html";
            }, 1200);

        } else {

            message.innerText = data;
        }
    })
    .catch(error => {

        console.error("Electo OTP Error:", error);

        message.innerText =
            "Unable to send OTP. Please make sure Electo server is running.";
    });
}


function verifyOTP() {

    const otpInput = document.getElementById("otp");
    const message = document.getElementById("otpMessage");

    const otp = otpInput.value.trim();
    const email = localStorage.getItem("userEmail");

    if (!email) {
        message.innerText =
            "Email not found. Please start again.";
        return;
    }

    if (otp === "") {
        message.innerText =
            "Please enter the OTP.";
        return;
    }

    message.innerText = "Verifying OTP...";

    const url =
        "https://electo-7p79.onrender.com/api/otp/verify?email=" +
        encodeURIComponent(email) +
        "&otp=" +
        encodeURIComponent(otp);

    fetch(url, {
        method: "POST"
    })
    .then(response => response.text())
    .then(data => {

        data = data.trim();

        console.log("Electo verification response:", data);

        // =========================
        // ADMIN LOGIN
        // =========================

        if (data === "ADMIN") {

            localStorage.setItem("userRole", "ADMIN");

            message.innerText =
                "Admin login successful! Opening Dashboard...";

            setTimeout(() => {

                window.location.href =
                    "admin-dashboard.html";

            }, 1000);
        }

        // =========================
        // VOTER LOGIN
        // =========================

        else if (data === "VOTER") {

            localStorage.setItem("userRole", "VOTER");

            message.innerText =
                "Voter login successful! Opening Dashboard...";

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 1000);
        }

        // =========================
        // OTHER RESPONSE
        // =========================

        else {

            message.innerText = data;
        }
    })
    .catch(error => {

        console.error("OTP verification error:", error);

        message.innerText =
            "Unable to verify OTP. Please check the server.";
    });
}
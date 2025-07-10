document.getElementById("signup").addEventListener("click", function () {
  window.location.href = "signUp.html";
});

document.querySelector(".signin-btn").addEventListener("click", () => {
  const userName = document
    .querySelector("input[placeholder='Username']")
    .value.trim();
  const password = document
    .querySelector("input[placeholder='Password']")
    .value.trim();

  if (!userName || !password) {
    alert("Please enter both username and password.");
    return;
  }

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Login successful!");
        // redirect to dashboard or homepage
        window.location.href = "/mainpage.html";
      } else {
        alert(data.message || "Login failed.");
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      alert("Server error.");
    });
});

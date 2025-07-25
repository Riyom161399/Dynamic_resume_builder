document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    username: form[0].value,
    name: form[1].value,
    birth_date: form[2].value,
    email: form[3].value,
    contact: form[4].value,
    address: form[5].value,
    password: form[6].value,
    confirm_password: form[7].value,
  };

  const res = await fetch("/signUp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  alert(text);

  if (res.ok) {
    window.location.href = "/signIn.html";
  }
});

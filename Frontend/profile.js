// Add smooth animations when the page loads
document.addEventListener("DOMContentLoaded", function () {
  const profileContainer = document.querySelector(".profile-container");
  profileContainer.style.opacity = "0";
  profileContainer.style.transform = "translateY(30px)";

  setTimeout(() => {
    profileContainer.style.transition = "all 0.6s ease";
    profileContainer.style.opacity = "1";
    profileContainer.style.transform = "translateY(0)";
  }, 100);

  // Add staggered animation to info items
  const infoItems = document.querySelectorAll(".info-item");
  infoItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";

    setTimeout(() => {
      item.style.transition = "all 0.4s ease";
      item.style.opacity = "1";
      item.style.transform = "translateX(0)";
    }, 300 + index * 100);
  });
});

// Add click effect to contact buttons
document.querySelectorAll(".contact-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("div");
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.6)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.left = e.offsetX + "px";
    ripple.style.top = e.offsetY + "px";
    ripple.style.width = ripple.style.height = "20px";
    ripple.style.marginLeft = ripple.style.marginTop = "-10px";

    this.style.position = "relative";
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

/* 3. OPTIONAL: ADD THIS JAVASCRIPT FOR MORE DYNAMIC EFFECTS */

// Add this to the existing script section or create a new one
function createRandomShapes() {
  const shapesContainer = document.querySelector(".animated-shapes");
  const colors = [
    "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
    "linear-gradient(45deg, #45b7d1, #96ceb4)",
    "linear-gradient(45deg, #feca57, #ff9ff3)",
    "linear-gradient(45deg, #54a0ff, #5f27cd)",
    "linear-gradient(45deg, #ff6b6b, #feca57)",
    "linear-gradient(45deg, #4ecdc4, #45b7d1)",
  ];

  // Create additional random shapes
  setInterval(() => {
    const shape = document.createElement("div");
    shape.className = "shape dynamic-shape";
    shape.style.width = Math.random() * 20 + 10 + "px";
    shape.style.height = shape.style.width;
    shape.style.background = colors[Math.floor(Math.random() * colors.length)];
    shape.style.top = Math.random() * 100 + "%";
    shape.style.left = "-30px";
    shape.style.animationDuration = Math.random() * 4 + 6 + "s";
    shape.style.opacity = Math.random() * 0.6 + 0.3;

    shapesContainer.appendChild(shape);

    // Remove shape after animation
    setTimeout(() => {
      if (shape.parentNode) {
        shape.parentNode.removeChild(shape);
      }
    }, 10000);
  }, 2000);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Existing initialization code...

  // Add dynamic shapes
  createRandomShapes();

  // Add hover effect to pause/resume animation
  const container = document.querySelector(".profile-container");
  container.addEventListener("mouseenter", function () {
    this.style.animationPlayState = "paused";
    document.querySelectorAll(".shape").forEach((shape) => {
      shape.style.animationPlayState = "paused";
    });
  });

  container.addEventListener("mouseleave", function () {
    this.style.animationPlayState = "running";
    document.querySelectorAll(".shape").forEach((shape) => {
      shape.style.animationPlayState = "running";
    });
  });
});

// Fetch profile from the backend

document.addEventListener("DOMContentLoaded", function () {
  const profileusername = localStorage.getItem("userName");

  if (!profileusername) {
    console.error("username not found in local storage");
    return;
  }

  fetch(`/api/profile/${profileusername}`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // Update the profile section with fetched data
        document.getElementById("profile-email").textContent = data.email;
        document.getElementById("profile-name").textContent = data.name;
        document.getElementById("profile-contact").textContent = data.contact;
        document.getElementById("profile-address").textContent = data.address;
      }
    })
    .catch((error) => {
      console.error("Error fetching  profile:", error);
    });
});

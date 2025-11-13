document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.getElementById("formContainer");
  const modal = document.getElementById("responseModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const closeBtn = document.getElementById("closeModal");

  // Додаємо події на всі кнопки вакансій
  document.querySelectorAll(".apply-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const position = btn.getAttribute("data-position");
      showForm(position);
    });
  });

  function showForm(position) {
    formContainer.innerHTML = `
      <div class="apply-section" id="applyForm">
        <h2>Подати заявку на посаду: ${position}</h2>
        <form action="https://formspree.io/f/mqawadop" method="POST">
          <label>Ваше ім’я:
            <input type="text" name="name" required />
          </label>
          <label>Електронна пошта:
            <input type="email" name="email" required />
          </label>
          <label>Коротко про вас:
            <textarea name="message" required></textarea>
          </label>
          <input type="hidden" name="position" value="${position}" />
          <button type="submit">Надіслати заявку</button>
          <div class="close-form" id="closeForm">Скасувати</div>
        </form>
      </div>
    `;

    const applyFormDiv = document.getElementById("applyForm");
    const form = applyFormDiv.querySelector("form");
    const closeFormBtn = document.getElementById("closeForm");

    setTimeout(() => applyFormDiv.classList.add("show"), 10);

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const data = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(response => {
          applyFormDiv.classList.remove("show");
          setTimeout(() => applyFormDiv.remove(), 300);

          if(response.ok) {
            modalTitle.textContent = "Дякуємо!";
            modalMessage.textContent = "Ваша заявка успішно надіслана! Ми зв’яжемось із вами найближчим часом.";
            modal.classList.add("active");
          } else {
            modalTitle.textContent = "Помилка!";
            modalMessage.textContent = "Сталася помилка при надсиланні. Спробуйте ще раз.";
            modal.classList.add("active");
          }
        })
        .catch(() => {
          applyFormDiv.classList.remove("show");
          setTimeout(() => applyFormDiv.remove(), 300);

          modalTitle.textContent = "Помилка з’єднання!";
          modalMessage.textContent = "Не вдалося встановити з’єднання з сервером.";
          modal.classList.add("active");
        });
    });

    closeFormBtn.addEventListener("click", () => {
      applyFormDiv.classList.remove("show");
      setTimeout(() => applyFormDiv.remove(), 300);
    });
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
});

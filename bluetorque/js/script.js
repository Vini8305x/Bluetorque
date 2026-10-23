/* =========================================================
   BlueTorque Estética Automotiva — script.js
   =========================================================
   INFORMAÇÕES QUE VOCÊ VAI QUERER ALTERAR ESTÃO TODAS AQUI EM CIMA.
   Não precisa mexer em mais nenhuma parte do código para trocar
   telefone, Instagram, endereço ou nome da empresa.
   ========================================================= */

const CONFIG = {
  // Nome da empresa (aparece no rodapé, título da aba, etc. via HTML —
  // se quiser trocar o nome em todo o site, troque também no index.html)
  companyName: "BlueTorque Estética Automotiva",

  // Número de WhatsApp no formato internacional, SOMENTE NÚMEROS
  // (código do país + DDD + número). Exemplo real: 5511999998888
  whatsappNumber: "5511999998888", // <-- SUBSTITUA pelo número real do cliente

  // Mensagem padrão que já vem preenchida ao abrir o WhatsApp
  whatsappMessage: "Olá! Vim pelo site da BlueTorque e gostaria de solicitar um orçamento.",

  // Usuário do Instagram (sem @)
  instagramUser: "bluetorque.estetica", // <-- SUBSTITUA pelo perfil real

  // Endereço completo exibido na seção de localização
  address: "Endereço a definir — Ibiúna, São Paulo",
};

/* ---------------------------------------------------------
   Monta o link do WhatsApp a partir da config acima
   --------------------------------------------------------- */
function buildWhatsappLink() {
  const text = encodeURIComponent(CONFIG.whatsappMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function buildInstagramLink() {
  return `https://instagram.com/${CONFIG.instagramUser}`;
}

function applyConfig() {
  const waLink = buildWhatsappLink();
  document.querySelectorAll("[data-wa-link]").forEach((el) => {
    el.setAttribute("href", waLink);
  });

  const igLink = buildInstagramLink();
  document.querySelectorAll("[data-ig-link]").forEach((el) => {
    el.setAttribute("href", igLink);
  });

  const whatsappFloat = document.getElementById("whatsappFloat");
  if (whatsappFloat) whatsappFloat.setAttribute("href", waLink);

  const addressEl = document.getElementById("locationAddress");
  if (addressEl) addressEl.textContent = CONFIG.address;
}

/* ---------------------------------------------------------
   Header: muda de estilo ao rolar a página
   --------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------
   Menu hambúrguer (mobile)
   --------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  if (!hamburger || !nav) return;

  const closeNav = () => {
    hamburger.classList.remove("is-open");
    nav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

/* ---------------------------------------------------------
   Slider "antes e depois"
   --------------------------------------------------------- */
function initCompareSlider() {
  const range = document.getElementById("compareRange");
  const before = document.getElementById("compareBefore");
  const handle = document.getElementById("compareHandle");
  if (!range || !before || !handle) return;

  const update = (value) => {
    before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    handle.style.left = `${value}%`;
  };

  update(range.value);
  range.addEventListener("input", (e) => update(e.target.value));
}

/* ---------------------------------------------------------
   Parallax suave
   Todo elemento com data-parallax="VELOCIDADE" se move em relação à rolagem:
   - valor positivo (ex: 0.35): fica "para trás" (efeito de fundo distante)
   - valor negativo (ex: -0.5): anda mais rápido (efeito de primeiro plano)
   O movimento é aplicado pela variável CSS --py. Desligado para quem
   ativou "reduzir movimento" no aparelho e reduzido pela metade no celular.
   --------------------------------------------------------- */
function initParallax() {
  const items = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  const smallScreen = window.matchMedia("(max-width: 760px)");
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    const factor = smallScreen.matches ? 0.5 : 1;

    items.forEach((el) => {
      const host = el.parentElement.closest("section") || el.parentElement;
      const rect = host.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return; // fora da tela

      const speed = parseFloat(el.dataset.parallax) * factor;
      const offset = rect.top + rect.height / 2 - vh / 2;
      el.style.setProperty("--py", (-offset * speed).toFixed(1) + "px");
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

/* ---------------------------------------------------------
   Inicialização
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initHeaderScroll();
  initMobileNav();
  initCompareSlider();
  initParallax();
});

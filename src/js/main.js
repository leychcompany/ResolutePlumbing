(function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.querySelector("[data-nav]");
  var label = toggle ? toggle.querySelector(".nav-toggle__label") : null;
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (label) label.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
    }
  });
})();

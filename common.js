document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  const header = `
    <header class="site-header">
      <nav class="nav">
        <a class="logo" href="index.html">0103abc</a>

        <div class="nav-links">
          <a href="index.html" class="${currentPage === "index.html" ? "active" : ""}">首页</a>
          <a href="about.html" class="${currentPage === "about.html" ? "active" : ""}">关于我</a>
        </div>
      </nav>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <p>© 2026 0103abc. Built with GitHub Pages.</p>
    </footer>
  `;

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);
});

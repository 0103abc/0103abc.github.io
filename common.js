document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // 读取用户之前选择的主题
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  // 导航栏配置
  const navItems = [
    {
      name: "首页",
      href: "index.html"
    },
    {
      name: "关于我",
      href: "about.html"
    },
    {
      name: "题解",
      href: "solution_list.html"
    },
    {
      name: "算法学习笔记",
      href: "algorithm_list.html"
    },
    {
      name: "应用",
      href: "app_list.html"
    },
    {
      name: "杂物",
      href: "misc.html"
    }
  ];

  // 自动生成导航链接
  const navLinks = navItems
    .map((item) => {
      const isActive = currentPage === item.href;

      return `
        <a href="${item.href}" class="${isActive ? "active" : ""}">
          ${item.name}
        </a>
      `;
    })
    .join("");

  const isLight = document.body.classList.contains("light");

  const header = `
    <header class="site-header">
      <nav class="nav">

        <a class="logo" href="index.html">
          <span class="logo-mark">01</span>
          <span class="logo-text">0103abc</span>
        </a>

        <div class="nav-right">

          <div class="nav-links" id="navLinks">
            ${navLinks}
          </div>

          <button class="theme-btn" id="themeBtn" type="button" title="切换亮暗主题">
            ${isLight ? "🌙" : "☀️"}
          </button>

          <button class="menu-btn" id="menuBtn" type="button" title="打开菜单">
            ☰
          </button>

        </div>

      </nav>
    </header>
  `;

  const footer = `
    <footer class="site-footer">
      <div class="footer-inner">
        <p>© ${new Date().getFullYear()} 0103abc. Built with GitHub Pages.</p>

        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="solution_list.html">Solutions</a>
          <a href="algorithm_list.html">Algorithms</a>
          <a href="app_list.html">Apps</a>
        </div>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);

  const themeBtn = document.querySelector("#themeBtn");
  const menuBtn = document.querySelector("#menuBtn");
  const navLinksElement = document.querySelector("#navLinks");

  // 亮暗模式切换
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLightNow = document.body.classList.contains("light");

    localStorage.setItem("theme", isLightNow ? "light" : "dark");

    themeBtn.textContent = isLightNow ? "🌙" : "☀️";
  });

  // 手机端菜单开关
  menuBtn.addEventListener("click", () => {
    navLinksElement.classList.toggle("open");

    if (navLinksElement.classList.contains("open")) {
      menuBtn.textContent = "×";
    } else {
      menuBtn.textContent = "☰";
    }
  });

  // 点击导航链接后，自动关闭手机端菜单
  navLinksElement.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksElement.classList.remove("open");
      menuBtn.textContent = "☰";
    });
  });
});

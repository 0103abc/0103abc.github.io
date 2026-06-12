document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // 读取用户之前选择的主题
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
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
      name: "做题记录", 
      href: "solve_list.html"
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

  const isDark = document.body.classList.contains("dark");

  const header = `
    <header class="site-header">
      <nav class="nav">

        <a class="logo" href="index.html">
          <img
            class="logo-img"
            src="https://cdn.luogu.com.cn/upload/image_hosting/jabg55zn.png"
            alt="0103abc"
          >
        </a>

        <div class="nav-right">

          <div class="nav-links" id="navLinks">
            ${navLinks}
          </div>

          <button class="theme-btn" id="themeBtn" type="button" title="切换亮暗主题">
            ${isDark ? "☀️" : "🌙"}
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
    document.body.classList.toggle("dark");

    const isDarkNow = document.body.classList.contains("dark");

    localStorage.setItem("theme", isDarkNow ? "dark" : "light");

    themeBtn.textContent = isDarkNow ? "☀️" : "🌙";
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

  // 初始化单击折线彩带特效
  initClickRibbonEffect();
});

function initClickRibbonEffect() {
  const canvas = document.createElement("canvas");
  canvas.className = "click-ribbon-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let ribbons = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function randomColor() {
    const colors = [
      "rgba(251, 113, 133, 0.42)",
      "rgba(244, 114, 182, 0.35)",
      "rgba(96, 165, 250, 0.34)",
      "rgba(45, 212, 191, 0.34)",
      "rgba(134, 239, 172, 0.38)",
      "rgba(253, 186, 116, 0.34)"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createRibbon(x, y) {
    const count = 8;

    for (let i = 0; i < count; i++) {
      const points = [];
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.4;
      const length = 4 + Math.floor(Math.random() * 4);

      let px = x;
      let py = y;

      for (let j = 0; j < length; j++) {
        px += Math.cos(angle + Math.random() * 0.8 - 0.4) * (10 + Math.random() * 18);
        py += Math.sin(angle + Math.random() * 0.8 - 0.4) * (10 + Math.random() * 18);

        points.push({
          x: px,
          y: py
        });
      }

      ribbons.push({
        points,
        angle,
        speed,
        color: randomColor(),
        alpha: 1,
        life: 0,
        maxLife: 55 + Math.random() * 25,
        lineWidth: 0.8 + Math.random() * 1.1
      });
    }
  }

  function drawRibbon(ribbon) {
    if (ribbon.points.length < 2) {
      return;
    }

    ctx.save();

    ctx.globalAlpha = ribbon.alpha;
    ctx.strokeStyle = ribbon.color;
    ctx.lineWidth = ribbon.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(ribbon.points[0].x, ribbon.points[0].y);

    for (let i = 1; i < ribbon.points.length; i++) {
      ctx.lineTo(ribbon.points[i].x, ribbon.points[i].y);
    }

    ctx.stroke();

    ctx.restore();
  }

  function updateRibbon(ribbon) {
    ribbon.life++;
    ribbon.alpha = 1 - ribbon.life / ribbon.maxLife;

    const driftX = Math.cos(ribbon.angle) * ribbon.speed;
    const driftY = Math.sin(ribbon.angle) * ribbon.speed - 0.35;

    for (const point of ribbon.points) {
      point.x += driftX + Math.sin(ribbon.life * 0.08) * 0.3;
      point.y += driftY + Math.cos(ribbon.life * 0.06) * 0.3;
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    ribbons = ribbons.filter((ribbon) => ribbon.life < ribbon.maxLife);

    for (const ribbon of ribbons) {
      updateRibbon(ribbon);
      drawRibbon(ribbon);
    }

    requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener("click", (event) => {
    createRibbon(event.clientX, event.clientY);
  });
}

(function () {
  "use strict";
  var cv = document.querySelector(".bg-neural");
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var LINK = 132, LINK2 = LINK * LINK;
  var W = 0, H = 0, nodos = [], pulsos = [], ultimo = 0, vivo = false;
  var raton = { x: -9e3, y: -9e3 };

  var BLANCO = "255,255,255";
  var AZUL = ["96,165,250", "147,197,253", "59,130,246"];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(45, Math.min(140, Math.round(W * H / 12000)));
    nodos = [];
    for (var i = 0; i < n; i++) {
      nodos.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.8,
        fase: Math.random() * 6.28,
        seed: Math.random() * 1000,
        hub: Math.random() < 0.08,
        azul: Math.random() < 0.45
      });
    }
    if (reduced) pintar(0, true);
  }

  function pintar(t, estatico) {
    ctx.clearRect(0, 0, W, H);

    if (!estatico) {
      for (var i = 0; i < nodos.length; i++) {
        var p = nodos[i];
        p.x += p.vx;
        p.y += p.vy;
        var sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.45) {
          p.vx *= 0.45 / sp;
          p.vy *= 0.45 / sp;
        }
        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30;
        if (p.y > H + 30) p.y = -30;
      }
    }

    for (var a = 0; a < nodos.length; a++) {
      var A = nodos[a];
      for (var b = a + 1; b < nodos.length; b++) {
        var B = nodos[b];
        var dx = A.x - B.x, dy = A.y - B.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK2) {
          var d = Math.sqrt(d2);
          var base = (1 - d / LINK) * 0.4;
          var k = a * 31 + b * 17;
          var al;
          if (k % 5 === 0) {
            al = base * (Math.sin(t * 0.008 + k * 1.7) > 0.25 ? 1.35 : 0.08);
          } else if (k % 7 === 0) {
            al = base * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.003 + k)));
          } else {
            al = base * (0.7 + 0.3 * Math.sin(t * 0.0015 + k * 0.3));
          }
          al = Math.max(0, Math.min(0.85, al));
          var col = k % 3 === 0 ? BLANCO : AZUL[k % 3];
          ctx.strokeStyle = "rgba(" + col + "," + al.toFixed(3) + ")";
          ctx.lineWidth = k % 3 === 0 ? 0.7 : 1;
          ctx.beginPath();
          ctx.moveTo(A.x, A.y);
          ctx.lineTo(B.x, B.y);
          ctx.stroke();
        }
      }
      var mx = A.x - raton.x, my = A.y - raton.y, md = mx * mx + my * my;
      if (md < 57600) {
        var ma = (1 - Math.sqrt(md) / 240) * 0.55;
        ctx.strokeStyle = "rgba(255,255,255," + ma.toFixed(3) + ")";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(raton.x, raton.y);
        ctx.stroke();
      }
    }

    if (!estatico) {
      if (t - ultimo > 300 && pulsos.length < 7) {
        ultimo = t;
        for (var z = 0; z < 14; z++) {
          var na = nodos[(Math.random() * nodos.length) | 0];
          var nb = nodos[(Math.random() * nodos.length) | 0];
          var dd = Math.hypot(na.x - nb.x, na.y - nb.y);
          if (dd > 30 && dd < LINK * 1.15) {
            pulsos.push({
              a: na,
              b: nb,
              t: 0,
              sp: 0.009 + Math.random() * 0.013,
              azul: Math.random() < 0.6
            });
            break;
          }
        }
      }
      pulsos = pulsos.filter(function (pl) {
        pl.t += pl.sp;
        if (pl.t >= 1) return false;
        var x = pl.a.x + (pl.b.x - pl.a.x) * pl.t;
        var y = pl.a.y + (pl.b.y - pl.a.y) * pl.t;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = pl.azul ? "rgba(147,197,253,.95)" : "rgba(255,255,255,.95)";
        ctx.shadowColor = pl.azul ? "#60a5fa" : "#ffffff";
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 6.283);
        ctx.fill();
        ctx.restore();
        return true;
      });
    }

    for (var j = 0; j < nodos.length; j++) {
      var q = nodos[j];
      var tit = estatico ? 0.85 : 0.45 + 0.55 * Math.sin(q.fase + t * 0.0022);
      if (Math.sin(t * 0.011 + q.seed) > 0.96) tit *= 0.25;
      var c2 = q.azul ? AZUL[j % 3] : BLANCO;
      if (q.hub) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        var g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 8);
        g.addColorStop(0, "rgba(" + c2 + "," + (0.3 * tit).toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + c2 + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r * 8, 0, 6.283);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "rgba(" + c2 + "," + Math.min(1, 0.35 + 0.55 * tit).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r, 0, 6.283);
      ctx.fill();
    }
  }

  function bucle(t) {
    if (vivo) {
      pintar(t, false);
      requestAnimationFrame(bucle);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (e) {
    raton.x = e.clientX;
    raton.y = e.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", function () {
    raton.x = raton.y = -9e3;
  });
  document.addEventListener("visibilitychange", function () {
    if (reduced) return;
    vivo = !document.hidden;
    if (vivo) requestAnimationFrame(bucle);
  });

  resize();
  if (!reduced) {
    vivo = true;
    requestAnimationFrame(bucle);
  }
})();

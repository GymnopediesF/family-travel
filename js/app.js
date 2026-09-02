/* =====================================================================
   页面逻辑 —— 一般不需要修改这个文件
   负责：生成目的地切换标签，并按当前目的地渲染景点卡片、问卷选项，
        在用户提交后计算推荐路线。内容来自 data.js 的 DESTINATIONS。
   ===================================================================== */

(function () {
  "use strict";

  // 占位图（当景点没有图片时显示），用内联 SVG，无需额外文件
  const PLACEHOLDER =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
        '<rect width="100%" height="100%" fill="#e3e8ee"/>' +
        '<text x="50%" y="50%" fill="#9aa5b1" font-size="20" ' +
        'text-anchor="middle" dominant-baseline="middle" ' +
        'font-family="sans-serif">暂无图片</text></svg>'
    );

  // 体力等级 → 样式类
  const EFFORT_CLASS = {
    "轻松": "eff-easy",
    "适中": "eff-mid",
    "费力": "eff-hard"
  };

  let currentDest = null; // 当前选中的目的地对象

  // ---------- 渲染目的地切换标签 ----------
  function renderTabs() {
    const nav = document.getElementById("dest-tabs");
    nav.innerHTML = DESTINATIONS.map(function (dest, i) {
      return (
        '<button class="dest-tab" data-index="' +
        i +
        '">' +
        dest.name +
        "</button>"
      );
    }).join("");

    nav.addEventListener("click", function (e) {
      const btn = e.target.closest(".dest-tab");
      if (!btn) return;
      selectDest(parseInt(btn.getAttribute("data-index"), 10));
    });
  }

  function selectDest(index) {
    currentDest = DESTINATIONS[index];
    // 高亮当前标签
    Array.prototype.forEach.call(
      document.querySelectorAll(".dest-tab"),
      function (b, i) {
        b.classList.toggle("active", i === index);
      }
    );
    // 更新标题、渲染内容、清空上一轮结果
    document.getElementById("spots-title").textContent =
      currentDest.name + " · 景点介绍";
    renderSpots();
    renderSurvey();
    resetResult();
    // 切换目的地时回到景点区顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- 渲染景点卡片 ----------
  function renderSpots() {
    const container = document.getElementById("spots");
    container.innerHTML = currentDest.spots
      .map(function (spot) {
        const imgs =
          spot.images && spot.images.length
            ? spot.images
                .slice(0, 2)
                .map(function (file) {
                  return (
                    '<img src="images/' +
                    file +
                    '" alt="' +
                    spot.name +
                    '" loading="lazy" ' +
                    "onerror=\"this.onerror=null;this.src='" +
                    PLACEHOLDER +
                    "'\" />"
                  );
                })
                .join("")
            : '<img src="' + PLACEHOLDER + '" alt="' + spot.name + '" />';

        const catClass = spot.category === "自然" ? "cat-nature" : "cat-culture";
        const catLabel = spot.category || "";
        const effortTag = spot.effort
          ? '<span class="spot-effort ' +
            (EFFORT_CLASS[spot.effort] || "") +
            '">体力 · ' +
            spot.effort +
            "</span>"
          : "";

        const reviews =
          spot.reviews && spot.reviews.length
            ? '<div class="spot-field spot-reviews">' +
              '<span class="field-label">真实评价</span>' +
              '<ul class="review-list">' +
              spot.reviews
                .map(function (r) {
                  return "<li>" + r + "</li>";
                })
                .join("") +
              "</ul></div>"
            : "";

        function fieldBlock(label, value) {
          if (!value) return "";
          return (
            '<div class="spot-field">' +
            '<span class="field-label">' +
            label +
            "</span><p>" +
            value +
            "</p></div>"
          );
        }

        return (
          '<article class="spot-card">' +
          '<div class="spot-images">' +
          imgs +
          "</div>" +
          '<div class="spot-body">' +
          '<div class="spot-head">' +
          '<h3 class="spot-name">' +
          spot.name +
          "</h3>" +
          (catLabel
            ? '<span class="spot-category ' + catClass + '">' + catLabel + "</span>"
            : "") +
          effortTag +
          "</div>" +
          // 结论放最上面，重点强调
          '<div class="spot-conclusion">' +
          '<span class="field-label">结论</span><p>' +
          (spot.conclusion || "") +
          "</p></div>" +
          fieldBlock("背景", spot.background) +
          fieldBlock("门票 / 时间", spot.ticket) +
          reviews +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  // ---------- 渲染问卷勾选项 ----------
  function renderSurvey() {
    const container = document.getElementById("survey-options");
    // showcaseOnly 的景点只展示、不进问卷
    const options = currentDest.spots.filter(function (spot) {
      return !spot.showcaseOnly;
    });
    container.innerHTML = options
      .map(function (spot) {
        return (
          '<label class="survey-option">' +
          '<input type="checkbox" value="' +
          spot.id +
          '" />' +
          "<span>" +
          spot.name +
          "</span></label>"
        );
      })
      .join("");
  }

  // ---------- 计算推荐路线 ----------
  function computeResults(selectedIds) {
    return currentDest.routes
      .map(function (route) {
        const hits = route.spotIds.filter(function (id) {
          return selectedIds.indexOf(id) !== -1;
        });
        const ratio = route.spotIds.length
          ? hits.length / route.spotIds.length
          : 0;
        return { route: route, hitCount: hits.length, ratio: ratio, hits: hits };
      })
      .filter(function (r) {
        return r.hitCount > 0;
      })
      .sort(function (a, b) {
        if (b.hitCount !== a.hitCount) return b.hitCount - a.hitCount;
        return b.ratio - a.ratio;
      });
  }

  function spotName(id) {
    const s = currentDest.spots.find(function (x) {
      return x.id === id;
    });
    return s ? s.name : id;
  }

  // ---------- 渲染结果 ----------
  function renderResults(results) {
    const section = document.getElementById("result-section");
    const container = document.getElementById("result");

    if (!results.length) {
      container.innerHTML =
        '<div class="route-card"><p class="route-desc">' +
        "你勾选的景点暂时没有匹配到现成路线，可以多选几个，或告诉规划者你的偏好。" +
        "</p></div>";
    } else {
      container.innerHTML = results
        .map(function (r, index) {
          const isTop = index === 0;
          const tags = r.route.spotIds
            .map(function (id) {
              const hit = r.hits.indexOf(id) !== -1;
              return (
                '<span class="route-spot-tag' +
                (hit ? " hit" : "") +
                '">' +
                spotName(id) +
                "</span>"
              );
            })
            .join("");

          return (
            '<article class="route-card' +
            (isTop ? " top" : "") +
            '">' +
            '<span class="route-badge">' +
            (isTop ? "最推荐" : "备选") +
            "</span>" +
            '<h3 class="route-name">' +
            r.route.name +
            "</h3>" +
            '<p class="route-desc">' +
            r.route.desc +
            "</p>" +
            '<p class="route-match">匹配到你勾选的 ' +
            r.hitCount +
            " 个景点</p>" +
            '<div class="route-spots">' +
            tags +
            "</div>" +
            "</article>"
          );
        })
        .join("");
    }

    section.classList.remove("hidden");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetResult() {
    const form = document.getElementById("survey-form");
    form.reset();
    Array.prototype.forEach.call(
      form.querySelectorAll(".survey-option"),
      function (el) {
        el.classList.remove("checked");
      }
    );
    document.getElementById("result-section").classList.add("hidden");
  }

  // ---------- 事件绑定（只绑一次） ----------
  function bindEvents() {
    const form = document.getElementById("survey-form");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const selected = Array.prototype.slice
        .call(form.querySelectorAll('input[type="checkbox"]:checked'))
        .map(function (c) {
          return c.value;
        });
      renderResults(computeResults(selected));
    });

    // 勾选高亮（事件委托）
    document
      .getElementById("survey-options")
      .addEventListener("change", function (e) {
        if (e.target && e.target.type === "checkbox") {
          e.target
            .closest(".survey-option")
            .classList.toggle("checked", e.target.checked);
        }
      });

    document.getElementById("reset-btn").addEventListener("click", resetResult);
  }

  // ---------- 启动 ----------
  document.addEventListener("DOMContentLoaded", function () {
    renderTabs();
    bindEvents();
    selectDest(0); // 默认显示第一个目的地
  });
})();

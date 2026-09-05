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

  // ---- 高德地图状态 ----
  let AMapRef = null; // 加载成功后的 AMap 命名空间
  let overviewMap = null; // 景点总览地图实例
  let routeMap = null; // 路线地图实例
  let mapReady = false;

  function coordOf(id) {
    return typeof COORDS !== "undefined" && COORDS[id] ? COORDS[id] : null;
  }

  // 通用信息块（标签 + 内容）
  function infoBlock(label, value) {
    if (!value) return "";
    return (
      '<div class="spot-field"><span class="field-label">' +
      label +
      "</span><p>" +
      value +
      "</p></div>"
    );
  }

  // 记录顶部标签栏高度，供手机端粘性地图定位
  function setTabsHeight() {
    const nav = document.getElementById("dest-tabs");
    if (nav) {
      document.documentElement.style.setProperty(
        "--tabs-h",
        nav.offsetHeight + "px"
      );
    }
  }

  // ---------- 渲染顶部切换标签（目的地 + 美食特产） ----------
  function renderTabs() {
    const nav = document.getElementById("dest-tabs");
    let html = DESTINATIONS.map(function (dest, i) {
      return (
        '<button class="dest-tab" data-view="dest" data-index="' +
        i +
        '">' +
        dest.name +
        "</button>"
      );
    }).join("");
    // 美食特产标签
    html += '<button class="dest-tab" data-view="food">衢州美食特产</button>';
    nav.innerHTML = html;

    nav.addEventListener("click", function (e) {
      const btn = e.target.closest(".dest-tab");
      if (!btn) return;
      if (btn.getAttribute("data-view") === "food") {
        showFoodView(btn);
      } else {
        selectDest(parseInt(btn.getAttribute("data-index"), 10));
      }
    });
  }

  function setActiveTab(btn) {
    Array.prototype.forEach.call(
      document.querySelectorAll(".dest-tab"),
      function (b) {
        b.classList.toggle("active", b === btn);
      }
    );
  }

  function selectDest(index) {
    currentDest = DESTINATIONS[index];
    // 高亮当前标签
    const btn = document.querySelector(
      '.dest-tab[data-view="dest"][data-index="' + index + '"]'
    );
    setActiveTab(btn);
    // 显示旅行视图、隐藏美食视图
    document.getElementById("travel-view").classList.remove("hidden");
    document.getElementById("food-view").classList.add("hidden");
    // 更新标题、渲染内容、清空上一轮结果
    document.getElementById("overview-title").textContent =
      currentDest.name + " · 景点地图";
    document.getElementById("spots-title").textContent =
      currentDest.name + " · 景点介绍";
    renderTripInfo();
    renderSpots();
    renderSurvey();
    resetResult();
    renderOverviewMap();
    // 切换目的地时回到顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- 渲染顶部行程时间 + 酒店信息 ----------
  function renderTripInfo() {
    const box = document.getElementById("trip-info");
    const d = currentDest;
    let html = "";
    if (d.dates) {
      html += '<div class="trip-dates">' + d.dates + "</div>";
    }
    if (d.hotel) {
      html +=
        '<div class="trip-hotel"><span class="trip-hotel-tag">住宿</span>' +
        "<span><b>" +
        d.hotel.name +
        "</b>" +
        (d.hotel.address
          ? '<span class="trip-hotel-addr">（' + d.hotel.address + "）</span>"
          : "") +
        "</span></div>";
    }
    box.innerHTML = html;
    box.style.display = html ? "" : "none";
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
    // showcaseOnly 只展示、autoSecondDay 是二日游固定第二日，都不进问卷
    const options = currentDest.spots.filter(function (spot) {
      return !spot.showcaseOnly && !spot.autoSecondDay;
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

  // 第二日固定安排卡片（如龙游二日游的六春湖）
  function secondDayCardHTML() {
    const sd = currentDest.secondDay;
    if (!sd) return "";
    const tags = sd.spotIds
      .map(function (id) {
        return '<span class="route-spot-tag hit">' + spotName(id) + "</span>";
      })
      .join("");
    return (
      '<article class="route-card day2">' +
      '<span class="route-badge day2">第二日</span>' +
      '<h3 class="route-name">' +
      sd.title +
      "</h3>" +
      '<p class="route-desc">' +
      (sd.note || "") +
      "</p>" +
      '<div class="route-spots">' +
      tags +
      "</div></article>"
    );
  }

  // ---------- 渲染结果 ----------
  function renderResults(results, selectedIds) {
    const section = document.getElementById("result-section");
    const container = document.getElementById("result");
    const hasSecondDay = !!currentDest.secondDay;

    let html;
    if (!results.length) {
      html =
        '<div class="route-card"><p class="route-desc">' +
        "你勾选的景点暂时没有匹配到现成路线，可以多选几个，或告诉规划者你的偏好。" +
        "</p></div>";
    } else {
      // 二日游时，把匹配到的第一条作为“第一日”
      const firstLabel = hasSecondDay ? "第一日" : "行程";
      html = results
        .map(function (r, index) {
          const isTop = index === 0;
          const badge = isTop
            ? hasSecondDay
              ? firstLabel + " · 最推荐"
              : "最推荐"
            : "备选";
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
            badge +
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
    // 追加固定的第二日
    html += secondDayCardHTML();
    container.innerHTML = html;

    section.classList.remove("hidden");
    // 按用户“选中的景点”直接渲染地图（无序号）
    renderSelectedMap(selectedIds);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- 地图：加载高德 ----------
  function loadAmap() {
    const cfg = window.AMAP_CONFIG || {};
    const box = document.getElementById("overview-map");
    if (!cfg.key || cfg.key.indexOf("填") !== -1) {
      box.innerHTML =
        '<div class="map-hint">尚未配置高德 Key。请在 <code>js/config.js</code> 填入你的 Key 和安全密钥。</div>';
      return;
    }
    if (typeof AMapLoader === "undefined") {
      box.innerHTML =
        '<div class="map-hint">地图脚本未加载，请检查网络或 loader.js 引入。</div>';
      return;
    }
    AMapLoader.load({ key: cfg.key, version: "2.0" })
      .then(function (AMap) {
        AMapRef = AMap;
        mapReady = true;
        renderOverviewMap();
      })
      .catch(function (e) {
        box.innerHTML =
          '<div class="map-hint">地图加载失败：' +
          (e && e.message ? e.message : e) +
          "。常见原因：安全密钥未配置，或当前域名未加入高德控制台的白名单。</div>";
        console.error(e);
      });
  }

  // ---------- 地图：景点总览 ----------
  function renderOverviewMap() {
    if (!mapReady || !AMapRef) return;
    const box = document.getElementById("overview-map");
    const spots = currentDest.spots.filter(function (s) {
      return coordOf(s.id);
    });
    if (!spots.length) {
      box.innerHTML = '<div class="map-hint">该目的地暂无坐标数据。</div>';
      return;
    }
    if (!overviewMap) {
      overviewMap = new AMapRef.Map("overview-map", {
        zoom: 11,
        resizeEnable: true
      });
    } else {
      overviewMap.clearMap();
    }
    const markers = spots.map(function (s) {
      const pos = coordOf(s.id);
      const m = new AMapRef.Marker({
        position: pos,
        title: s.name,
        label: {
          content: '<span class="amap-label">' + s.name + "</span>",
          direction: "top"
        }
      });
      m.on("click", function () {
        const iw = new AMapRef.InfoWindow({
          content:
            '<div class="amap-iw"><b>' +
            s.name +
            "</b><br/>" +
            (s.conclusion || "") +
            "</div>",
          offset: new AMapRef.Pixel(0, -34)
        });
        iw.open(overviewMap, pos);
      });
      return m;
    });
    overviewMap.add(markers);

    // 酒店标记（若有坐标）
    const all = markers.slice();
    if (currentDest.hotel && currentDest.hotel.coord) {
      const h = currentDest.hotel;
      const hm = new AMapRef.Marker({
        position: h.coord,
        content: '<div class="hotel-marker">住</div>',
        offset: new AMapRef.Pixel(-16, -16),
        zIndex: 130,
        label: {
          content: '<span class="amap-label hotel-label">' + h.name + "</span>",
          direction: "top"
        }
      });
      hm.on("click", function () {
        const iw = new AMapRef.InfoWindow({
          content:
            '<div class="amap-iw"><b>' +
            h.name +
            "</b><br/>" +
            (h.address || "") +
            "</div>",
          offset: new AMapRef.Pixel(0, -36)
        });
        iw.open(overviewMap, h.coord);
      });
      overviewMap.add(hm);
      all.push(hm);
    }
    overviewMap.setFitView(all);
  }

  // ---------- 地图：按“选中的景点”直接渲染（无序号、不连线） ----------
  function renderSelectedMap(selectedIds) {
    const titleEl = document.getElementById("route-map-title");
    const box = document.getElementById("route-map");
    const ids = selectedIds || [];
    if (!mapReady || !AMapRef || !ids.length) {
      titleEl.style.display = "none";
      box.style.display = "none";
      return;
    }
    const pts = ids
      .map(function (id) {
        const c = coordOf(id);
        return c ? { name: spotName(id), pos: c } : null;
      })
      .filter(Boolean);

    titleEl.style.display = "";
    box.style.display = "";
    if (!pts.length) {
      box.innerHTML = '<div class="map-hint">所选景点暂无坐标数据。</div>';
      return;
    }
    if (!routeMap) {
      routeMap = new AMapRef.Map("route-map", { zoom: 11, resizeEnable: true });
    } else {
      routeMap.clearMap();
    }
    const markers = pts.map(function (p) {
      return new AMapRef.Marker({
        position: p.pos,
        title: p.name,
        label: {
          content: '<span class="amap-label">' + p.name + "</span>",
          direction: "top"
        }
      });
    });
    routeMap.add(markers);
    routeMap.setFitView(markers);
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

  // ---------- 美食特产视图 ----------
  function foodCardHTML(f) {
    const img =
      f.images && f.images.length
        ? '<img src="images/' +
          f.images[0] +
          '" alt="' +
          f.name +
          '" loading="lazy" ' +
          "onerror=\"this.onerror=null;this.src='" +
          PLACEHOLDER +
          "'\" />"
        : '<img src="' + PLACEHOLDER + '" alt="' + f.name + '" />';

    const spicyClass =
      f.spicy === "辣"
        ? "spicy-hot"
        : f.spicy === "可选辣"
        ? "spicy-mid"
        : "spicy-none";

    const tags = (f.tags || [])
      .map(function (t) {
        return '<span class="food-tag">' + t + "</span>";
      })
      .join("");

    return (
      '<article class="spot-card">' +
      '<div class="spot-images">' +
      img +
      "</div>" +
      '<div class="spot-body">' +
      '<div class="spot-head">' +
      '<h3 class="spot-name">' +
      f.name +
      "</h3>" +
      '<span class="spicy-tag ' +
      spicyClass +
      '">' +
      f.spicy +
      "</span>" +
      "</div>" +
      (tags ? '<div class="food-tags">' + tags + "</div>" : "") +
      infoBlock("是什么", f.what) +
      infoBlock("为什么推荐", f.why) +
      infoBlock("去哪吃 / 哪里买", f.where) +
      "</div></article>"
    );
  }

  function renderFoods() {
    if (typeof FOODS === "undefined") return;
    document.getElementById("food-list").innerHTML = FOODS.filter(function (f) {
      return f.group === "美食";
    })
      .map(foodCardHTML)
      .join("");
    document.getElementById("specialty-list").innerHTML = FOODS.filter(function (
      f
    ) {
      return f.group === "特产";
    })
      .map(foodCardHTML)
      .join("");
  }

  function showFoodView(btn) {
    setActiveTab(btn);
    document.getElementById("travel-view").classList.add("hidden");
    document.getElementById("food-view").classList.remove("hidden");
    renderFoods();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      renderResults(computeResults(selected), selected);
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
    setTabsHeight();
    window.addEventListener("resize", setTabsHeight);
    bindEvents();
    selectDest(0); // 默认显示第一个目的地
    loadAmap(); // 加载高德地图（加载完成后自动渲染总览地图）
  });
})();

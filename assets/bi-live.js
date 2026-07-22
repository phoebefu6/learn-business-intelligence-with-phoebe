/* learn-business-intelligence-with-phoebe - live BI dashboard playground
   Every .bibox on a page is a tiny real BI tool running in your browser:
   pick a dimension x a measure x a chart type, and the playground writes
   the SQL for you (the semantic-layer idea, made touchable), runs it on a
   fresh copy of the Daybreak warehouse via sql.js (SQLite in WebAssembly),
   and renders the chart. No server, no network after the one-time wasm load.

   Markup a page uses:
     <div class="bibox" data-dim="month" data-measure="revenue"
          data-chart="line" data-caption="optional line under the box"></div>
   data-dim / data-measure / data-chart set the starting state only - every
   box is fully interactive. data-chart="kpi" ignores the dimension. */

(function () {
  var SQLReady = null;

  function loadEngine() {
    if (SQLReady) return SQLReady;
    SQLReady = new Promise(function (resolve, reject) {
      if (typeof initSqlJs !== "function") {
        reject(new Error("sql-wasm.js did not load"));
        return;
      }
      initSqlJs({ locateFile: function (f) { return "../assets/" + f; } })
        .then(resolve, reject);
    });
    return SQLReady;
  }

  /* ---------- the semantic layer: define once, generate SQL everywhere ---------- */
  var BASE =
    "FROM orders o\n" +
    "JOIN order_items oi ON oi.order_id = o.order_id\n" +
    "JOIN products p     ON p.product_id = oi.product_id\n" +
    "JOIN customers c    ON c.customer_id = o.customer_id";

  var DIMS = {
    month:    { label: "Month",        sql: "strftime('%Y-%m', o.order_date)", sort: "label" },
    city:     { label: "City",         sql: "c.city",     sort: "value" },
    country:  { label: "Country",      sql: "c.country",  sort: "value" },
    plan:     { label: "Plan",         sql: "c.plan",     sort: "value" },
    category: { label: "Category",     sql: "p.category", sort: "value" },
    roast:    { label: "Roast",        sql: "COALESCE(p.roast,'(none)')", sort: "value" },
    channel:  { label: "Channel",      sql: "o.channel",  sort: "value" },
    status:   { label: "Order status", sql: "o.status",   sort: "value" }
  };

  var MEASURES = {
    revenue:   { label: "Revenue",         sql: "ROUND(SUM(oi.quantity * oi.unit_price), 2)", fmt: "money" },
    orders:    { label: "Orders",          sql: "COUNT(DISTINCT o.order_id)",                 fmt: "int" },
    units:     { label: "Units sold",      sql: "SUM(oi.quantity)",                           fmt: "int" },
    customers: { label: "Buying customers",sql: "COUNT(DISTINCT o.customer_id)",              fmt: "int" },
    aov:       { label: "Avg order value", sql: "ROUND(SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id), 2)", fmt: "money" }
  };

  var CHARTS = { bar: "Bar", line: "Line", kpi: "KPI card" };
  var MAX_BARS = 8;

  function buildSql(dimKey, meaKey, chart) {
    var m = MEASURES[meaKey];
    if (chart === "kpi") {
      return "SELECT " + m.sql + " AS " + meaKey + "\n" + BASE + ";";
    }
    var d = DIMS[dimKey];
    var order = d.sort === "label" ? "1 ASC" : "2 DESC";
    return "SELECT " + d.sql + " AS " + dimKey + ",\n       " +
      m.sql + " AS " + meaKey + "\n" + BASE +
      "\nGROUP BY 1\nORDER BY " + order + ";";
  }

  function fmt(v, kind) {
    if (v === null || v === undefined) return "-";
    if (kind === "money") {
      return "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return Number(v).toLocaleString("en-US");
  }

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- chart renderers (plain SVG, theme colors from CSS vars) ---------- */
  function renderKpi(rows, meaKey) {
    var navy = cssVar("--indigo-deep", "#122B4A");
    var m = MEASURES[meaKey];
    var val = rows.length ? rows[0][1] : null;
    return '<div class="bi-kpi" style="border-color:' + navy + '">' +
      '<span class="bi-kpi-label">' + esc(m.label) + ' · all of Daybreak</span>' +
      '<span class="bi-kpi-value">' + fmt(val, m.fmt) + "</span></div>";
  }

  function renderBar(rows, dimKey, meaKey) {
    var accent = cssVar("--indigo", "#1D4E79");
    var gold = cssVar("--amber", "#C99700");
    var muted = cssVar("--muted", "#5A6B80");
    var m = MEASURES[meaKey];
    var shown = rows.slice(0, MAX_BARS);
    var max = 0;
    shown.forEach(function (r) { if (+r[1] > max) max = +r[1]; });
    if (!max) max = 1;
    var rowH = 34, labelW = 130, valueW = 92, W = 820;
    var barMax = W - labelW - valueW - 20;
    var H = shown.length * rowH + 8;
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Bar chart" style="width:100%;height:auto;display:block">';
    shown.forEach(function (r, i) {
      var y = i * rowH + 6;
      var w = Math.max(3, Math.round((+r[1] / max) * barMax));
      var top = i === 0;
      svg += '<text x="' + (labelW - 8) + '" y="' + (y + 15) + '" text-anchor="end" font-size="12" fill="' + muted + '">' + esc(String(r[0]).slice(0, 16)) + "</text>" +
        '<rect x="' + labelW + '" y="' + y + '" width="' + w + '" height="20" rx="4" fill="' + (top ? gold : accent) + '"></rect>' +
        '<text x="' + (labelW + w + 8) + '" y="' + (y + 15) + '" font-size="12" font-weight="700" fill="' + accent + '">' + fmt(r[1], m.fmt) + "</text>";
    });
    svg += "</svg>";
    var note = rows.length > MAX_BARS ? '<p class="sql-note">Top ' + MAX_BARS + " of " + rows.length + " shown (a real dashboard would let you drill).</p>" : "";
    return svg + note;
  }

  function renderLine(rows, dimKey, meaKey) {
    var accent = cssVar("--indigo", "#1D4E79");
    var gold = cssVar("--amber", "#C99700");
    var muted = cssVar("--muted", "#5A6B80");
    var faint = cssVar("--hairline", "#E4EBF3");
    var m = MEASURES[meaKey];
    if (rows.length < 2) return renderBar(rows, dimKey, meaKey);
    var W = 820, H = 230, padL = 66, padR = 24, padT = 18, padB = 40;
    var max = 0;
    rows.forEach(function (r) { if (+r[1] > max) max = +r[1]; });
    if (!max) max = 1;
    var iw = W - padL - padR, ih = H - padT - padB;
    var pts = rows.map(function (r, i) {
      return [padL + (i / (rows.length - 1)) * iw, padT + ih - (+r[1] / max) * ih, r];
    });
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Line chart" style="width:100%;height:auto;display:block">';
    [0, 0.5, 1].forEach(function (t) {
      var y = padT + ih - t * ih;
      svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="' + faint + '" stroke-width="1"></line>' +
        '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="' + muted + '">' + fmt(Math.round(max * t), m.fmt === "money" ? "money" : "int") + "</text>";
    });
    svg += '<polyline fill="none" stroke="' + accent + '" stroke-width="2.5" points="' +
      pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"></polyline>';
    var minI = 0;
    rows.forEach(function (r, i) { if (+r[1] < +rows[minI][1]) minI = i; });
    pts.forEach(function (p, i) {
      var dip = i === minI;
      svg += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (dip ? 5 : 3.5) + '" fill="' + (dip ? gold : accent) + '"></circle>';
      var lbl = String(p[2][0]);
      if (rows.length <= 10 || i % 2 === 0 || i === rows.length - 1) {
        svg += '<text x="' + p[0].toFixed(1) + '" y="' + (H - padB + 22) + '" text-anchor="middle" font-size="11" fill="' + muted + '">' + esc(lbl.slice(0, 8)) + "</text>";
      }
    });
    svg += "</svg>";
    return svg;
  }

  /* ---------- box wiring ---------- */
  function makeSelect(options, current, cls) {
    var html = '<select class="bi-select ' + cls + '">';
    Object.keys(options).forEach(function (k) {
      var lbl = options[k].label || options[k];
      html += '<option value="' + k + '"' + (k === current ? " selected" : "") + ">" + esc(lbl) + "</option>";
    });
    return html + "</select>";
  }

  function initBox(box, SQL) {
    var state = {
      dim: box.getAttribute("data-dim") || "month",
      measure: box.getAttribute("data-measure") || "revenue",
      chart: box.getAttribute("data-chart") || "bar",
      showSql: false
    };
    if (!DIMS[state.dim]) state.dim = "month";
    if (!MEASURES[state.measure]) state.measure = "revenue";
    if (!CHARTS[state.chart]) state.chart = "bar";
    var caption = box.getAttribute("data-caption") || "";

    box.innerHTML =
      '<div class="sql-bar"><span class="sql-dot"></span>' +
      '<span class="sql-title">Daybreak mini-BI · pick, and it writes the SQL</span>' +
      '<span class="sql-spacer"></span>' +
      '<button type="button" class="sql-btn bi-sqlbtn">Show SQL</button></div>' +
      '<div class="bi-controls">' +
      '<label>Dimension ' + makeSelect(DIMS, state.dim, "bi-dim") + "</label>" +
      '<label>Measure ' + makeSelect(MEASURES, state.measure, "bi-mea") + "</label>" +
      '<label>Chart ' + makeSelect(CHARTS, state.chart, "bi-cht") + "</label>" +
      "</div>" +
      '<pre class="bi-sql" hidden></pre>' +
      '<div class="bi-out"><p class="sql-note">Loading the warehouse...</p></div>' +
      (caption ? '<p class="sql-cap">' + esc(caption) + "</p>" : "");

    var out = box.querySelector(".bi-out");
    var sqlPre = box.querySelector(".bi-sql");
    var dimSel = box.querySelector(".bi-dim");

    function run() {
      var sql = buildSql(state.dim, state.measure, state.chart);
      sqlPre.textContent = sql;
      dimSel.disabled = state.chart === "kpi";
      try {
        var db = new SQL.Database();
        db.run(window.DAYBREAK_SEED);
        var res = db.exec(sql);
        db.close();
        var rows = (res[0] ? res[0].values : []).map(function (r) {
          return state.chart === "kpi" ? [null, r[0]] : [r[0], r[1]];
        });
        if (state.chart === "kpi") out.innerHTML = renderKpi(rows, state.measure);
        else if (state.chart === "line") out.innerHTML = renderLine(rows, state.dim, state.measure);
        else out.innerHTML = renderBar(rows, state.dim, state.measure);
      } catch (e) {
        out.innerHTML = '<p class="sql-err">' + esc(e.message) + "</p>";
      }
    }

    dimSel.addEventListener("change", function () { state.dim = this.value; run(); });
    box.querySelector(".bi-mea").addEventListener("change", function () { state.measure = this.value; run(); });
    box.querySelector(".bi-cht").addEventListener("change", function () { state.chart = this.value; run(); });
    box.querySelector(".bi-sqlbtn").addEventListener("click", function () {
      state.showSql = !state.showSql;
      sqlPre.hidden = !state.showSql;
      this.textContent = state.showSql ? "Hide SQL" : "Show SQL";
    });
    run();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var boxes = document.querySelectorAll(".bibox");
    if (!boxes.length) return;
    loadEngine().then(function (SQL) {
      boxes.forEach(function (b) { initBox(b, SQL); });
    }).catch(function (e) {
      boxes.forEach(function (b) {
        b.innerHTML = '<p class="sql-err">The playground engine failed to load: ' + esc(e.message) + "</p>";
      });
    });
  });
})();

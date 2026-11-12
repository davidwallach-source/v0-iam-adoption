(() => {
  const params = new URLSearchParams(location.search);
  if (params.has("embed")) {
    document.documentElement.classList.add("pm-embedded");
    return;
  }
  if (!params.has("present")) {
    mountLauncher();
    return;
  }
  mountPresenter();

  function mountLauncher() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pm-launch";
    btn.innerHTML =
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.8v10.4L13 8z" fill="currentColor"/></svg><span>Presentation mode</span>';
    btn.addEventListener("click", () => {
      location.href = "/?present";
    });
    document.body.appendChild(btn);
  }

  function mountPresenter() {
    const BASE_W = 1600;
    const EASE = "cubic-bezier(.65,0,.25,1)";
    const CAM_MS = 900;
    const SCROLL_MS = 650;
    const CURSOR_MS = 620;
    const sleep = (ms) => new Promise((r) => setTimeout(r, FAST ? 0 : ms));
    let FAST = false;

    const root = el("div", "pm-root");
    const stage = el("div", "pm-stage");
    const camera = el("div", "pm-camera");
    const frame = document.createElement("iframe");
    frame.className = "pm-frame";
    frame.title = "Prototype";
    const overlay = el("div", "pm-overlay");
    const ring = el("div", "pm-ring");
    const cursor = el("div", "pm-cursor");
    cursor.innerHTML =
      '<div class="pm-cursor__icon"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M5 2.5v17.2l4.6-4.3 2.9 6.6 3-1.3-2.9-6.5h6.2z" fill="#130032" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg></div>';
    const veil = el("div", "pm-veil");
    const shield = el("div", "pm-shield");
    const cover = el("div", "pm-cover");
    cover.innerHTML = `
      <div class="pm-cover__copy">
        <p class="pm-cover__eyebrow">Concept walkthrough</p>
        <h1 class="pm-cover__title">Unified Agreements</h1>
      </div>
      <div class="pm-cover__art pm-cover__art--gradient" aria-hidden="true"></div>`;
    overlay.append(ring, cursor);
    camera.append(frame, overlay);
    const closing = el("div", "pm-cover pm-cover--closing");
    closing.innerHTML = `
      <div class="pm-cover__copy">
        <h2 class="pm-cover__title pm-cover__title--closing">One space for the whole agreement.</h2>
        <p class="pm-cover__sub">Unified Agreements concept</p>
      </div>
      <div class="pm-cover__art pm-cover__art--gradient" aria-hidden="true"></div>`;
    stage.append(camera, cover, closing, veil, shield);

    const viewport = el("div", "pm-viewport");
    viewport.append(stage);
    const dock = el("div", "pm-dock");
    root.append(viewport, dock);
    document.body.appendChild(root);

    let W = BASE_W;
    let H = 900;
    let aspect = localStorage.getItem("pm-aspect") || "16:9";
    let zoomMode = localStorage.getItem("pm-zoom") || "subtle";
    const ZOOM_CAP = { off: 1, subtle: 1.2, full: 2.1 };
    let interact = false;
    let cam = { s: 1, tx: 0, ty: 0 };
    let camTarget = null;
    let ringTarget = null;
    let cursorPos = null;
    let hovered = null;
    let current = -1;
    let busy = false;

    const doc = () => frame.contentDocument;
    const win = () => frame.contentWindow;

    // ---------- layout ----------
    function layout() {
      const iw = viewport.clientWidth;
      const ih = viewport.clientHeight;
      W = BASE_W;
      H = aspect === "fill" ? Math.round((BASE_W * ih) / iw) : aspect === "16:10" ? 1000 : 900;
      const k = Math.min(iw / W, ih / H);
      Object.assign(stage.style, {
        width: W + "px",
        height: H + "px",
        transform: `translate(${(iw - W * k) / 2}px, ${(ih - H * k) / 2}px) scale(${k})`,
      });
      camera.style.width = W + "px";
      camera.style.height = H + "px";
      frame.style.width = W + "px";
      frame.style.height = H + "px";
      requestAnimationFrame(() => {
        if (camTarget) applyCamera(fitCamera(resolveRect(camTarget)), true);
        if (ringTarget) placeRing(ringTarget, true);
        if (marksTarget) placeMarks(true);
      });
    }
    window.addEventListener("resize", layout);

    // ---------- helpers ----------
    function el(tag, cls) {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      return n;
    }
    function q(sel) {
      return doc()?.querySelector(sel) || null;
    }
    function qa(sel) {
      return [...(doc()?.querySelectorAll(sel) || [])];
    }
    function byText(sel, text) {
      return qa(sel).find((n) => n.textContent.trim() === text) || null;
    }
    function waitFor(fn, timeout = 8000) {
      return new Promise((resolve, reject) => {
        const t0 = performance.now();
        const tick = () => {
          let v = null;
          try {
            v = fn();
          } catch {}
          if (v) return resolve(v);
          if (performance.now() - t0 > timeout) return reject(new Error("pm: timed out waiting"));
          requestAnimationFrame(tick);
        };
        tick();
      });
    }
    function rectOf(n) {
      const r = n.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    function union(rects) {
      const x = Math.min(...rects.map((r) => r.x));
      const y = Math.min(...rects.map((r) => r.y));
      const x2 = Math.max(...rects.map((r) => r.x + r.w));
      const y2 = Math.max(...rects.map((r) => r.y + r.h));
      return { x, y, w: x2 - x, h: y2 - y };
    }
    function resolveRect(target) {
      const list = (typeof target === "function" ? target() : target) || [];
      const nodes = Array.isArray(list) ? list : [list];
      const rects = nodes.filter(Boolean).map((n) => ("x" in n && "w" in n ? n : rectOf(n)));
      return rects.length ? union(rects) : { x: 0, y: 0, w: W, h: H };
    }
    function section(title) {
      const heading = qa("h1,h2,h3,h4,[class*='title']").find((n) => n.textContent.trim().replace(/\*$/, "") === title);
      return heading?.closest(".as-sec") || heading?.parentElement?.parentElement || null;
    }
    function content(sec) {
      return () => (sec ? [...sec.children].filter((c) => c.getBoundingClientRect().height > 0) : []);
    }
    function itemText(text) {
      return () => {
        const li = qa("li").find((n) => n.textContent.includes(text));
        if (!li) return [];
        const range = doc().createRange();
        range.selectNodeContents(li);
        const r = range.getBoundingClientRect();
        return [{ x: r.left, y: r.top, w: r.width, h: r.height }];
      };
    }
    function rowOf(n) {
      return n?.closest("tr,[role='row']") || n;
    }
    const evalTriggers = () => qa(".v0-eval-trigger");
    const triggerFor = (name) => evalTriggers().find((t) => rowOf(t)?.textContent.includes(name));

    // ---------- camera ----------
    function fitCamera(r, { pad = 48, max = 2.1 } = {}) {
      let s = Math.min(W / (r.w + pad * 2), H / (r.h + pad * 2));
      s = Math.max(1, Math.min(max, ZOOM_CAP[zoomMode] ?? 1.2, s));
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      const tx = Math.min(0, Math.max(W - W * s, W / 2 - cx * s));
      const ty = Math.min(0, Math.max(H - H * s, H / 2 - cy * s));
      return { s, tx, ty };
    }
    function applyCamera(c, instant) {
      cam = c;
      const ms = instant || FAST ? 0 : CAM_MS;
      camera.style.transition = `transform ${ms}ms ${EASE}`;
      camera.style.transform = `translate(${c.tx}px, ${c.ty}px) scale(${c.s})`;
      cursor.style.setProperty("--pm-inv", String(1 / c.s));
      cursor.style.setProperty("--pm-cam-ms", ms + "ms");
      return sleep(ms);
    }
    function zoom(target, opts) {
      camTarget = target;
      return applyCamera(fitCamera(resolveRect(target), opts));
    }
    function resetCamera(instant) {
      camTarget = null;
      return applyCamera({ s: 1, tx: 0, ty: 0 }, instant);
    }

    // ---------- highlight ring ----------
    function placeRing(target, instant) {
      const r = resolveRect(target);
      const p = 8;
      ring.style.transition = instant || FAST ? "none" : "";
      Object.assign(ring.style, {
        left: r.x - p + "px",
        top: r.y - p + "px",
        width: r.w + p * 2 + "px",
        height: r.h + p * 2 + "px",
      });
    }
    function highlight(target) {
      ringTarget = target;
      placeRing(target);
      ring.classList.add("is-on");
    }
    function clearHighlight() {
      ringTarget = null;
      ring.classList.remove("is-on");
      clearMarks();
    }

    let marksTarget = null;
    let marks = [];
    function placeMarks(instant) {
      const rects = (marksTarget?.() || [])
        .filter(Boolean)
        .map((n) => ("x" in n && "w" in n ? n : rectOf(n)));
      while (marks.length < rects.length) {
        const m = el("div", "pm-mark");
        m.style.transitionDelay = FAST || instant ? "0ms" : `${marks.length * 90}ms`;
        overlay.insertBefore(m, cursor);
        marks.push(m);
      }
      rects.forEach((r, i) => {
        const px = 6;
        const py = 3;
        Object.assign(marks[i].style, {
          left: r.x - px + "px",
          top: r.y - py + "px",
          width: r.w + px * 2 + "px",
          height: r.h + py * 2 + "px",
        });
      });
    }
    function mark(rectsFn) {
      clearMarks();
      marksTarget = rectsFn;
      placeMarks();
      requestAnimationFrame(() => marks.forEach((m) => m.classList.add("is-on")));
    }
    function addMark(rectsFn) {
      const prev = marksTarget;
      const before = marks.length;
      marksTarget = () => [...(prev?.() || []), ...(rectsFn() || [])];
      placeMarks();
      marks.slice(before).forEach((m) => (m.style.transitionDelay = "0ms"));
      requestAnimationFrame(() => marks.forEach((m) => m.classList.add("is-on")));
    }
    function clearMarks() {
      marksTarget = null;
      marks.forEach((m) => m.remove());
      marks = [];
    }
    function textRects(rows, needle) {
      const re = new RegExp(needle, "i");
      return rows.map((row) => {
        const walker = doc().createTreeWalker(row, NodeFilter.SHOW_TEXT);
        for (let t = walker.nextNode(); t; t = walker.nextNode()) {
          const m = re.exec(t.nodeValue);
          if (!m) continue;
          const range = doc().createRange();
          range.setStart(t, m.index);
          range.setEnd(t, m.index + m[0].length);
          const r = range.getBoundingClientRect();
          return { x: r.left, y: r.top, w: r.width, h: r.height };
        }
        return null;
      });
    }

    function showCover(on) {
      cover.style.transition = FAST ? "none" : "";
      cover.classList.toggle("is-on", on);
      return sleep(on ? 0 : 700);
    }

    function showClosing(on) {
      closing.style.transition = FAST ? "none" : "";
      closing.classList.toggle("is-on", on);
      return sleep(on ? 700 : 0);
    }

    // ---------- scrolling ----------
    function scrollParent(n) {
      let p = n?.parentElement;
      while (p && p !== doc().body) {
        const cs = win().getComputedStyle(p);
        if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 1) return p;
        p = p.parentElement;
      }
      return doc().scrollingElement;
    }
    function animateScroll(sp, to) {
      const from = sp.scrollTop;
      to = Math.max(0, Math.min(to, sp.scrollHeight - sp.clientHeight));
      if (FAST || Math.abs(to - from) < 2) {
        sp.scrollTop = to;
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        const t0 = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - t0) / SCROLL_MS);
          const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          sp.scrollTop = from + (to - from) * e;
          if (k < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    }
    async function scrollToEl(n, { offset = 24, align = "start" } = {}) {
      if (!n) return;
      const sp = scrollParent(n);
      const spTop = sp === doc().scrollingElement ? 0 : sp.getBoundingClientRect().top;
      const r = n.getBoundingClientRect();
      const delta =
        align === "center" ? r.top - spTop - (sp.clientHeight - r.height) / 2 : r.top - spTop - offset;
      await animateScroll(sp, sp.scrollTop + delta);
    }
    async function scrollTop(n) {
      if (n) await animateScroll(n, 0);
    }

    // ---------- cursor ----------
    function showCursor(x, y) {
      if (!cursorPos) {
        cursorPos = { x: x ?? W * 0.82, y: y ?? H * 0.86 };
        cursor.style.transition = "none";
        cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
        cursor.getBoundingClientRect();
      }
      cursor.classList.add("is-on");
    }
    function hideCursor() {
      cursor.classList.remove("is-on");
    }
    function resetCursor() {
      cursorPos = null;
      hideCursor();
    }
    async function moveTo(n, { dx = 0.5, dy = 0.55 } = {}) {
      if (!n) return;
      showCursor();
      const r = rectOf(n);
      const x = r.x + r.w * dx;
      const y = r.y + r.h * dy;
      const dist = Math.hypot(x - cursorPos.x, y - cursorPos.y);
      if (dist < 6) return;
      const ms = FAST ? 0 : Math.round(Math.min(CURSOR_MS + 160, Math.max(380, dist * 0.9)));
      cursor.style.transition = `transform ${ms}ms ${EASE}`;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      cursorPos = { x, y };
      await sleep(ms + 60);
    }
    async function press() {
      if (FAST) return;
      cursor.classList.add("is-pressing");
      const ripple = el("span", "pm-ripple");
      ripple.style.left = cursorPos.x + "px";
      ripple.style.top = cursorPos.y + "px";
      overlay.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
      await sleep(150);
      cursor.classList.remove("is-pressing");
    }
    async function clickEl(n, opts) {
      if (!n) throw new Error("pm: click target missing");
      await moveTo(n, opts);
      await press();
      n.click();
      await sleep(120);
    }
    function fireHover(n) {
      const w = win();
      n.dispatchEvent(new w.MouseEvent("mouseover", { bubbles: true, relatedTarget: null, view: w }));
      n.classList.add("pm-hovered");
      rowOf(n)?.classList.add("pm-row-hovered");
      hovered = n;
    }
    function clearHover() {
      if (!hovered) return;
      const w = win();
      hovered.dispatchEvent(new w.MouseEvent("mouseout", { bubbles: true, relatedTarget: doc().body, view: w }));
      hovered.classList.remove("pm-hovered");
      rowOf(hovered)?.classList.remove("pm-row-hovered");
      hovered = null;
    }
    async function hoverEl(n, opts) {
      clearHover();
      await moveTo(n, { dx: 0.3, dy: 0.5, ...opts });
      fireHover(n);
      await waitFor(() => q(".v0-eval-pop"), 2000).catch(() => {});
      await sleep(80);
    }

    // ---------- steps (Unified Agreements talk track; titles and cues come from src/present/steps.json) ----------
    const pm = (name) => q(`[data-pm="${name}"]`);
    const pmAll = (name) => qa(`[data-pm="${name}"]`);
    const waitPm = (name, timeout) => waitFor(() => pm(name), timeout);
    const inside = (root, sel, text) =>
      root ? [...root.querySelectorAll(sel)].find((n) => n.textContent.trim().startsWith(text)) || null : null;
    const visibleInFrame = (nodes) =>
      nodes.filter((n) => {
        const b = n.getBoundingClientRect();
        return b.height > 0 && b.top >= 0 && b.bottom <= H;
      });
    const rowWith = (pmName, text) => pmAll(pmName).find((n) => rowOf(n)?.textContent.includes(text)) || null;
    const editorCanvas = () => q('[contenteditable="true"], [contenteditable="false"][data-canvas], .doc-canvas');
    const textNodeWith = (needle) => {
      const w = doc().createTreeWalker(doc().body, NodeFilter.SHOW_TEXT);
      let t;
      while ((t = w.nextNode())) if (t.nodeValue.includes(needle)) return t;
      const els = [...doc().body.querySelectorAll("*")].filter((n) => n.textContent.includes(needle));
      const leaf = els.find((n) => ![...n.children].some((c) => c.textContent.includes(needle)));
      return leaf ? leaf.firstChild || leaf : null;
    };

    async function typeInto(input, text) {
      const proto = input.tagName === "TEXTAREA" ? win().HTMLTextAreaElement.prototype : win().HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      input.focus();
      const chunks = FAST ? [text] : [...text].map((_, i) => text.slice(0, i + 1));
      for (const v of chunks) {
        setter.call(input, v);
        input.dispatchEvent(new (win().Event)("input", { bubbles: true }));
        if (!FAST) await sleep(45);
      }
    }

    async function veilCut(fn) {
      veil.classList.add("is-on");
      await sleep(300);
      await fn();
      veil.classList.remove("is-on");
    }

    const RUNS = [
      // 1 · Cover: Unified Agreements
      async () => {
        clearHighlight();
        clearMarks();
        resetCursor();
        await resetCamera();
        await showCover(true);
      },
      // 2 · Fade to All Agreements · mark every deal (only rows visible in the frame, no scrolling)
      async () => {
        await showCover(false);
        mark(() => visibleInFrame(pmAll("deal-name")));
      },
      // 3 · Mark what's in each deal
      async () => {
        clearMarks();
        mark(() => visibleInFrame(pmAll("deal-counts")));
      },
      // 4 · Mark who it's waiting on
      async () => {
        clearMarks();
        mark(() => [rowWith("deal-status", "DataVault")]);
      },
      // 5 · Highlight Start
      async () => {
        clearMarks();
        const start = pm("start-button");
        highlight(start);
        await moveTo(start);
      },
      // 6 · Open Start menu
      async () => {
        await clickEl(pm("start-button"));
        const menu = await waitPm("start-menu");
        highlight(menu);
      },
      // 7 · Send an Envelope → Signature Request
      async () => {
        const item = q('[data-pm^="start-"][data-pm*="envelope"]') || byText("button,[role=menuitem]", "Send an Envelope");
        clearHighlight();
        await clickEl(item);
        await waitPm("sr-page");
        hideCursor();
        await resetCamera(true);
      },
      // 8 · Upload the NDA (the app's Upload button adds the tile directly, no file dialog)
      async () => {
        const docs = pm("sr-docs");
        await scrollToEl(docs, { offset: 24 });
        await clickEl(inside(docs, "button", "Upload"));
        await waitFor(() => inside(pm("sr-docs"), "*", "Non-Disclosure Agreement"));
        highlight(pm("sr-docs"));
      },
      // 9 · Type Sam in as the recipient
      async () => {
        clearHighlight();
        const rec = pm("sr-recipients");
        await scrollToEl(rec, { offset: 24 });
        highlight(rec);
        const inputs = [...rec.querySelectorAll("input")].filter((n) => n.type !== "checkbox" && n.type !== "hidden");
        const name = inputs.find((n) => /name/i.test(n.name + n.placeholder + n.getAttribute("aria-label") + (n.id || ""))) || inputs[0];
        const email = inputs.find((n) => n.type === "email" || /email/i.test(n.name + n.placeholder + n.getAttribute("aria-label") + (n.id || ""))) || inputs[1];
        await moveTo(name);
        await typeInto(name, "Sam Sanders");
        await moveTo(email);
        await typeInto(email, "sam.sanders@globex.com");
      },
      // 10 · Next → deal page, sent toast
      async () => {
        clearHighlight();
        await clickEl(pm("sr-next"));
        await waitPm("deal-page");
        hideCursor();
        await resetCamera(true);
      },
      // 11 · Back to the list · new top row
      async () => {
        await clickEl(pm("deal-back"));
        const name = await waitFor(() => rowWith("deal-name", "New Vendor Deal"));
        hideCursor();
        await resetCamera(true);
        highlight(rowOf(name));
      },
      // 12 · Mark the row's status
      async () => {
        mark(() => [rowWith("deal-status", "New Vendor Deal")]);
      },
      // 13 · Open the deal · NDA side panel
      async () => {
        clearMarks();
        clearHighlight();
        await clickEl(rowWith("deal-name", "New Vendor Deal"));
        await waitPm("deal-page");
        await clickEl(await waitPm("doc-card-nda"));
        const panel = await waitPm("nda-panel");
        highlight(panel);
      },
      // 14 · What's happened so far
      async () => {
        highlight(pm("nda-sent-by"));
      },
      // 15 · Remind Signers
      async () => {
        const remind = pm("nda-remind");
        highlight(remind);
        await moveTo(remind);
      },
      // 16 · Close panel · header chips
      async () => {
        clearHighlight();
        const panel = pm("nda-panel");
        await clickEl(panel.querySelector('[aria-label^="Close"]'));
        await waitFor(() => !pm("nda-panel"));
        highlight(pm("deal-chips"));
      },
      // 17 · Key dates
      async () => {
        mark(() => [pm("chip-expires")]);
      },
      // 18 · Party drawer · negotiation history
      async () => {
        clearMarks();
        clearHighlight();
        await clickEl(pm("chip-party"));
        await waitPm("party-drawer");
        highlight(await waitPm("party-negotiation"));
      },
      // 19 · Close drawer
      async () => {
        clearHighlight();
        let root = pm("party-drawer");
        let close = null;
        while (root && !close) {
          close = root.querySelector('[aria-label*="lose" i]');
          root = root.parentElement;
        }
        await clickEl(close);
        await waitFor(() => !pm("party-drawer"));
        hideCursor();
        await resetCamera();
      },
      // 20 · Add Documents → file picker → editor
      async () => {
        await clickEl(pm("doc-add"));
        const file = await waitFor(() => pm("file-picker-msa") || byText("[role=option],[role=row],li,button,div", "New Vendor MSA"));
        await clickEl(file);
        const open = await waitFor(() => pm("file-open") || byText("button", "Open"));
        await clickEl(open);
        await waitFor(() => textNodeWith("Effective Date: January 15, 2026"), 10000);
        hideCursor();
        await resetCamera(true);
      },
      // 21 · Zoom to the document
      async () => {
        const page = pm("msa-page") || textNodeWith("Effective Date: January 15, 2026").parentElement.closest("[contenteditable], .doc-page, article") || editorCanvas();
        await zoom(page, { pad: 32, max: 1.3 });
      },
      // 22 · Select text · context menu
      async () => {
        const t = textNodeWith("Effective Date: January 15, 2026");
        const host = t.parentElement;
        const range = doc().createRange();
        range.selectNodeContents(host);
        const sel = win().getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const r = range.getBoundingClientRect();
        await moveTo(host, { dx: 0.9, dy: 0.5 });
        const opts = { bubbles: true, cancelable: true, clientX: r.right - 4, clientY: r.top + r.height / 2, button: 2 };
        host.dispatchEvent(new (win().MouseEvent)("mouseup", opts));
        host.dispatchEvent(new (win().MouseEvent)("contextmenu", opts));
        const item = await waitFor(() => byText("button,[role=menuitem]", "Add approval"));
        highlight(pm("msa-context-menu") || item.closest('[role="menu"]') || item.parentElement);
      },
      // 23 · Add approval panel
      async () => {
        clearHighlight();
        await clickEl(byText("button,[role=menuitem]", "Add approval"));
        await resetCamera();
        const close = await waitFor(() => q('[aria-label="Close approval panel"]'));
        const panel = pm("approval-panel") || close.closest("aside") || close.parentElement.parentElement.parentElement;
        highlight(panel);
      },
      // 24 · Pick Leona → Create Approval
      async () => {
        const close = q('[aria-label="Close approval panel"]');
        const panel = pm("approval-panel") || close.closest("aside") || close.parentElement.parentElement.parentElement;
        const search = pm("approval-search") || [...panel.querySelectorAll("input")].find((n) => n.type !== "checkbox") ;
        await moveTo(search);
        search.click();
        await typeInto(search, "le");
        const desc = pm("approval-description");
        if (desc && !desc.value.trim()) {
          await moveTo(desc);
          await typeInto(desc, "Legal review of effective date");
          await moveTo(search);
        }
        const leona = await waitPm("approver-option-leona");
        await clickEl(leona);
        const create = await waitFor(() => {
          const b = pm("approval-create");
          return b && !b.disabled ? b : null;
        });
        await clickEl(create);
      },
      // 25 · Back to the deal · documents side by side
      async () => {
        clearHighlight();
        const back = pm("editor-back") || qa('[aria-label="Back"]').filter((n) => n.getAttribute("data-pm") !== "deal-back").pop();
        await clickEl(back);
        await waitFor(() => pm("doc-card-msa"));
        hideCursor();
        await resetCamera(true);
        highlight(pm("docs-panel"));
      },
      // 26 · Approval task
      async () => {
        const row = await waitFor(() => pm("task-approve-msa"));
        highlight(row);
      },
      // 27 · New milestones
      async () => {
        highlight(pm("deal-stages"));
      },
      // 28 · Tasks + menu
      async () => {
        clearHighlight();
        await scrollToEl(pm("tasks-panel"), { offset: 24 });
        await clickEl(pm("tasks-add").querySelector("button") || pm("tasks-add"));
        const item = await waitFor(() => byText("button,[role=menuitem]", "Upload request"));
        highlight(pm("tasks-add-menu") || item.closest('[role="menu"]') || item.parentElement);
      },
      // 29 · Upload request → Send
      async () => {
        clearHighlight();
        await clickEl(byText("button,[role=menuitem]", "Upload request"));
        const send = await waitPm("upload-send");
        const form = pm("upload-form") || q('[aria-label="Close upload request"]')?.closest('[role="dialog"], aside') || send.parentElement.parentElement;
        highlight(form);
        await sleep(900);
        clearHighlight();
        await clickEl(send);
      },
      // 30 · COI task lands in the list
      async () => {
        const row = await waitFor(() => pm("task-coi"));
        hideCursor();
        highlight(row);
      },
      // 31 · New Vendor Onboarding → Create task
      async () => {
        clearHighlight();
        await clickEl(pm("tasks-add").querySelector("button") || pm("tasks-add"));
        await clickEl(await waitFor(() => byText("button,[role=menuitem]", "New Vendor Onboarding")));
        const close = await waitFor(() => q('[aria-label="Close vendor onboarding"]'));
        const form = pm("onboarding-form") || close.closest('[role="dialog"], aside') || close.parentElement.parentElement;
        highlight(form);
        await sleep(900);
        clearHighlight();
        await clickEl(pm("onboarding-create") || inside(form, "button", "Create task"));
      },
      // 32 · Onboarding task
      async () => {
        const row = await waitFor(() => pm("task-onboarding"));
        hideCursor();
        highlight(row);
      },
      // 33 · Remind
      async () => {
        const row = pm("task-onboarding");
        await hoverEl(row);
        const remind = await waitFor(() => pm("task-onboarding-remind") || inside(row, "button", "Remind"));
        highlight(remind);
      },
      // 34 · Everyone on the deal
      async () => {
        clearHover();
        clearHighlight();
        await scrollTop(pm("tasks-panel"));
        highlight(() => [pm("deal-participants"), pm("messages-panel")]);
      },
      // 35 · Open the MSA
      async () => {
        clearHighlight();
        await clickEl(pm("doc-card-msa"));
        await waitFor(() => textNodeWith("Effective Date: January 15, 2026"), 10000);
        hideCursor();
        await resetCamera(true);
      },
      // 36 · Send for Client Review
      async () => {
        const caret = pm("editor-send-caret") || byText("button", "Send for Signature")?.nextElementSibling;
        await clickEl(caret);
        await clickEl(await waitFor(() => byText("button,[role=menuitem]", "Send for Client Review")));
        const modal = await waitPm("client-review-modal");
        highlight(modal.firstElementChild || modal);
        await sleep(900);
        clearHighlight();
        const send = [...modal.querySelectorAll("button")].filter((b) => /^Send/.test(b.textContent.trim())).pop();
        await clickEl(send);
        await waitFor(() => !pm("client-review-modal"));
      },
      // 37 · Cut to the vendor portal
      async () => {
        await veilCut(async () => {
          clearHighlight();
          hideCursor();
          const back = pm("editor-back") || qa('[aria-label="Back"]').filter((n) => n.getAttribute("data-pm") !== "deal-back").pop();
          if (back && !pm("deal-view-as-sam")) back.click();
          (await waitPm("deal-view-as-sam")).click();
          await waitPm("portal");
          await resetCamera(true);
        });
      },
      // 38 · Everything waiting on them
      async () => {
        const list = pm("portal-tasks");
        await scrollToEl(list, { offset: 24 });
        highlight(list);
      },
      // 39 · Review · Sign · Start · Upload
      async () => {
        clearHighlight();
        const order = ["review", "sign", "start", "upload"].map((k) => pm(`portal-btn-${k}`));
        for (let i = 1; i <= order.length; i++) {
          mark(() => order.slice(0, i));
          await sleep(350);
        }
      },
      // 40 · Vendor opens the MSA · Suggesting
      async () => {
        clearMarks();
        await clickEl(pm("portal-btn-review"));
        await waitFor(() => pm("msa-editor-suggesting") || textNodeWith("Effective Date: January 15, 2026"), 10000);
        hideCursor();
        await resetCamera(true);
      },
      // 41 · Suggested edit (authored by Sam Sanders)
      async () => {
        win().dispatchEvent(new (win().CustomEvent)("pm:suggest-edit", { detail: { from: "January 15, 2026", to: "February 1, 2026" } }));
        const card = await waitPm("suggestion-card");
        highlight(() => [q(".suggest-del")?.closest("div, p") || q(".suggest-del"), card]);
      },
      // 42 · Back on the deal · Edits suggested
      async () => {
        await veilCut(async () => {
          clearHighlight();
          hideCursor();
          const back = qa('[aria-label="Back"]').filter((n) => n.getAttribute("data-pm") !== "deal-back").pop();
          if (back && !pm("portal-tasks")) back.click();
          (await waitPm("portal-exit")).click();
          await waitPm("deal-page");
          await resetCamera(true);
        });
        const badge = await waitFor(() => pm("doc-card-msa-badge") || inside(pm("doc-card-msa"), "*", "Edits suggested"));
        highlight(badge);
      },
      // 43 · Where we started
      async () => {
        clearHighlight();
        highlight(pm("doc-card-nda"));
      },
      // 44 · The whole agreement
      async () => {
        highlight(() => [pm("docs-panel"), pm("tasks-panel"), pm("messages-panel")]);
      },
      // 45 · Tasks, workflows, vendor view
      async () => {
        highlight(pm("tasks-panel"));
      },
      // 46 · Messaging
      async () => {
        highlight(pm("messages-panel"));
      },
      // 47 · Closing
      async () => {
        clearHighlight();
        clearMarks();
        clearHover();
        hideCursor();
        await resetCamera();
        await showClosing(true);
      },
    ];

    const S = ["01 · One home for every deal","02 · Keep eSignature simple","03 · Send an NDA, just like today","04 · Status right on the row","05 · See who you’re waiting on","06 · What’s inside the contract","07 · Add the MSA","08 · Route it to legal","09 · The deal keeps up with you","10 · Ask the vendor for their insurance","11 · Kick off onboarding","12 · One space for everyone on the deal","13 · What the vendor sees","14 · Edits come back to you","15 · Where this goes"];
    const META = [
      {
        "scene": 1,
        "title": "Cover: Unified Agreements",
        "cue": "This is our unified agreements concept."
      },
      {
        "scene": 1,
        "title": "Fade to All Agreements · mark every deal",
        "cue": "Every deal in one place,"
      },
      {
        "scene": 1,
        "title": "Mark what’s in each deal",
        "cue": "with what’s in it"
      },
      {
        "scene": 1,
        "title": "Mark who it’s waiting on",
        "cue": "and who it’s waiting on."
      },
      {
        "scene": 2,
        "title": "Highlight Start",
        "cue": "eSignature already works great for most users."
      },
      {
        "scene": 2,
        "title": "Open Start menu",
        "cue": "So we keep it that simple, and make it the front door to the rest of our platform."
      },
      {
        "scene": 3,
        "title": "Send an Envelope → Signature Request",
        "cue": "It starts just like today."
      },
      {
        "scene": 3,
        "title": "Upload the NDA",
        "cue": "Grab the NDA,"
      },
      {
        "scene": 3,
        "title": "Type Sam in as the recipient",
        "cue": "add Sam from the vendor,"
      },
      {
        "scene": 3,
        "title": "Next → deal page, sent toast",
        "cue": "and send."
      },
      {
        "scene": 4,
        "title": "Back to the list · new top row",
        "cue": "The new deal shows up in your list,"
      },
      {
        "scene": 4,
        "title": "Mark the row’s status",
        "cue": "status right on the row."
      },
      {
        "scene": 5,
        "title": "Open the deal · NDA side panel",
        "cue": "Click in to see who you’re waiting on,"
      },
      {
        "scene": 5,
        "title": "What’s happened so far",
        "cue": "what’s happened,"
      },
      {
        "scene": 5,
        "title": "Remind Signers",
        "cue": "and send a reminder."
      },
      {
        "scene": 6,
        "title": "Close panel · header chips",
        "cue": "We also pull out what’s inside your contracts,"
      },
      {
        "scene": 6,
        "title": "Key dates",
        "cue": "like key dates"
      },
      {
        "scene": 6,
        "title": "Party drawer · negotiation history",
        "cue": "and your history with this party."
      },
      {
        "scene": 7,
        "title": "Close drawer",
        "cue": "Now imagine a few weeks go by."
      },
      {
        "scene": 7,
        "title": "Add Documents → file picker → editor",
        "cue": "You upload the MSA right into the same deal."
      },
      {
        "scene": 8,
        "title": "Zoom to the document",
        "cue": "Need legal’s sign-off?"
      },
      {
        "scene": 8,
        "title": "Select text · context menu",
        "cue": "Select the text,"
      },
      {
        "scene": 8,
        "title": "Add approval panel",
        "cue": "add an approval,"
      },
      {
        "scene": 8,
        "title": "Pick Leona → Create Approval",
        "cue": "pick Leona."
      },
      {
        "scene": 9,
        "title": "Back to the deal · documents side by side",
        "cue": "The draft sits next to the NDA,"
      },
      {
        "scene": 9,
        "title": "Approval task",
        "cue": "the approval’s a task,"
      },
      {
        "scene": 9,
        "title": "New milestones",
        "cue": "and the milestones move to match where the deal is."
      },
      {
        "scene": 10,
        "title": "Tasks + menu",
        "cue": "Need the vendor’s insurance certificate?"
      },
      {
        "scene": 10,
        "title": "Upload request → Send",
        "cue": "Send an upload request."
      },
      {
        "scene": 10,
        "title": "COI task lands in the list",
        "cue": "It lands in the same task list."
      },
      {
        "scene": 11,
        "title": "New Vendor Onboarding → Create task",
        "cue": "Ready to onboard them? Start the onboarding workflow right here."
      },
      {
        "scene": 11,
        "title": "Onboarding task",
        "cue": "It’s tracked like everything else,"
      },
      {
        "scene": 11,
        "title": "Remind",
        "cue": "and you can nudge anyone who’s behind."
      },
      {
        "scene": 12,
        "title": "Everyone on the deal",
        "cue": "Here’s a real strength: everyone on the deal works in one space."
      },
      {
        "scene": 12,
        "title": "Open the MSA",
        "cue": "MSA ready?"
      },
      {
        "scene": 12,
        "title": "Send for Client Review",
        "cue": "Send it to the vendor for review, right from here."
      },
      {
        "scene": 13,
        "title": "Cut to the vendor portal",
        "cue": "Here’s the vendor’s side:"
      },
      {
        "scene": 13,
        "title": "Everything waiting on them",
        "cue": "one page with everything waiting on them."
      },
      {
        "scene": 13,
        "title": "Review · Sign · Start · Upload",
        "cue": "Review, sign, onboard, upload."
      },
      {
        "scene": 14,
        "title": "Vendor opens the MSA · Suggesting",
        "cue": "In the real world, things change."
      },
      {
        "scene": 14,
        "title": "Suggested edit",
        "cue": "Suggested edits come right back to you,"
      },
      {
        "scene": 14,
        "title": "Back on the deal · Edits suggested",
        "cue": "flagged on the deal."
      },
      {
        "scene": 15,
        "title": "Where we started",
        "cue": "We started with simple signature collection."
      },
      {
        "scene": 15,
        "title": "The whole agreement",
        "cue": "Now it’s one shared space for the whole agreement:"
      },
      {
        "scene": 15,
        "title": "Tasks, workflows, vendor view",
        "cue": "tasks, workflows, a vendor view,"
      },
      {
        "scene": 15,
        "title": "Messaging",
        "cue": "and down the road, messaging inside and out."
      },
      {
        "scene": 15,
        "title": "Closing",
        "cue": "That’s how we believe we drive IAM adoption."
      }
    ];
    if (META.length !== RUNS.length) console.error(`pm: ${META.length} cues but ${RUNS.length} runs`);
    const steps = META.map((m, i) => ({ screen: m.scene - 1, title: m.title, cue: m.cue, run: RUNS[i] }));


    // ---------- runner ----------
    function loadFrame() {
      return new Promise((resolve) => {
        frame.addEventListener(
          "load",
          async () => {
            bindFrameKeys();
            await waitFor(() => q('[data-pm="deal-name"]'), 15000).catch(() => {});
            resolve();
          },
          { once: true },
        );
        frame.src = `/?embed=1&t=${Date.now()}#agreements`;
      });
    }

    async function goTo(index, { animate } = {}) {
      index = Math.max(0, Math.min(steps.length - 1, index));
      if (busy) return;
      busy = true;
      try {
        if (animate && index === current + 1) {
          await steps[index].run();
        } else {
          veil.classList.add("is-on");
          await sleep(180);
          FAST = true;
          clearHover();
          clearHighlight();
          resetCursor();
          await applyCamera({ s: 1, tx: 0, ty: 0 }, true);
          await loadFrame();
          for (let i = 0; i <= index; i++) {
            await steps[i].run();
            await new Promise((r) => requestAnimationFrame(r));
          }
          FAST = false;
          if (camTarget) applyCamera(fitCamera(resolveRect(camTarget)), true);
          if (ringTarget) placeRing(ringTarget, true);
          veil.classList.remove("is-on");
        }
        current = index;
      } catch (err) {
        console.error(err);
        FAST = false;
        current = index;
        veil.classList.remove("is-on");
      } finally {
        busy = false;
        renderHud();
      }
    }
    const next = () => (current < steps.length - 1 ? goTo(current + 1, { animate: true }) : null);
    const prev = () => (current > 0 ? goTo(current - 1) : null);

    // ---------- HUD ----------
    const icon = (d) => `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const I = {
      restart: "M4 10a6 6 0 1 0 1.8-4.3M4 3.5v3h3",
      prev: "M12.5 4.5 7 10l5.5 5.5",
      next: "M7.5 4.5 13 10l-5.5 5.5",
      notes: "M5 4h10v12H5zM8 8h4M8 11h4",
      hand: "M7 10V5a1.2 1.2 0 0 1 2.4 0v4M9.4 9V4a1.2 1.2 0 0 1 2.4 0v5M11.8 9V5a1.2 1.2 0 0 1 2.4 0v6c0 3-2 5-5 5s-4-1.5-5.5-4l-1-2a1.2 1.2 0 0 1 2-1.2L7 10",
      full: "M3.5 7.5v-4h4M16.5 7.5v-4h-4M3.5 12.5v4h4M16.5 12.5v4h-4",
      exit: "M5 5l10 10M15 5 5 15",
    };
    function btn(name, label, onClick, extra = "") {
      return `<button type="button" class="pm-btn ${extra}" data-act="${name}" aria-label="${label}" title="${label}">${icon(I[name])}</button>`;
    }
    const seg = (label, key, opts) =>
      `<div class="pm-seg" role="group" aria-label="${label}"><span class="pm-seg__label" aria-hidden="true">${label}</span>${opts
        .map(([v, t]) => `<button type="button" class="pm-seg__b" data-${key}="${v}">${t}</button>`)
        .join("")}</div>`;
    dock.innerHTML = `
      <div class="pm-bar" role="toolbar" aria-label="Presentation controls">
        <div class="pm-bar__group">
          ${btn("restart", "Restart (R)", null)}
          ${btn("prev", "Previous (←)", null)}
          ${btn("next", "Next (→ / Space)", null, "pm-btn--primary")}
          <label class="sr-only" for="pm-jump">Jump to step</label>
          <select id="pm-jump" class="pm-jump">${S.map(
            (s, si) =>
              `<optgroup label="${s}">${steps
                .map((st, i) => (st.screen === si ? `<option value="${i}">${i + 1}. ${st.title}</option>` : ""))
                .join("")}</optgroup>`,
          ).join("")}</select>
          <span class="pm-count"></span>
        </div>
        <div class="pm-bar__group">
          ${seg("Frame", "aspect", [["16:9", "16:9"], ["16:10", "16:10"], ["fill", "Fill"]])}
          ${seg("Zoom", "zoom", [["off", "Off"], ["subtle", "Subtle"], ["full", "Full"]])}
          <span class="pm-sep" aria-hidden="true"></span>
          ${btn("hand", "Interact manually (I)", null)}
          ${btn("full", "Fullscreen (F)", null)}
          ${btn("exit", "Exit presentation", null)}
        </div>
      </div>
      <div class="pm-script">
        <div class="pm-script__main">
          <p class="pm-script__meta"></p>
          <p class="pm-script__text" aria-live="polite"></p>
        </div>
        <div class="pm-script__side">
          <p class="pm-script__label">Up next</p>
          <p class="pm-script__next"></p>
          <p class="pm-script__keys">→ / Space next · ← back · 1–7 jump to screen</p>
        </div>
      </div>
    `;
    const jump = dock.querySelector(".pm-jump");
    const count = dock.querySelector(".pm-count");
    const meta = dock.querySelector(".pm-script__meta");
    const text = dock.querySelector(".pm-script__text");
    const upNext = dock.querySelector(".pm-script__next");
    jump.addEventListener("change", () => {
      goTo(Number(jump.value));
      jump.blur();
    });
    dock.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      b.blur();
      if (b.dataset.aspect) return setAspect(b.dataset.aspect);
      if (b.dataset.zoom) return setZoom(b.dataset.zoom);
      const act = b.dataset.act;
      if (act === "restart") goTo(0);
      if (act === "prev") prev();
      if (act === "next") next();
      if (act === "hand") toggleInteract();
      if (act === "full") toggleFullscreen();
      if (act === "exit") location.href = "/";
    });
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    function renderHud() {
      const i = Math.max(0, current);
      const st = steps[i];
      jump.value = String(i);
      count.textContent = `${i + 1} / ${steps.length}`;
      meta.innerHTML = `<span class="pm-script__screen">${esc(S[st.screen])}</span><span class="pm-script__action">On screen: ${esc(st.title)}</span>`;
      text.innerHTML = steps
        .map((s, j) => ({ s, j }))
        .filter(({ s }) => s.screen === st.screen)
        .map(({ s, j }) => {
          const state = j < i ? "is-past" : j === i ? "is-now" : "is-later";
          const words = s.cue || (j === i ? "No voiceover. Let this beat land." : "");
          return words ? `<span class="pm-line ${state}${s.cue ? "" : " is-silent"}">${esc(words)}</span>` : "";
        })
        .join(" ");
      text.querySelector(".is-now")?.scrollIntoView({ block: "nearest" });
      const nx = steps[i + 1];
      upNext.textContent = nx ? `${nx.title}${nx.screen !== st.screen ? ` (${S[nx.screen]})` : ""}` : "End of vignette";
      dock.querySelectorAll("[data-aspect]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.aspect === aspect)));
      dock.querySelectorAll("[data-zoom]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.zoom === zoomMode)));
      dock.querySelector('[data-act="hand"]').setAttribute("aria-pressed", String(interact));
      dock.querySelector('[data-act="prev"]').disabled = current <= 0;
      dock.querySelector('[data-act="next"]').disabled = current >= steps.length - 1;
    }
    function setAspect(a) {
      aspect = a;
      localStorage.setItem("pm-aspect", a);
      layout();
      renderHud();
    }
    function setZoom(z) {
      zoomMode = z;
      localStorage.setItem("pm-zoom", z);
      if (camTarget) applyCamera(fitCamera(resolveRect(camTarget)));
      renderHud();
    }
    function toggleInteract() {
      interact = !interact;
      root.classList.toggle("is-interactive", interact);
      renderHud();
    }
    function toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    }

    function onKey(e) {
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && interact) return;
      const k = e.key;
      let handled = true;
      if (k === "ArrowRight" || k === " " || k === "PageDown" || k === "Enter") next();
      else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") prev();
      else if (k === "Home" || k === "r" || k === "R") goTo(0);
      else if (k === "End") goTo(steps.length - 1);
      else if (k === "f" || k === "F") toggleFullscreen();
      else if (k === "i" || k === "I") toggleInteract();
      else if (/^[1-7]$/.test(k)) {
        const first = steps.findIndex((s) => s.screen === Number(k) - 1);
        if (first >= 0) goTo(first);
      } else handled = false;
      if (handled) e.preventDefault();
    }
    window.addEventListener("keydown", onKey, true);
    function bindFrameKeys() {
      try {
        win().addEventListener("keydown", onKey, true);
      } catch {}
    }

    layout();
    renderHud();
    goTo(0);
  }
})();

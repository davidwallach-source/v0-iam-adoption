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

    const S = __PM_SCENES__;
    const META = __PM_STEPS__;
    if (META.length !== RUNS.length) console.error(`pm: ${META.length} cues but ${RUNS.length} runs`);
    const steps = META.map((m, i) => ({ screen: m.scene - 1, title: m.title, cue: m.cue, run: RUNS[i] }));


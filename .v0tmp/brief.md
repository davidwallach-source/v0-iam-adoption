# Unified Agreements concept: clickable prototype + presentation mode

Build a clickable, front-end-only prototype of Docusign’s **Unified Agreements** concept, plus a **presentation mode** that drives it step by step while showing me the script. I’ll record my voice live over it. Pressing Space advances the screen to the next beat, so I never navigate the UI by hand.

There is no video to play. Everything on screen is real, rendered UI recreated from the attached reference screenshots.

## Attachments and how to use them

- **`present.js` and `present.css`** are the presentation engine from an earlier prototype of ours. Its presentation mode is exactly how this one must work. Port the engine as-is: the fixed 1600×900 stage, embedding the app in an iframe, the camera zoom, highlight ring, text marks, animated cursor with click ripple, synthetic hover, smooth scrolling, white veil for cuts, cover and closing cards, the script dock, the jump menu, Frame and Zoom toggles, Interact manually mode, fullscreen, keyboard handling, and “Back = reload and fast-replay steps 0…n−1” so state is always deterministic. Replace only the `steps` array, the screen list, the cover and the closing card with the ones below. Keep the visual design of the dock, ring, marks and cursor identical.
- **Reference screenshots `01-…` to `15-…`** (filenames start with the scene number). Recreate each screen to match them as closely as you can: layout, spacing, colors, copy, badges, avatars, icons. Where this prompt states copy, use it exactly.
- **DSIndigo font files and `docusign-logo.svg`.** Use DSIndigo for the whole prototype via @font-face (fallback: system-ui). The presenter shell keeps the system font, as in `present.css`.

## Architecture

- Next.js (App Router), TypeScript, React, plain CSS or CSS modules. No backend, no network calls, no persistence. Every page load starts from the initial state, which the fast-replay depends on.
- Routes:
  - `/` is the prototype, with a small “Presentation mode” launcher button (same as the reference).
  - `/?present` is the presenter shell.
  - `/?embed=1` is the prototype inside the presenter’s iframe: no launcher, and the `pm-embedded` class on `<html>`.
- Client-side routing inside the prototype: All Agreements, Signature Request, Deal page, MSA editor, Vendor portal. The deal page has the drawers, panels and modals listed below.
- One in-memory store holds the deal’s state: documents, tasks, messages, stage, toasts. The UI reads from it, so clicking through by hand and driving it from the presenter produce identical screens.
- The presenter renders the app at 1600×900 (or 1600×1000 / Fill). Lay every screen out for a 1600 px-wide viewport, matching the screenshots’ proportions.
- Put stable `data-pm="…"` attributes on every element the steps target. The names are in brackets in the steps. The engine must select by `data-pm`, never by visible text.
- Expose `window.dispatchEvent(new CustomEvent("pm:…"))` hooks only where a step needs something a click can’t do, such as showing the text selection and context menu.

## Presentation mode specifics

- The script dock sits **below** the 16:9 stage, outside it, as in the reference. That lets me screen-record just the stage region while reading the dock.
- Add one thing the reference doesn’t have: **P** pops the script dock out into a separate window, kept in sync over BroadcastChannel. That way I can record the stage full-screen with the script on a second monitor. Space, →, ← and R work from either window.
- The dock shows every cue of the current scene inline, with past, current and upcoming styling as in the reference. It also shows “On screen: {step title}”, “Up next”, and the step counter.
- Script text must be **verbatim** from the `cue` fields. Don’t rewrite, merge or split cues. The cues of each scene, joined with spaces, are the approved script.
- Number keys 1–9 jump to scenes 1–9. The jump menu covers all 15, grouped by scene.
- Cover card: eyebrow “Concept walkthrough”, title “Unified Agreements”. No image; use a subtle violet gradient on the right half instead.
- Closing card: title “One space for the whole agreement.”, sub “Unified Agreements concept”.

## Fixed demo data

- Internal user: Paula Procurement (paula.procurement@email.com). The UI says “You” for her actions.
- Vendor contact: Sam Sanders, sam.sanders@globex.com. Vendor company: **Globex Industries**. Our company: **Acme Corporation**.
- Keep the vendor company name in one constant, `VENDOR` (default “Globex Industries”). Wherever `{VENDOR}` appears below, use that constant. It appears in the COI description and the onboarding task.
- Approvers: Leona Legal (leona.legal@email.com), Liam Legal, Francis Finance, Frank Finance, Freya Finance.
- Deal participants (avatars): SS, JL, NK.

## Screens (match the screenshots; exact copy where given)

**Top bar, all internal pages.** Docusign logo; “Start ▾” [pm=start-button]; centered search “Search agreements, templates, people ⌘K”; bell icon; “Ask Iris” button. Start menu [pm=start-menu]: Send an Envelope [pm=start-send-envelope], New Agreement, New Request, New Purchase Request.

**All Agreements (01, 04).** Title “All Agreements”. Search field plus filter dropdowns: Party, Type, Status, Owner, and an icon button. List/grid toggle. Each row is a card with a status dot, name [pm=deal-name], “company · value”, avatars or a status [pm=deal-status], counts [pm=deal-counts], and a ⋯ menu.
- Globex Enterprise Platform · Globex Industries · $2.8M · 4 avatars +3 · 5 documents · 3 envelopes
- Apex Manufacturing Supply Agreement · Apex Manufacturing Co. · $1.6M · 3 avatars +1 · 4 documents · 2 envelopes
- DataVault Cloud Services MSA · DataVault Technologies · $920K · progress bar “Waiting for Jordan Mitchell” · 1 envelope
- Pinnacle Consulting SOW · Pinnacle Advisory Group · $340K · 2 avatars · 1 document
- Horizon Analytics Renewal · Horizon Analytics · $185K · 2 avatars · 2 documents · 2 envelopes
- Quantum Systems Integration · Quantum Systems Inc. · $3.2M · 1 avatar · 7 documents · 4 envelopes

Once the NDA is sent, a new top row appears [pm=deal-row-new-vendor]: New Vendor Deal · Sam Sanders · progress bar “Waiting for Sam Sanders” · 1 envelope. Clicking it opens the deal.

**Signature Request (03a, 03b)** [pm=sr-page]. Full-page form with header “× Signature Request: Non-Disclosure Agreement”, “Advanced Options” and a help icon.
- Add documents: an NDA tile “Non-Disclosure Agreement · 1 page” [pm=sr-doc-nda], plus an upload drop zone with an “Upload” button.
- Add recipients [pm=sr-recipients]: “Set signing order” checkbox, “View”, “Import bulk list”. Name and Email fields, a “Needs to Sign ▾” control and “Customize ▾”, all in an orange-left-bordered block. An “Add Recipient ▾” button.
- Footer: Save, and Next [pm=sr-next].

**Deal page (03c, 05, 09a, 14b, 15)** [pm=deal-page]
- Purple header: back arrow [pm=deal-back]; “New Vendor Deal”; participant avatars [pm=deal-participants]; person and eye icons.
- Stage tracker [pm=deal-stages]. In the sent state: Prepare · **Sent** · Signing · Complete. From the drafting state on: Inception · **Drafting** · Client Review · Legal Review · Signature · Complete.
- Chip strip [pm=deal-chips]: “● Awaiting Signature” (later “● Drafting MSA”) | “Party 👤 Sam Sanders” [pm=chip-party] | “Expires In 1 year” [pm=chip-expires] | ⋯
- Documents card [pm=docs-panel]: grid/list toggle and a + button. An “Add Documents” tile [pm=doc-add], then document cards with a thumbnail and a corner badge.
  - NDA [pm=doc-card-nda]: “Out for signature”, “Non-Disclosure Agreement”, “Waiting for Sam Sanders”.
  - MSA [pm=doc-card-msa]: badge [pm=doc-card-msa-badge] “Draft”, later “Edits suggested”; “New Vendor MSA”, “Modified Today”.
- Tasks card [pm=tasks-panel]: + button [pm=tasks-add]. Columns: Task, Assigned To, Status, Due Date, Actions. A row shows a Remind button in Actions on hover. Newest task goes on top.
- Messages panel [pm=messages-panel]: history, chat and Iris icons. Feed is newest first, each item with an icon and “Just now”. Composer placeholder: “Ask, @mention, or / for actions”, with a send button.
- Toasts: bottom-left, dark, with a check icon and ×, auto-dismiss after 3 s.

**NDA side panel (05)** [pm=nda-panel]. Right drawer titled “Non-Disclosure Agreement” with ×. Contents: document preview; “Sent by you · Yesterday at 10:14 am” [pm=nda-sent-by]; “Recipients (0 of 1 complete)”; “Sam Sanders needs to sign · sam.sanders@globex.com” [pm=nda-recipients]; “You receive a finished copy”. Footer: “View Details”, and “Remind Signers” [pm=nda-remind].

**Party drawer (06)** [pm=party-drawer]. “Sam Sanders”, with badges “AI-Assisted” (violet) and “Active” (green). Tabs: Overview, Agreements, Obligations, Details.
- Negotiation History [pm=party-negotiation], subtitle “Previous positions and outcomes with this party”, “View all” and arrows. Columns: Term, Previous Position, Agreed Position, Outcome.
  - Liability cap ④ · 2x annual contract value · 3x annual contract value · ✓ Accepted with CFO approval
  - Data retention ③ · 90 days · 180 days · ✓ Accepted with DPA amendment
  - Indemnification ② · Mutual · Enhanced vendor indemnification · ✓ Accepted
  - Payment Terms ① · Net 30 · Net 60 · ✓ Accepted
- Non-standard Terms: “Net 60 day payment terms · Standard is net 30 · High risk”; “Unlimited liability for data breach · High risk”.
- Renewing Agreements: “1 in the next year”, Total Value, and an NDA row with “Auto-renew”.

**File picker (07a)** [pm=file-picker]. An in-app modal styled like the macOS “Open” dialog, with a sidebar (AirDrop, Recents, Applications, Desktop, Documents, Downloads). Files: New Vendor MSA (preselected), Master Services Template, Vendor Onboarding Packet, 2026 Budget Proposal, Statement of Work Q3, Non-Disclosure Agreement. Buttons: Cancel, and Open [pm=file-open]. Open adds the MSA to the deal and opens the editor.

**MSA editor (07b, 08a–d, 12a)** [pm=msa-editor]
- Header: back arrow [pm=editor-back]; “New Vendor MSA.docx”; “version 4.0 ▾”; “In Review” badge. On the right: ⋯, comment icon, sparkle icon, Save, and “Send for Signature” with a caret [pm=editor-send-caret]. The caret menu contains “Send for Client Review”.
- Toolbar: “Editing ▾”, “1 / 24”, Body Text, Arial, 12, B I U, text color, link, align, lists. Left icon rail; zoom controls bottom-left.
- Page [pm=msa-page]: “NEW VENDOR MSA” / “Acme Corporation & Globex Industries” / “Effective Date: January 15, 2026” [pm=msa-effective-date].
  - **1. Definitions:** This Master Services Agreement ("Agreement") is entered into as of January 15, 2026 ("Effective Date") by and between Acme Corporation, a Delaware corporation ("Buyer"), and Globex Industries, a California corporation ("Supplier"). "Services" shall mean the cloud infrastructure, software development, and technical consulting services described in Exhibit A. "Confidential Information" means any information disclosed by either party that is marked as confidential or would reasonably be considered confidential.
  - **2. Scope of Services:** Supplier shall provide the Services as described in Exhibit A, attached hereto and incorporated by reference. The Services shall include: (a) Cloud infrastructure provisioning and management; (b) Custom software development per specifications in Exhibit B; (c) Technical consulting and advisory services; (d) 24/7 monitoring and incident response. Supplier shall assign dedicated full-time resources with minimum 3 years experience to perform the Services and shall not subcontract any material portion exceeding 20% without prior written consent of Buyer.
  - **3. Term and Termination:** This Agreement shall commence on the Effective Date and continue for an initial term of three (3) years, automatically renewing for successive one-year terms unless either party provides ninety (90) days written notice of non-renewal.
- Context menu [pm=msa-context-menu]: “Add comment”, “Add approval”.
- Add Approval panel [pm=approval-panel], left side: Description* (“Please approve”); “Require all to approve” toggle with helper text “You cannot require all to approve if a group has been added as an approver”; Add approvers* search [pm=approval-search] with a results dropdown (name plus email); selected approvers shown as a chip. Footer: Reset, and Create Approval [pm=approval-create].

**Tasks + menu (10a)** [pm=tasks-add-menu]: Signature Request, Upload request, Identity verification, New Vendor Onboarding, each with an icon.

**Upload request (10b)** [pm=upload-form]. Full-page form “× Upload request”, prefilled.
- Details: Title* “Certificate of Insurance”; Description “Please upload {VENDOR}’s current Certificate of Insurance (COI).” with a characters-remaining counter; Due date (empty).
- Assignee: First name* Sam, Last name* Sanders, Email address* sam.sanders@globex.com.
- Footer: Cancel, and Send [pm=upload-send].

**New vendor onboarding (11a)** [pm=onboarding-form]. Full-page form, prefilled.
- Vendor: subtitle “Set up onboarding for this vendor before the task is started.”; Vendor name* {VENDOR}; Contact email sam.sanders@globex.com; Due date.
- Assignee: “Who owns this onboarding workflow?”; First name Sam, Last name Sanders.
- Footer: Cancel, and Create task [pm=onboarding-create].

**Send for Client Review (12b)** [pm=client-review-modal]. Full-page modal.
- Document: “New Vendor MSA.docx”.
- Add Recipients*: a search field, with Sam Sanders prefilled as a removable row.
- Message (optional): placeholder “Add a note for your recipient”.
- Footer: Cancel, and Send for Review.

**Vendor portal (13a, 13b)** [pm=portal]
- Dark green header with the Acme wordmark top-left. Use plain text “Acme”. The screenshot shows a placeholder brand; don’t copy it.
- “Welcome, Sam Sanders”; chips “New Vendor Deal” and “4 tasks remaining”.
- Right side: “YOUR CONTACT”, Paula Procurement with email and phone, a “Send message” button, and an avatar.
- Tabs: Tasks, Documents. The task list [pm=portal-tasks] is in two groups; each row has an icon, a title, “Sent by Paula Procurement, April 25, 2026”, “● Not started”, and a dark button.
  - Review and sign: “Review New Vendor MSA.docx” (with “| View message”) and Review [pm=portal-btn-review]; “Sign Non-Disclosure Agreement” and Sign [pm=portal-btn-sign].
  - Forms and documentation: “New Vendor Onboarding — {VENDOR}” and Start [pm=portal-btn-start]; “Certificate of Insurance” and Upload [pm=portal-btn-upload].

**Vendor editor, Suggesting mode (14a)** [pm=msa-editor-suggesting]. Same editor, with a “Suggesting” badge next to “In Review” and only Save on the right. The suggestion card [pm=suggestion-card] sits in the right margin: “Sam Sanders · Globex Industries · just now”, “Replace: ‘January 15, 2026’ with ‘February 1, 2026’”. The inline edit shows the old text struck through in red and the new text in green.

## Deal state progression (store transitions, in order)

1. **Initial.** The deal doesn’t exist yet; the list has six rows.
2. **NDA sent.** The deal exists in the sent stage, with chip “Awaiting Signature”.
   - Documents: NDA.
   - Tasks: “Sign Non-Disclosure Agreement · Sam Sanders · In progress · —”.
   - Messages: “You Created Non-Disclosure Agreement”, then “You Sent Non-Disclosure Agreement to Sam Sanders for signature”.
3. **MSA added and approval created.** Stage switches to drafting, chip “Drafting MSA”.
   - Documents: MSA (Draft), then NDA.
   - Tasks: “Approve content in New Vendor MSA · Leona Legal · In progress”.
   - Messages: “You added New Vendor MSA”, “You requested approval: Approve content in New Vendor MSA”.
4. **COI request.**
   - Tasks: “Certificate of Insurance · Sam Sanders · Not started”.
   - Messages: “You sent an upload request for Certificate of Insurance to Sam Sanders”.
5. **Onboarding.**
   - Tasks: “New Vendor Onboarding — {VENDOR} · Sam Sanders · Not started · in 7 months”.
   - Messages: “You started the New Vendor Onboarding workflow for {VENDOR}”.
6. **Sent for review.**
   - Tasks: “Review New Vendor MSA.docx · Sam Sanders · In progress”.
   - Messages: “You sent New Vendor MSA.docx for review”.
7. **Vendor suggested edits.** The MSA badge changes to “Edits suggested”.
   - Messages: “Sam Sanders suggested edits to New Vendor MSA.docx”.

## Presentation steps (port into the engine’s `steps` array)

Each step has a `scene` (index into `scenes`), a `title` (shown as “On screen: …” and in the jump menu), a `cue` (the script line I read; verbatim), and `do` (what the step’s `run()` must do, using the engine’s helpers). Bracketed names are `data-pm` targets. Default camera behaviour follows the reference: zoom only where a step says so; otherwise use the global Zoom setting.

```json
{
 "scenes": [
  "01 · One home for every deal",
  "02 · Keep eSignature simple",
  "03 · Send an NDA, just like today",
  "04 · Status right on the row",
  "05 · See who you’re waiting on",
  "06 · What’s inside the contract",
  "07 · Add the MSA",
  "08 · Route it to legal",
  "09 · The deal keeps up with you",
  "10 · Ask the vendor for their insurance",
  "11 · Kick off onboarding",
  "12 · One space for everyone on the deal",
  "13 · What the vendor sees",
  "14 · Edits come back to you",
  "15 · Where this goes"
 ],
 "steps": [
  {
   "scene": 1,
   "title": "Cover: Unified Agreements",
   "cue": "This is our unified agreements concept.",
   "do": "Show the cover card. Hide cursor, clear highlights, reset camera."
  },
  {
   "scene": 1,
   "title": "Fade to All Agreements · mark every deal",
   "cue": "Every deal in one place,",
   "do": "Fade the cover out. Mark the six deal names [pm=deal-name]."
  },
  {
   "scene": 1,
   "title": "Mark what’s in each deal",
   "cue": "with what’s in it",
   "do": "Replace marks with the document/envelope counts [pm=deal-counts]."
  },
  {
   "scene": 1,
   "title": "Mark who it’s waiting on",
   "cue": "and who it’s waiting on.",
   "do": "Replace marks with the DataVault row’s “Waiting for Jordan Mitchell” status [pm=deal-status, DataVault row]."
  },
  {
   "scene": 2,
   "title": "Highlight Start",
   "cue": "eSignature already works great for most users.",
   "do": "Clear marks. Highlight the Start button [pm=start-button]; move the cursor onto it."
  },
  {
   "scene": 2,
   "title": "Open Start menu",
   "cue": "So we keep it that simple, and make it the front door to the rest of our platform.",
   "do": "Click Start. Highlight the open menu [pm=start-menu] (Send an Envelope, New Agreement, New Request, New Purchase Request)."
  },
  {
   "scene": 3,
   "title": "Send an Envelope → Signature Request",
   "cue": "It starts just like today.",
   "do": "Click “Send an Envelope” [pm=start-send-envelope]. Wait for the Signature Request page [pm=sr-page]. Reset camera."
  },
  {
   "scene": 3,
   "title": "The NDA is already attached",
   "cue": "Grab the NDA,",
   "do": "Highlight the Non-Disclosure Agreement tile [pm=sr-doc-nda]."
  },
  {
   "scene": 3,
   "title": "Type Sam in as the recipient",
   "cue": "add Sam from the vendor,",
   "do": "Scroll to Add recipients [pm=sr-recipients]. Click the Name field and type “Sam Sanders”, then the Email field and type “sam.sanders@globex.com” (typed character by character, ~35 ms per character; instant in fast replay). Highlight the recipient block."
  },
  {
   "scene": 3,
   "title": "Next → deal page, sent toast",
   "cue": "and send.",
   "do": "Clear highlight. Click Next [pm=sr-next]. Wait for the deal page [pm=deal-page] in its “sent” state; toast “Your documents were sent for signature.”"
  },
  {
   "scene": 4,
   "title": "Back to the list · new top row",
   "cue": "The new deal shows up in your list,",
   "do": "Click the deal’s back arrow [pm=deal-back]. On All Agreements, highlight the new top row “New Vendor Deal · Sam Sanders · 1 envelope” [pm=deal-row-new-vendor]."
  },
  {
   "scene": 4,
   "title": "Mark the row’s status",
   "cue": "status right on the row.",
   "do": "Mark “Waiting for Sam Sanders” on that row [pm=deal-status, New Vendor Deal row]."
  },
  {
   "scene": 5,
   "title": "Open the deal · NDA side panel",
   "cue": "Click in to see who you’re waiting on,",
   "do": "Clear. Click the New Vendor Deal row; wait for the deal page. Click the NDA document card [pm=doc-card-nda]; wait for the side panel [pm=nda-panel]. Highlight its recipients block [pm=nda-recipients] (“Sam Sanders needs to sign”)."
  },
  {
   "scene": 5,
   "title": "What’s happened so far",
   "cue": "what’s happened,",
   "do": "Highlight “Sent by you · Yesterday at 10:14 am” [pm=nda-sent-by]."
  },
  {
   "scene": 5,
   "title": "Remind Signers",
   "cue": "and send a reminder.",
   "do": "Move the cursor to Remind Signers [pm=nda-remind] and highlight it. Don’t click."
  },
  {
   "scene": 6,
   "title": "Close panel · header chips",
   "cue": "We also pull out what’s inside your contracts,",
   "do": "Clear. Close the side panel. Highlight the header chip strip [pm=deal-chips] (Awaiting Signature · Party Sam Sanders · Expires In 1 year)."
  },
  {
   "scene": 6,
   "title": "Key dates",
   "cue": "like key dates",
   "do": "Mark “Expires In 1 year” [pm=chip-expires]."
  },
  {
   "scene": 6,
   "title": "Party drawer · negotiation history",
   "cue": "and your history with this party.",
   "do": "Clear. Click the Party chip [pm=chip-party]; wait for the party drawer [pm=party-drawer]. Highlight Negotiation History [pm=party-negotiation]."
  },
  {
   "scene": 7,
   "title": "Close drawer",
   "cue": "Now imagine a few weeks go by.",
   "do": "Clear. Close the drawer, hide cursor, reset camera."
  },
  {
   "scene": 7,
   "title": "Add Documents → file picker → editor",
   "cue": "You upload the MSA right into the same deal.",
   "do": "Click Add Documents [pm=doc-add]. Wait for the in-app file picker [pm=file-picker] with “New Vendor MSA” preselected; pause 400 ms; click Open [pm=file-open]. Wait for the MSA editor [pm=msa-editor]."
  },
  {
   "scene": 8,
   "title": "Zoom to the document",
   "cue": "Need legal’s sign-off?",
   "do": "Zoom gently onto the document page [pm=msa-page] (max 1.3)."
  },
  {
   "scene": 8,
   "title": "Select text · context menu",
   "cue": "Select the text,",
   "do": "Show a text-selection highlight on “Effective Date: January 15, 2026” [pm=msa-effective-date] and open the context menu [pm=msa-context-menu] (Add comment, Add approval) beside it."
  },
  {
   "scene": 8,
   "title": "Add approval panel",
   "cue": "add an approval,",
   "do": "Click Add approval. Reset camera. Wait for the Add Approval panel [pm=approval-panel] with Description prefilled “Please approve”. Highlight the panel."
  },
  {
   "scene": 8,
   "title": "Pick Leona → Create Approval",
   "cue": "pick Leona.",
   "do": "Click Add approvers [pm=approval-search], type “le”, wait for results (Leona Legal, Liam Legal), click Leona Legal, click Create Approval [pm=approval-create]. Toast “Approval added to tasks”."
  },
  {
   "scene": 9,
   "title": "Back to the deal · documents side by side",
   "cue": "The draft sits next to the NDA,",
   "do": "Click the editor back arrow [pm=editor-back]. The deal is now in its drafting state; toast “Your document was added”. Highlight both document cards [pm=doc-card-msa, doc-card-nda]."
  },
  {
   "scene": 9,
   "title": "Approval task",
   "cue": "the approval’s a task,",
   "do": "Highlight the task row “Approve content in New Vendor MSA · Leona Legal · In progress” [pm=task-approve-msa]."
  },
  {
   "scene": 9,
   "title": "New milestones",
   "cue": "and the milestones move to match where the deal is.",
   "do": "Highlight the stage tracker [pm=deal-stages] (Inception · Drafting · Client Review · Legal Review · Signature · Complete, with Drafting current) and the “Drafting MSA” chip."
  },
  {
   "scene": 10,
   "title": "Tasks + menu",
   "cue": "Need the vendor’s insurance certificate?",
   "do": "Clear. Scroll to Tasks [pm=tasks-panel]. Click the Tasks + button [pm=tasks-add]; highlight the menu [pm=tasks-add-menu] (Signature Request, Upload request, Identity verification, New Vendor Onboarding)."
  },
  {
   "scene": 10,
   "title": "Upload request → Send",
   "cue": "Send an upload request.",
   "do": "Click Upload request. Wait for the Upload request form [pm=upload-form], already filled in. Highlight it briefly, then click Send [pm=upload-send]."
  },
  {
   "scene": 10,
   "title": "COI task lands in the list",
   "cue": "It lands in the same task list.",
   "do": "Toast “Upload request sent out”. Highlight the new top task row “Certificate of Insurance · Sam Sanders · Not started” [pm=task-coi]."
  },
  {
   "scene": 11,
   "title": "New Vendor Onboarding → Create task",
   "cue": "Ready to onboard them? Start the onboarding workflow right here.",
   "do": "Clear. Click Tasks + then New Vendor Onboarding. Wait for the form [pm=onboarding-form], already filled in; highlight it; click Create task [pm=onboarding-create]."
  },
  {
   "scene": 11,
   "title": "Onboarding task",
   "cue": "It’s tracked like everything else,",
   "do": "Toast “Vendor onboarding workflow created”. Highlight the task row “New Vendor Onboarding — Globex Industries · Sam Sanders · Not started · in 7 months” [pm=task-onboarding]."
  },
  {
   "scene": 11,
   "title": "Remind",
   "cue": "and you can nudge anyone who’s behind.",
   "do": "Hover that row so its Remind button [pm=task-onboarding-remind] appears; highlight Remind."
  },
  {
   "scene": 12,
   "title": "Everyone on the deal",
   "cue": "Here’s a real strength: everyone on the deal works in one space.",
   "do": "Clear hover. Scroll to top. Highlight the participant avatars [pm=deal-participants] and the Messages panel [pm=messages-panel]."
  },
  {
   "scene": 12,
   "title": "Open the MSA",
   "cue": "MSA ready?",
   "do": "Clear. Click the MSA document card; wait for the editor."
  },
  {
   "scene": 12,
   "title": "Send for Client Review",
   "cue": "Send it to the vendor for review, right from here.",
   "do": "Click the Send for Signature caret [pm=editor-send-caret]; click “Send for Client Review”; wait for the modal [pm=client-review-modal] (recipient Sam Sanders prefilled); click Send for Review. Return to the deal; toast “Your document was sent for review”."
  },
  {
   "scene": 13,
   "title": "Cut to the vendor portal",
   "cue": "Here’s the vendor’s side:",
   "do": "Veil-cut (white flash, 300 ms) to the vendor portal [pm=portal], “Welcome, Sam Sanders”. Reset camera, hide cursor."
  },
  {
   "scene": 13,
   "title": "Everything waiting on them",
   "cue": "one page with everything waiting on them.",
   "do": "Scroll so all four tasks show. Highlight the task list [pm=portal-tasks]."
  },
  {
   "scene": 13,
   "title": "Review · Sign · Start · Upload",
   "cue": "Review, sign, onboard, upload.",
   "do": "Clear highlight. Mark the four action buttons in order [pm=portal-btn-review, portal-btn-sign, portal-btn-start, portal-btn-upload], each mark appearing 450 ms after the last."
  },
  {
   "scene": 14,
   "title": "Vendor opens the MSA · Suggesting",
   "cue": "In the real world, things change.",
   "do": "Clear. Click Review [pm=portal-btn-review]; wait for the editor in vendor Suggesting mode [pm=msa-editor-suggesting]. Highlight the “Suggesting” badge."
  },
  {
   "scene": 14,
   "title": "Suggested edit",
   "cue": "Suggested edits come right back to you,",
   "do": "Show the suggestion: “January 15, 2026” in section 1 struck through and “February 1, 2026” inserted, plus a suggestion card [pm=suggestion-card] by Sam Sanders (Globex). Highlight the card and the edit together."
  },
  {
   "scene": 14,
   "title": "Back on the deal · Edits suggested",
   "cue": "flagged on the deal.",
   "do": "Veil-cut to the internal deal page. Highlight the MSA card’s “Edits suggested” badge [pm=doc-card-msa-badge] and the task row “Review New Vendor MSA.docx · Sam Sanders · In progress” [pm=task-review-msa]."
  },
  {
   "scene": 15,
   "title": "Where we started",
   "cue": "We started with simple signature collection.",
   "do": "Clear. Highlight the NDA document card [pm=doc-card-nda]."
  },
  {
   "scene": 15,
   "title": "The whole agreement",
   "cue": "Now it’s one shared space for the whole agreement:",
   "do": "Highlight Documents, Tasks and Messages together [pm=docs-panel, tasks-panel, messages-panel]."
  },
  {
   "scene": 15,
   "title": "Tasks, workflows, vendor view",
   "cue": "tasks, workflows, a vendor view,",
   "do": "Highlight the Tasks panel [pm=tasks-panel]."
  },
  {
   "scene": 15,
   "title": "Messaging",
   "cue": "and down the road, messaging inside and out.",
   "do": "Highlight the Messages panel and its composer [pm=messages-panel]."
  },
  {
   "scene": 15,
   "title": "Closing",
   "cue": "That’s how we believe we drive IAM adoption.",
   "do": "Clear all, hide cursor, reset camera, show the closing card."
  }
 ]
}
```

## Done means

- Space walks all 47 steps with no hand navigation, and every highlight lands on the right element at 16:9, 16:10 and Fill.
- ← from any step, a jump-menu selection and R all rebuild the correct screen via fast replay, with no leftover toasts, hovers or marks.
- Clicking through the prototype by hand (Interact mode or `/`) reaches the same states.
- The dock and the popped-out script both show the current cue, matching `cue` character for character.

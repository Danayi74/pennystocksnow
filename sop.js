const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat, TabStopType, TabStopPosition } = require("docx");

const accent = "B22222";  // PennyStocksNow red
const dark = "1A1A2E";
const gray = "555555";
const lightBg = "FFF5F5";
const headerBg = "1A1A2E";
const headerText = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: headerBg, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: headerText })] })]
  });
}

function bodyCell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text, font: "Arial", size: 20, color: opts.color || gray, bold: opts.bold || false })]
    })]
  });
}

function checklistRow(num, task, details) {
  return new TableRow({
    children: [
      bodyCell(num, 600, { bold: true, color: accent }),
      bodyCell(task, 3200, { bold: true }),
      bodyCell(details, 5560),
    ]
  });
}

function sectionTitle(num, title) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(`${num}. ${title}`)] });
}

function subTitle(num, title) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`${num} ${title}`)] });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 200 },
    children: [new TextRun({ text, color: opts.color || gray, bold: opts.bold || false, font: "Arial", size: 20 })]
  });
}

function mistakeRow(mistake, prevention) {
  return new TableRow({ children: [
    bodyCell(mistake, 4000, { color: accent }),
    bodyCell(prevention, 5360),
  ]});
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: dark },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: accent },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: dark },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 4 } },
            children: [
              new TextRun({ text: "PennyStocksNow.com", bold: true, font: "Arial", size: 18, color: accent }),
              new TextRun({ text: "\tStandard Operating Procedures v2.2", font: "Arial", size: 18, color: gray }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD", space: 4 } },
            children: [
              new TextRun({ text: "CONFIDENTIAL  |  Page ", font: "Arial", size: 16, color: gray }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: gray }),
            ]
          })]
        })
      },
      children: [
        // ======== COVER ========
        new Paragraph({ spacing: { before: 2400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: "STANDARD OPERATING PROCEDURES", font: "Arial", size: 44, bold: true, color: dark })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "PennyStocksNow.com", font: "Arial", size: 36, bold: true, color: accent })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 8, color: accent, space: 8 } },
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: "Website Content Management & Quality Control", font: "Arial", size: 24, color: gray })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Version 2.2  |  May 2026", font: "Arial", size: 22, color: gray })]
        }),
        new Paragraph({ spacing: { before: 2000 } }),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3000, 6360],
          rows: [
            new TableRow({ children: [headerCell("Document Owner", 3000), bodyCell("Mehran Bagherzadeh", 6360)] }),
            new TableRow({ children: [headerCell("Website", 3000), bodyCell("www.pennystocksnow.com", 6360)] }),
            new TableRow({ children: [headerCell("Repository", 3000), bodyCell("github.com/Danayi74/pennystocksnow", 6360)] }),
            new TableRow({ children: [headerCell("Deployment", 3000), bodyCell("Netlify (auto-deploy from GitHub main branch)", 6360)] }),
            new TableRow({ children: [headerCell("Architecture", 3000), bodyCell("Single-file (index.html) + static pages (subscribed.html, about.html, privacy.html, terms.html)", 6360)] }),
            new TableRow({ children: [headerCell("Last Updated", 3000), bodyCell("May 13, 2026  (v2.2 — card-date rule is now the date the card is added to PSN)", 6360)] }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 1: CARD CREATION ========
        sectionTitle("1", "Card Creation Standards"),
        bodyText("Every card on PennyStocksNow.com represents a single engagement between a public company and a hired firm. The following standards must be met for every new card added to the site."),

        subTitle("1.1", "Required Card Elements"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2400, 6960],
          rows: [
            new TableRow({ children: [headerCell("Element", 2400), headerCell("Requirement", 6960)] }),
            new TableRow({ children: [bodyCell("Card Title", 2400, { bold: true }), bodyCell("Format: [Company Name] Engages/Hires/Retains [Firm Name] for [Service]. Must be descriptive and unique.", 6960)] }),
            new TableRow({ children: [bodyCell("Date", 2400, { bold: true }), bodyCell("Use the date the card is added to PSN — i.e., the day you make the website update. NOT the date of the press release and NOT the date the Google Alert was received. If you add a card on May 13, the card-date is May 13, 2026, regardless of when the press release was issued or when the alert arrived. Full month name required (e.g., \"May 13, 2026\"). NEVER use abbreviated months (Apr, Mar, Feb, etc.).", 6960)] }),
            new TableRow({ children: [bodyCell("Tickers", 2400, { bold: true }), bodyCell("BOTH Canadian (TSXV/CSE/TSX) AND US (OTC/NASDAQ) tickers must be included if they exist. Tickers appear in both card-title and card-body. NEVER add inline styles to ticker spans.", 6960)] }),
            new TableRow({ children: [bodyCell("Hired Box(es)", 2400, { bold: true }), bodyCell("One hired-box per firm. Multi-firm deals get separate hired-boxes with individual icons, amounts, and terms.", 6960)] }),
            new TableRow({ children: [bodyCell("Payment Amount", 2400, { bold: true }), bodyCell("Research the actual press release. Include dollar figure, currency (CAD/USD/EUR), term length, and any stock/option compensation. Only use \"not publicly disclosed\" if genuinely unavailable.", 6960)] }),
            new TableRow({ children: [bodyCell("Card Body", 2400, { bold: true }), bodyCell("Summary paragraph with company name in bold, ticker spans, firm name in bold, and engagement details.", 6960)] }),
            new TableRow({ children: [bodyCell("data-text", 2400, { bold: true }), bodyCell("Searchable text: company name, ticker symbols (without exchange prefix), firm name, service type, exchange names.", 6960)] }),
            new TableRow({ children: [bodyCell("data-tags", 2400, { bold: true }), bodyCell("Category tag: investor-awareness, market-making, digital-marketing, etc.", 6960)] }),
          ]
        }),

        subTitle("1.2", "Standardized Firm Names"),
        bodyText("Always use the exact standardized name below in all hired-firm divs. Do not add or remove suffixes (Inc., Corp., LLC, Ltd.) from the approved form."),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({ children: [headerCell("Standardized Name", 4680), headerCell("Common Variants (DO NOT USE)", 4680)] }),
            new TableRow({ children: [bodyCell("Independent Trading Group (ITG)", 4680, { bold: true }), bodyCell("ITG Inc., Independent Trading Group Inc.", 4680)] }),
            new TableRow({ children: [bodyCell("i2i Marketing Group LLC", 4680, { bold: true }), bodyCell("i2i Marketing Group, LLC (no comma)", 4680)] }),
            new TableRow({ children: [bodyCell("Connect 4 Marketing", 4680, { bold: true }), bodyCell("Connect 4 Marketing Ltd.", 4680)] }),
            new TableRow({ children: [bodyCell("Spark Newswire", 4680, { bold: true }), bodyCell("Spark Newswire Inc.", 4680)] }),
            new TableRow({ children: [bodyCell("ICP Securities Inc.", 4680, { bold: true }), bodyCell("(use as-is)", 4680)] }),
            new TableRow({ children: [bodyCell("Venture Liquidity Providers", 4680, { bold: true }), bodyCell("VLP (use full name in hired-firm div)", 4680)] }),
            new TableRow({ children: [bodyCell("Plutus Invest & Consulting", 4680, { bold: true }), bodyCell("(use as-is)", 4680)] }),
            new TableRow({ children: [bodyCell("Machai Capital Inc.", 4680, { bold: true }), bodyCell("(use as-is)", 4680)] }),
            new TableRow({ children: [bodyCell("Native Ads Inc.", 4680, { bold: true }), bodyCell("(use as-is)", 4680)] }),
            new TableRow({ children: [bodyCell("Capital Analytica", 4680, { bold: true }), bodyCell("(use as-is)", 4680)] }),
            new TableRow({ children: [bodyCell("Senergy Communications", 4680, { bold: true }), bodyCell("(use as-is)", 4680)] }),
            new TableRow({ children: [bodyCell("Euroswiss Capital Partners Inc.", 4680, { bold: true }), bodyCell("Euroswiss Capital, Euroswiss Capital Partners (must include Inc.)", 4680)] }),
          ]
        }),

        subTitle("1.3", "Tag Styling & Text Standards"),
        bodyText("Tag badges appear in the card-top area. Standard tag colors: \"Market Making\" uses light blue background (#ebf8ff, color #2b6cb0, border #bee3f8). \"Investor Awareness\" uses light purple (#faf5ff, #6b46c1, #d6bcfa). The promo tag uses the site accent red. NEVER use hyphens in visible text: write \"Market Making\" not \"Market-Making\", and \"Market Maker\" not \"Market-Maker\" (hyphens are only used in data-tags values like \"market-making\")."),

        subTitle("1.4", "Symbol / Emoji Rules — Tag Badges vs. Hired-Box Icons"),
        bodyText("There are TWO separate symbol systems on each card and they follow different rules:"),
        bodyText("TAG BADGES (the colored button in card-top): All \"Marketing Firm Hired\" tags use the SAME emoji (📣) across every card on the site. All \"Market Maker Hired\" tags use the SAME emoji (🏦) across every card on the site. Both tag types use the identical red tag-promo CSS class — there is NO separate tag-mm class. The tag badge emoji NEVER varies between cards of the same type."),
        bodyText("HIRED-BOX ICONS (the emoji inside the hired-icon div): These MUST vary between adjacent cards. No two neighboring cards should display the same hired-box icon. When adding a new card, check the card directly above and directly below the insertion point and choose an icon that differs from both neighbors. Acceptable hired-box icons include: 📣 🔔 📢 💼 📈 🔍 💰 🚀 🤝 ⚡. This cycling prevents visual monotony and helps users distinguish cards at a glance."),

        subTitle("1.5", "Payment & Source Formatting"),
        bodyText("In hired-purpose text: bold ONLY the firm payment dollar amounts (e.g., \"CAD$10,000 per month\"). Do not bold other text in the hired-purpose div. If payment terms are unavailable, use the exact phrase \"Payment terms were not publicly disclosed\" in bold. Card footer sources use standardized labels: \"TSXV Filing / Public Disclosure\" or \"CSE Filing / Public Disclosure\". Do NOT use press release service names (Newsfile, Newswire, TipRanks, etc.) as source labels."),

        subTitle("1.6", "Filter Count Maintenance"),
        bodyText("The filter buttons at the top of the feed show counts: All=XX, Market Making=XX, Investor Awareness=XX. These MUST be updated every time a card is added or removed. Count all cards tagged with the respective data-tags value. The All count is the total of all cards."),

        subTitle("1.7", "Bulk Card Addition"),
        bodyText("When adding multiple cards at once (e.g., retroactive cards from past months): maintain strict reverse chronological order, insert cards into the correct month position relative to existing cards, update all sidebar counts and filter counts after ALL cards are added, and run the full QC checklist once at the end."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 2: SIDEBAR MANAGEMENT ========
        sectionTitle("2", "Sidebar Management"),

        subTitle("2.1", "Top Firms Hired"),
        bodyText("The \"Top Firms Hired (2026 YTD)\" sidebar displays firms ranked by number of engagements. The following rules apply every time a card is added, removed, or modified:"),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2000, 7360],
          rows: [
            new TableRow({ children: [headerCell("Rule", 2000), headerCell("Details", 7360)] }),
            new TableRow({ children: [bodyCell("Accuracy", 2000, { bold: true, color: accent }), bodyCell("The sidebar-count number MUST match the exact number of cards containing that firm. Re-count every time.", 7360)] }),
            new TableRow({ children: [bodyCell("Max Entries", 2000, { bold: true, color: accent }), bodyCell("The sidebar MUST display exactly 10 firms. No more, no fewer.", 7360)] }),
            new TableRow({ children: [bodyCell("Order", 2000, { bold: true, color: accent }), bodyCell("Firms MUST be listed in strict descending order by count. When two or more firms have the SAME count, they MUST be sorted in ALPHABETICAL order by firm name. This applies to every tie at every level of the list.", 7360)] }),
            new TableRow({ children: [bodyCell("New Firms", 2000, { bold: true, color: accent }), bodyCell("If a new firm reaches 3+ engagements and its count is high enough to place in the top 10 (using alphabetical tiebreaking), add it and remove the firm that falls to position 11.", 7360)] }),
            new TableRow({ children: [bodyCell("Hover/Cursor", 2000, { bold: true, color: accent }), bodyCell("All sidebar-row elements must have cursor: pointer and the red hover effect.", 7360)] }),
          ]
        }),

        subTitle("2.2", "Tickers to Watch / Recent Matches"),
        bodyText("TICKERS TO WATCH: Display the 5 most recent cards that have a MINIMUM of 2 marketing firm engagements on a SINGLE card (i.e., 2+ hired-boxes on one card). Cards with only 1 hired firm do NOT qualify. When a new multi-firm card is added, it goes to the top and the oldest entry drops off. Each entry shows the ticker, company name, and date."),
        bodyText("RECENT MATCHES: Shows the 5 most recent engagements regardless of how many firms are on the card. Update every time new cards are added."),
        bodyText("Both sections: same hover/cursor rules apply. All entries are clickable via scrollToMatch()."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 3: WELCOME BANNER & EMAIL CAPTURE ========
        sectionTitle("3", "Welcome Banner & Email Capture"),

        subTitle("3.1", "Welcome Banner"),
        bodyText("The welcome banner (#welcome-banner) appears at the top of the feed below the search bar. Behavior: the banner is hidden on BOTH desktop and mobile whenever a search query is active (including \"No results found\"). It is restored when the search is cleared. The applyFilters() function handles this logic."),

        subTitle("3.2", "Email Capture Bar"),
        bodyText("The email capture bar (#email-capture) sits directly below the welcome banner. Styling: background #fffaf0 (matches the hired-box), border-bottom 1px solid #fbd38d. Contains a bell icon, heading \"Get Weekly Sector Analysis Alerts\", subtext \"Delivered to your inbox every Monday morning.\", an email input, and a red Subscribe button."),
        bodyText("Behavior: hidden during search (same as welcome banner). On submit, the email is saved to localStorage under key 'psn_subscribers', then the user is redirected to /subscribed. The bar uses the same hide/show logic as the welcome banner in applyFilters()."),

        subTitle("3.3", "Email Signup Popup"),
        bodyText("A modal popup (#email-popup-overlay) appears after 30 seconds on page. Icon: megaphone emoji. Title: \"Stay Ahead of the Market\". Body describes the weekly sector analysis alerts. Contains an email form and \"No spam. Unsubscribe anytime.\" note."),
        bodyText("Display conditions: only shows if (1) sessionStorage 'psn_popup_dismissed' is not set, AND (2) localStorage 'psn_subscribers' is empty. Dismissing sets sessionStorage flag (per-session only). Clicking overlay background also dismisses. On submit, email is saved to localStorage and user is redirected to /subscribed."),

        subTitle("3.4", "Email Storage (Client-Side)"),
        bodyText("Email subscribers are stored in localStorage under key 'psn_subscribers' as a JSON array of email strings. This is client-side only (no backend sync yet). The popup dismissal flag uses sessionStorage under key 'psn_popup_dismissed' (resets when tab is closed, so the popup can reappear on the next visit). Future integration with Beehiiv or Mailchimp will replace the localStorage approach."),

        subTitle("3.5", "Thank You Page (/subscribed)"),
        bodyText("subscribed.html is a standalone page at pennystocksnow.com/subscribed. It contains: the site nav bar with PennyStocksNow logo linking to /, a megaphone icon, \"You're In!\" heading, welcome message confirming the Monday email, a \"Browse Latest Alerts\" red button linking to /, and a spam folder reminder note. Responsive mobile styles included."),

        subTitle("3.6", "Month Navigation"),
        bodyText("The month-nav buttons (e.g., \"March 2026\", \"April 2026\") allow users to jump to cards from specific months. These buttons are hidden during search on BOTH desktop and mobile, and restored when search is cleared. The applyFilters() function handles this."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 4: CSS & MOBILE RULES ========
        sectionTitle("4", "CSS & Mobile Rules"),

        subTitle("4.1", "iOS Safari Compatibility"),
        bodyText("Critical rules for iPhone Safari that MUST be followed:"),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [headerCell("Rule", 3200), headerCell("Details", 6160)] }),
            new TableRow({ children: [
              bodyCell("Never use overflow:hidden on ancestors of sticky elements", 3200, { bold: true, color: accent }),
              bodyCell("overflow:hidden on html, body, or any wrapper BREAKS position:sticky in Safari. Use overflow-x:clip instead.", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Never use 100vw", 3200, { bold: true, color: accent }),
              bodyCell("iOS Safari 100vw includes the scrollbar width, causing horizontal overflow. Always use width:100% and max-width:100% instead.", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Never add inline styles to ticker spans", 3200, { bold: true, color: accent }),
              bodyCell("Inline style=\"font-size:XXpx\" overrides mobile CSS media queries. All ticker styling must be in the stylesheet with !important on mobile rules.", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Always set min-width:0 on flex children", 3200, { bold: true, color: accent }),
              bodyCell("Flexbox min-width defaults to auto, preventing children from shrinking below content width. Add min-width:0 to .card-top, .card-tags, .hired-details, etc.", 6160),
            ]}),
            new TableRow({ children: [
              bodyCell("Use box-sizing:border-box everywhere", 3200, { bold: true, color: accent }),
              bodyCell("Mobile media query starts with *, *::before, *::after { box-sizing: border-box; } to prevent padding from causing overflow.", 6160),
            ]}),
          ]
        }),

        subTitle("4.2", "Mobile Media Query (@media max-width:900px)"),
        bodyText("The mobile breakpoint at 900px applies comprehensive overflow prevention. Key rules: html and body get overflow-x:clip (NOT hidden) and width:100%. The sidebar is hidden. The main-layout switches to single column. All cards, feed, and content elements get max-width:100% and overflow:hidden. The sticky-top header retains position:sticky with z-index:200. The email capture bar stacks vertically with smaller text."),

        subTitle("4.3", "Sticky Header"),
        bodyText("The search bar (.sticky-top) uses position:sticky; top:0; z-index:200 to remain visible while scrolling. This works on desktop and mobile. CRITICAL: never add overflow:hidden to any ancestor element (html, body, header, nav, .search-bar) or sticky will break in Safari. The fix is overflow-x:clip which clips overflow without breaking sticky positioning."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 5: QC CHECKLIST ========
        sectionTitle("5", "Quality Control Checklist"),
        bodyText("Run this checklist BEFORE every commit. Every item must pass. No exceptions.", { bold: true }),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [600, 3200, 5560],
          rows: [
            new TableRow({ children: [headerCell("#", 600), headerCell("Check", 3200), headerCell("How to Verify", 5560)] }),
            checklistRow("1", "Ticker completeness", "Every card has Canadian ticker AND US ticker if available. Search Yahoo Finance or exchange websites."),
            checklistRow("2", "Date format", "All card-date spans use full month names: \"April 8, 2026\" not \"Apr 8, 2026\"."),
            checklistRow("3", "Reverse chronological order", "Cards ordered newest to oldest. No date later than the card above it."),
            checklistRow("4", "No duplicate cards", "No two cards with same company + firm for the same engagement."),
            checklistRow("5", "Payment amounts researched", "Search press releases for actual amounts. Only \"not publicly disclosed\" if truly unavailable."),
            checklistRow("6", "Firm name consistency", "Every hired-firm div uses exact standardized name from Section 1.2."),
            checklistRow("7", "Multi-firm cards", "Each firm gets its own hired-box with separate icon, amount, and term."),
            checklistRow("8", "Sidebar counts accurate", "Count actual cards for each sidebar firm. Must match sidebar-count span exactly."),
            checklistRow("9", "Sidebar descending order", "Firms listed highest count to lowest. Re-sort if counts changed."),
            checklistRow("10", "data-text searchable", "Includes: company name, all tickers (no exchange prefix), firm name, service type."),
            checklistRow("11", "Filter counts updated", "All/Market Making/Investor Awareness button counts match actual card counts."),
            checklistRow("12", "No inline styles on tickers", "Grep for 'class=\"ticker\" style' in index.html. Must return zero results."),
            checklistRow("13", "No overflow:hidden on sticky ancestors", "html, body, header, nav, .sticky-top, .search-bar must NOT have overflow:hidden. Use overflow-x:clip."),
            checklistRow("14", "Welcome banner hides on search", "Type a query: welcome banner, email capture bar, and month-nav all disappear. Clear search: they reappear."),
            checklistRow("15", "Email capture bar works", "Enter email, submit. Verify redirect to /subscribed. Check localStorage for psn_subscribers."),
            checklistRow("16", "Email popup works", "Wait 30 seconds on fresh session. Popup appears. Submit email, verify redirect. Refresh: popup should not reappear."),
            checklistRow("17", "Subscribed page loads", "Navigate to /subscribed. Verify heading, message, Browse button, and spam note all display."),
            checklistRow("18", "Sticky header on mobile", "Test on iPhone Safari: scroll down, search bar stays pinned to top."),
            checklistRow("19", "Mobile 100% fit", "On iPhone Safari: no horizontal scroll, all cards fit within screen width."),
            checklistRow("20", "Local files updated", "Copy index.html AND subscribed.html to Downloads/PSN/ after every push."),
            checklistRow("21", "GA4 tracking intact", "Confirm G-Q2BC5Z66N8 script tag still present in <head>. Do not remove or modify."),
            checklistRow("22", "Recent Matches updated", "If new cards were added, update the Recent Matches sidebar to show the latest 5 entries."),
            checklistRow("23", "Top Movers data current", "If adding new promo tickers, add them to the PROMO_TICKERS array with correct startPrice and currency."),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 6: DEPLOYMENT WORKFLOW ========
        sectionTitle("6", "Deployment Workflow"),
        bodyText("Every change follows this exact sequence. Do not skip steps."),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Step 1: Make Changes")] }),
        bodyText("Edit files in the local git clone (/tmp/psn-push/). Main content, CSS, and JS live in index.html. Static pages (subscribed.html, about.html, privacy.html, terms.html) are separate files."),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Step 2: Run QC Checklist")] }),
        bodyText("Run the full 23-point checklist from Section 5. Use Python audit scripts to automate sidebar count verification, ticker completeness, date format validation, and duplicate detection."),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Step 3: Commit with Descriptive Message")] }),
        bodyText("Stage changes, write a clear commit message. Include specifics (e.g., \"Add CAD$150,000 amount to F4 Uranium card\")."),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Step 4: Push to GitHub")] }),
        bodyText("Push to the main branch of Danayi74/pennystocksnow. Netlify auto-deploys from main."),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Step 5: Save Local Copies")] }),
        bodyText("Copy ALL changed files (index.html, subscribed.html, etc.) to the local Downloads/PSN/ folder so the user always has the latest versions on their machine."),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Step 6: Verify Live Site")] }),
        bodyText("Open the Netlify URL in browser. Use cache-busting query params (?v=N) if needed. Verify the change is visible and nothing is broken."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 7: COMMON MISTAKES ========
        sectionTitle("7", "Common Mistakes to Avoid"),
        bodyText("These are errors that have occurred in the past and must never be repeated."),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4000, 5360],
          rows: [
            new TableRow({ children: [headerCell("Mistake", 4000), headerCell("Prevention", 5360)] }),
            mistakeRow("Sidebar count doesn't match actual cards", "Always re-count cards after any add/remove. Use automated Python script."),
            mistakeRow("Sidebar not in descending order", "After updating any count, check all counts go highest to lowest."),
            mistakeRow("Missing Canadian or US ticker", "Look up every company on Yahoo Finance, CSE, or TSXV."),
            mistakeRow("Abbreviated date format", "Search for \"card-date\" and verify all use full month names."),
            mistakeRow("Inconsistent firm names", "Always copy standardized name from Section 1.2. Never type from memory."),
            mistakeRow("\"Payment not disclosed\" when it was", "Always search for the actual press release before marking as undisclosed."),
            mistakeRow("Duplicate cards", "Search for the company name before adding a new card."),
            mistakeRow("Forgot to save local copy", "ALWAYS copy ALL changed files to Downloads/PSN/ after pushing."),
            mistakeRow("Inline styles on ticker spans", "NEVER add style=\"font-size:XXpx\" to ticker spans. It overrides mobile CSS. All styling must be in the stylesheet."),
            mistakeRow("overflow:hidden breaking sticky header", "Never use overflow:hidden on html, body, or any ancestor of .sticky-top. Use overflow-x:clip instead."),
            mistakeRow("Using 100vw on mobile", "100vw includes scrollbar width on iOS Safari. Always use width:100% and max-width:100%."),
            mistakeRow("Filter counts not updated", "After adding/removing any card, recount and update All/Market Making/Investor Awareness button numbers."),
            mistakeRow("Netlify cache showing old version", "Use cache-busting query params (?v=N) when testing. Verify changes are live."),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 8: SEARCH, FILTER & JAVASCRIPT ========
        sectionTitle("8", "Search, Filter & JavaScript"),

        subTitle("8.1", "Tab Navigation"),
        bodyText("The site has two main tabs: \"Promo Alerts\" and \"Top Movers\". The switchTab(tab) function toggles visibility between the two content areas. When on the Promo Alerts tab, the search bar and filter buttons are visible. When on Top Movers, the search bar is hidden."),

        subTitle("8.2", "Search & Filtering (applyFilters)"),
        bodyText("The core filtering function is applyFilters(). It runs on every keystroke (oninput=\"filterCards()\") and filter button click. It reads the search input value and the activeFilter variable (\"all\", \"market-making\", or \"investor-awareness\"). Each card's visibility is determined by matching data-text against the search query AND data-tags against the active filter. Cards are shown/hidden using classList.toggle('hidden', !show)."),
        bodyText("Side effects of applyFilters(): (1) Hides/shows welcome banner, email capture bar, and month-nav when search is active. (2) Hides/shows month divider headers based on whether any cards in that month are visible. (3) Shows \"No results found\" message when zero cards match. (4) Restores all elements when search is cleared."),

        subTitle("8.3", "Sidebar Click Filtering"),
        bodyText("Clicking a firm in the sidebar calls a filter function that searches for cards containing that firm's name. The clicked row gets an 'active-firm' CSS class for visual highlighting. Clicking the same firm again clears the filter. The scrollToMatch(text) function scrolls to a specific card by matching its data-text attribute, with scroll-margin-top:120px on month dividers to account for the sticky header."),

        subTitle("8.4", "Sort Control"),
        bodyText("The feed header contains a sort selector that calls sortCards(order). This reorders cards within the feed between newest-first and oldest-first by parsing actual date strings (not string comparison). Month dividers are repositioned accordingly. IMPORTANT: the sidebar must be preserved during sort operations — a past bug caused the sidebar to disappear after sorting."),

        subTitle("8.5", "Month Dividers"),
        bodyText("Cards are grouped by month with divider headers (e.g., \"April 2026\"). Each divider has scroll-margin-top:120px to account for the sticky header when jumping via month-nav buttons. Dividers auto-hide when all cards in that month are hidden (via search/filter). When filtering is cleared, all dividers reappear."),

        subTitle("8.6", "Logo & Navigation Behavior"),
        bodyText("The PennyStocksNow logo in the nav bar triggers a full page reload (window.location.reload) rather than just scrolling to top. This ensures all filters, search queries, and state are reset cleanly."),

        subTitle("8.7", "Mobile Search Stability"),
        bodyText("On mobile, search input must not cause the viewport to jump or scroll on each keystroke. The filterCards() function is debounce-safe. The search bar is centered at 80% width on mobile with the filter buttons hidden (they are desktop-only). The \"No results found\" message appears when zero cards match the query."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 9: TOP MOVERS & TWELVE DATA API ========
        sectionTitle("9", "Top Movers & Twelve Data API"),

        subTitle("9.1", "Top Movers Tab"),
        bodyText("The \"Top Movers -- Year-to-Date\" tab displays two sub-views: Top Gainers and Top Losers, toggled by switchMoversView(). Static data is hardcoded with 10 top gainers and 10 top losers showing company name, ticker, exchange, start price, current price, and percent change."),

        subTitle("9.2", "PROMO_TICKERS Array"),
        bodyText("A constant array of 31+ ticker objects defines all tracked promo stocks. Each object contains: name (company name), yticker (Twelve Data symbol format), display (display ticker), exchange, startPrice (price at promo start), and currency (USD or CAD). This array drives the live price loading feature."),

        subTitle("9.3", "Twelve Data API Integration"),
        bodyText("The \"Go Live\" button enables real-time price updates. Users enter their Twelve Data API key (free tier: 800 calls/day). The key is stored in localStorage via getTdKey()/saveTdKey()/resetTdKey(). The loadTopMovers() async function fetches live quotes from https://api.twelvedata.com/quote for each ticker, calculates YTD percent change, and sorts by performance. Status messages show loading, success, and error states. Currency formatting uses fmtMoney() with C$ for CAD and $ for USD."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 10: SEO, ANALYTICS & META ========
        sectionTitle("10", "SEO, Analytics & Meta"),

        subTitle("10.1", "Google Analytics"),
        bodyText("GA4 tracking is embedded in the <head> with tracking ID G-Q2BC5Z66N8. This must not be removed or modified."),

        subTitle("10.2", "Structured Data (JSON-LD)"),
        bodyText("Schema.org WebApplication structured data is included in the <head> for SEO rich snippets. This helps search engines understand the site's purpose and display enhanced results."),

        subTitle("10.3", "Open Graph & Meta Tags"),
        bodyText("Complete SEO metadata is in the <head> including: og:title, og:description, og:image (og-stock-promo-feed.png), og:url, Twitter Card tags, canonical URL, and robots meta tag. These must be kept up to date when the site's description or branding changes."),

        subTitle("10.4", "Noscript Fallback"),
        bodyText("A <noscript> section provides helpful text for users with JavaScript disabled, explaining that the site requires JavaScript to function."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 11: SIDEBAR WIDGETS ========
        sectionTitle("11", "Sidebar Widgets"),

        subTitle("11.1", "Tickers to Watch"),
        bodyText("Displays the 5 most recent tickers whose card contains a MINIMUM of 2 marketing firm engagements (2+ hired-boxes on a single card). Cards with only 1 hired firm do NOT qualify for this section. Each entry shows the ticker symbol, company name, and card date, and is clickable via scrollToMatch() to jump to the corresponding card. Uses .watch-ticker class (different from .ticker used on cards). When a new qualifying multi-firm card is added, it enters at the top of the list and the oldest entry is removed to maintain exactly 5 entries."),

        subTitle("11.2", "Recent Matches"),
        bodyText("Shows the 5 most recent engagements with title, date, and tag badge. Each entry is clickable via scrollToMatch(). Update this section every time new cards are added to keep it showing the latest 5."),

        subTitle("11.3", "Disclaimer Box"),
        bodyText("A green/yellow disclaimer notice warns users about due diligence. This is static content and should not be modified without legal review."),

        subTitle("11.4", "Footer"),
        bodyText("The footer contains navigation links to /about.html, /privacy.html, and /terms.html, plus the PennyStocksNow brand. All footer links must be kept working when pages are added or renamed."),

        new Paragraph({ children: [new PageBreak()] }),

        // ======== SECTION 12: SITE PAGES ========
        sectionTitle("12", "Site Pages Reference"),
        bodyText("The site consists of multiple static HTML pages, all auto-deployed via Netlify from the GitHub main branch:"),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2400, 3200, 3760],
          rows: [
            new TableRow({ children: [headerCell("File", 2400), headerCell("URL", 3200), headerCell("Purpose", 3760)] }),
            new TableRow({ children: [bodyCell("index.html", 2400, { bold: true }), bodyCell("pennystocksnow.com/", 3200), bodyCell("Main site with all cards, search, sidebar, email capture, popup", 3760)] }),
            new TableRow({ children: [bodyCell("subscribed.html", 2400, { bold: true }), bodyCell("pennystocksnow.com/subscribed", 3200), bodyCell("Thank you page after email signup", 3760)] }),
            new TableRow({ children: [bodyCell("about.html", 2400, { bold: true }), bodyCell("pennystocksnow.com/about", 3200), bodyCell("About page", 3760)] }),
            new TableRow({ children: [bodyCell("privacy.html", 2400, { bold: true }), bodyCell("pennystocksnow.com/privacy", 3200), bodyCell("Privacy policy", 3760)] }),
            new TableRow({ children: [bodyCell("terms.html", 2400, { bold: true }), bodyCell("pennystocksnow.com/terms", 3200), bodyCell("Terms of service", 3760)] }),
          ]
        }),

        new Paragraph({ spacing: { before: 400 } }),

        // Closing
        new Paragraph({
          spacing: { before: 400, after: 200 },
          border: { top: { style: BorderStyle.SINGLE, size: 8, color: accent, space: 8 } },
          children: [new TextRun({ text: "Zero tolerance for unforced errors. Every change goes through the checklist. Every time.", font: "Arial", size: 24, bold: true, color: accent })]
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("PennyStocksNow_SOP.docx", buffer);
  console.log("SOP v2.0 document created successfully.");
});

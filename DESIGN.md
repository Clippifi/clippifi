# Clippifi design system

How every Clippifi screen looks and behaves. **Layouts follow the proven patterns of
creator marketplaces** (campaign rails, status tabs, earnings timelines); **the look and
feel follows Apple** (Human Interface Guidelines): calm surfaces, clear type, one accent,
soft motion. Built on shadcn/ui (`src/components/ui`) with Tailwind 4.

Tokens live in `src/app/globals.css`. Icons live in `src/components/icons.tsx`.
Never hard-code a colour, radius or icon in a screen; use the tokens and the icon module.

---

## 1. Principles

1. **Content first.** The number or the clip is the hero of each card. Chrome is quiet.
2. **One accent.** Brand yellow appears a few times per screen, never as decoration.
3. **Say what will happen.** Buttons say the action ("Submit clip"); empty states say
   what will appear and why; disabled buttons say what's missing.
4. **Same parts everywhere.** Reuse the components below before making a new one.
5. **Honest numbers.** Every money figure shows its currency; estimates say "≈".

## 2. Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#F5F5F7` | `#000000` | Page canvas (app screens) |
| `card` | `#FFFFFF` | `#1C1C1E` | Cards, panels, table rows |
| `popover` | `#FFFFFF` | `#2C2C2E` | Menus, dialogs, sheets |
| `foreground` | `#252525` charcoal | `#F5F5F7` | Text, icons |
| `muted-foreground` | `#6E6E73` | `#98989D` | Secondary text, labels |
| `primary` | `#252525` | `#F5F5F7` | **Main action buttons**, selected tab text |
| `secondary` / `muted` | `#EBEBEF` / `#F0F0F3` | `#2C2C2E` | Quiet buttons, input fill, segmented track |
| `border` | `#E5E5EA` | white 10% | Hairlines around cards and inputs |
| `brand` (`brand-400`) | **`#FFE873`** | same | Brand moments (see below), always with charcoal on top |
| `success` / `success-muted` | `#1A8F4C` / `#E3F5EA` | `#30D158` | **Money and rates only**, approved, paid |
| `warning` / `warning-muted` | `#A35B00` / `#FFF1D6` | `#FFB340` | Pending, under review, needs attention |
| `destructive` / `destructive-muted` | `#D70015` / `#FFE8E8` | `#FF453A` | Rejected, failed, delete |
| `info` / `info-muted` | `#0A64D8` / `#E5EFFF` | `#409CFF` | Neutral notices, links in text |

**Where yellow goes:** the logo tile, the one hero call-to-action on marketing pages,
progress and budget bars, selected checks and radio cards, the "Live" badge, empty-state
icon circles, celebratory moments ("You earned $12.40"). **Never** yellow text on white
(use `brand-700` if you must), never yellow body backgrounds, never more than one
yellow button per view.

**Why actions are charcoal:** `#FFE873` is too light to read as "press me" on white and
can't carry white text. Charcoal buttons with white text are the app's main action, as
in Apple's apps.

**Stat tile tints** (icon circles only): views `info-muted`/`info`, money
`success-muted`/`success`, campaigns `brand-100`/`brand-800`, submissions
`muted`/`foreground`.

## 3. Type

Font: **Inter** (`font-sans`). Numbers in tables and money use `tabular-nums`.
Apple's SF Pro is not licensed for the web; don't use it.

| Class | Size / line | Weight | Use |
|---|---|---|---|
| `text-display` | 32 / 38 | 700, tight | Page greeting ("Good morning, Ada") |
| `text-title` | 24 / 30 | 600 | Page and dialog titles |
| `text-figure` | 40 / 44 | 600 | The big number in a card ("$1,240.00") |
| `text-headline` | 17 / 24 | 600 | Card titles, section headers |
| `text-body` | 15 / 22 | 400 | Default text |
| `text-callout` | 14 / 20 | 400–500 | Form labels, list rows, buttons |
| `text-footnote` | 13 / 18 | 400 | Help text, meta ("Submitted 2h ago") |
| `text-caption` | 12 / 16 | 500 | Chips, sidebar section labels, axis labels |

Sentence case everywhere ("Submit clip", not "Submit Clip"). No ALL CAPS except tiny
eyebrows with letter-spacing.

## 4. Layout and spacing

- 4px grid. Common gaps: 8, 12, 16, 24, 32.
- **App shell** (`/c`, `/b`): left sidebar (collapsible) + thin top bar (page title left;
  help and account pill right) + content column, **max 1040px**, centred, 24px padding
  (16px on phones).
- Pages stack **cards** with 16px between them. Card padding 20px (24px for hero cards).
- **Mobile:** sidebar becomes a sheet; primary sections move to a floating pill tab bar
  (5 items) with a separate round search button, as in the references.
- Wizards are full-screen: back link top-left, step name + % + progress bar top-right,
  sticky bottom bar (blocker message left; Back · Save as draft · Continue right),
  optional live summary rail on the right (≥1280px).

## 5. Shape, elevation, motion

- Radius: controls `rounded-lg` (12px); cards and dialogs `rounded-xl`/`rounded-2xl`
  (17–22px); chips, pills, segmented controls and avatars `rounded-full`.
- Cards are **flat**: white fill + 1px `border` + `shadow-card` at most. Only floating
  things (menus, dialogs, toasts, the mobile tab bar) get `shadow-float`.
- Motion: 150ms for hovers and presses, 250ms for panels and sheets, easing
  `ease-[var(--ease-apple)]`; sheets and dialogs may use `--ease-spring`. Buttons press
  down to 98%. Respect `prefers-reduced-motion`.
- Blur (`backdrop-blur`) only on bars that float over content (mobile tab bar, sticky
  headers).

## 6. Icons

**Hugeicons**, stroke rounded, 1.5px stroke, from `@/components/icons` only. Sizes:
16px in buttons, chips and inputs (`size-4`); 20px in nav, list rows and stat tiles
(`size-5`). Icons inherit `currentColor`. Selected nav items use full-strength
`foreground`; unselected use `muted-foreground`. Platform logos (TikTok, Instagram,
YouTube) come from `src/components/app/platform-icons.tsx`, in their own colours only
inside platform badges.

## 7. Components

Use the shadcn component first; the notes below are how Clippifi styles and uses it.

- **Button** (`ui/button`): `default` = charcoal (main action, one per area);
  `secondary` = grey fill; `outline` for low-emphasis actions next to a primary;
  `ghost` in toolbars; `destructive` for delete. Sizes `sm` 32px, `default` 36px,
  `lg` 44px (full-width CTAs on mobile). Disabled until valid, with the reason shown nearby.
  Marketing pages use `btnPrimary` (yellow) and `btnSecondary` from `lib/button-styles`.
- **Segmented control** (status filters): grey track, white selected pill, label +
  count ("Pending 1"). Used for every status filter (Submissions, Payouts, Campaigns).
- **Stat tile:** tinted icon circle (40px) + value (`text-headline` tabular) + label
  (`text-footnote` muted). Four in a row on desktop, 2×2 on phones.
- **Hero money card:** label ("Lifetime earned"), `text-figure` amount, action on the
  right ("Withdraw"), stat tiles below.
- **Campaign card:** 16:9 banner (rounded top) with overlay chips (dark "Paid from 1.4K
  views", yellow "Fast review"); brand avatar + name + age; platform icons; title (1 line);
  budget "$1.5K / $4K"; creator count chip; rate chip in `success-muted` ("$1.00 / 1K");
  yellow progress bar.
- **Chip / Badge:** `rounded-full`, `text-caption`, tinted background by meaning:
  success (Approved, Paid), warning (Pending), destructive (Rejected), muted (Draft),
  brand (Live, New).
- **Empty state:** 48px icon in a brand-yellow circle (charcoal icon), `text-headline`
  title, one `text-callout` muted line saying what will appear, optional primary button.
- **Skeleton:** mirror the real layout's blocks; never a lone spinner for a page.
- **Inputs:** filled (`input` background), no border until focus; label above
  (`text-callout`), help or error below (`text-footnote`); character counter for text
  limits ("0/300"); lock icon for read-only fields.
- **Radio / choice cards:** white card, icon circle, title + one line, check in the
  corner when selected (yellow circle, charcoal tick).
- **Toggle rows:** title + description left, switch right, in a card.
- **Dialogs:** centred, `rounded-2xl`, optional illustration on top, title, one or two
  lines, actions right ("Not now" ghost + primary). Sheets on mobile.
- **Toasts** (Sonner): dark pill, icon, short past-tense message ("Clip submitted").
- **Tables:** rows in a card, 52px rows, muted header labels, tabular numbers right-aligned,
  status chip column, row click opens details.
- **Charts:** one series in `chart-1` (charcoal) or `chart-2` (yellow), faint grid, dark
  tooltip, Daily/Cumulative and metric segmented controls above.

## 8. Money, numbers and time

- USD is the main figure: `$1,234.56` (two decimals for money, always).
- Local estimate as a second line, only for NGN-corridor viewers:
  `≈ ₦1,850,000 at today's rate`.
- Rates: `$1.50 / 1K views` (cards: `$1.50/1K`). Budgets: `$1,469 / $4,000`.
- Large counts compact: `12.4K`, `1.2M` (exact value in a tooltip).
- Relative time for recent ("2h ago", "3d"), dates for older ("Nov 11, 2026").
- Empty values show an em dash `—`, never `0` pretending to be data.

## 9. Voice

Short, plain, second person. Say what happens and what to do next.
"Pick up where you left off." · "Nothing needs changes. When a brand asks for changes,
the draft shows up here." · "$2,530 still up for grabs." · "Visible once you join."
Errors say what went wrong and how to fix it; no apologies, no jargon.

## 10. Accessibility

Contrast at least 4.5:1 for text (charcoal on yellow passes; white on yellow fails).
Visible focus ring (`ring`, yellow-500). Hit targets 36px+ (44px on touch). Every icon
button has a label. Don't rely on colour alone: status chips always have text.

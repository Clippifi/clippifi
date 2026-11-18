# Clippifi design system

How every Clippifi screen looks and behaves. **Layouts follow the proven patterns of
creator marketplaces** (campaign rails, status tabs, earnings timelines); **the look and
feel follows Apple** (Human Interface Guidelines): calm layered surfaces, clear type,
one accent, soft motion. Built on shadcn/ui with Tailwind 4.

- Tokens: `src/app/globals.css`. Icons: `src/components/icons.tsx` (Phosphor).
- Never hard-code a colour, radius or icon in a screen; use tokens, the icon module and
  the components below.

---

## 0. Rule one: reuse before you build

1. **Look for a shadcn component first** (`npx shadcn search`, the docs, or
   `src/components/ui`). Dashboard, tabs, switch, spinner, skeleton, drawer, dialog,
   tooltip, dropdown, table, chart and more already exist.
2. **Then the shadcn registries** for a better-styled or animated version:
   Animate UI (`@animate-ui`, already in use for tabs and switch), and others such as
   Watermelon UI. Install with the shadcn CLI so the code lands in our repo and we own it.
3. **Then our Clippifi parts** in `src/components/app/` (list in section 7).
4. **Only then build something new**, and make it a reusable part, not a one-off.

When installing, never let the CLI overwrite our customised files (`button.tsx`,
`card.tsx`, `badge.tsx`, `sidebar.tsx`, `dialog.tsx`, `drawer.tsx`): answer **no**.
Pin new packages to a release at least two weeks old.

## 1. Principles

1. **Content first.** The number or the clip is the hero of each card. Chrome is quiet.
2. **Surfaces, not borders.** Separate things by shade, never by outlines (section 3).
3. **One accent, on purpose.** Yellow marks Clippifi's core actions only (section 2).
4. **Say what will happen.** Buttons name the action; empty states say what to do next;
   a disabled button says what's missing.
5. **Honest numbers.** Every money figure shows its currency; estimates say "≈".

## 2. Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#F6F5F1` warm off-white | `#1E1E1D` | Page canvas |
| `card` | `#FFFFFF` | `#282826` | Raised surfaces: cards, sections, the mobile tab bar |
| `muted` | `#EFEDE7` | `#33332F` | Inner blocks inside cards, tracks, tiles, input fill |
| `popover` | `#FFFFFF` | `#2F2F2D` | Menus, dialogs, drawers (with shadow) |
| `foreground` | `#252525` charcoal | `#ECEBE7` | Headings, primary text, icons |
| `muted-foreground` | `#6F6D67` | `#A3A29C` | Descriptions, labels, meta, unselected nav |
| `primary` | `#252525` | `#ECEBE7` | Neutral main buttons |
| `brand` | **`#FFE873`** | same | Core brand actions and brand moments, with charcoal on top |
| `success` / `-muted` | `#1A8F4C` / `#E3F5EA` | `#4CC77A` | Money, rates, approved, paid, connected |
| `warning` / `-muted` | `#A35B00` / `#FFF1D6` | `#F2B24C` | Pending, needs attention |
| `destructive` / `-muted` | `#D70015` / `#FFE8E8` | `#F06A5E` | Rejected, failed, delete |
| `info` / `-muted` | `#0A64D8` / `#E5EFFF` | `#5AA2F0` | Neutral notices |
| `border` | charcoal 7% | white 7% | Inputs and table row dividers **only** |

**Yellow (brand) is for actions that serve Clippifi's purpose**, the money loop:
Start earning, Launch a campaign, Join campaign, Submit clip, Connect TikTok, Withdraw,
Fund campaign. Also the logo tile, budget/progress bars, the "Live" chip, empty-state
circles and celebratory moments. **Everything routine is neutral:** Save changes,
Continue/Back in forms, Cancel, Disconnect, filters, View details, Export use charcoal or
grey. Never yellow text on a light surface, never more than one yellow button per view.

**Dark mode is lifted and desaturated**: soft charcoal layers, never pure black, and
off-white text, never pure white. Easier on the eyes and more professional.

## 3. Surfaces, not borders

- **No borders around cards, sections or containers.** Separate by background shade.
- **Three layers:** page (`background`) → raised (`card`) → inner (`muted`). Each step is
  a slightly different shade from the one beneath it.
- Borders exist only on **inputs** and **table row dividers**, at very low opacity (`border`).
- **Floating things** (mobile tab bar, active tab pill, menus, dialogs, drawers, toasts)
  get a soft, low-opacity shadow instead of a border.
- **State banners** use tinted fills (`Notice`), never outlined boxes.
- The one structural line: a **faint vertical divider** between the desktop sidebar and
  the content (`--sidebar-border`, ~6% opacity). Nothing else gets an edge line.
- **Fill holds, lines organise:** white cards and fills group content; inside a card, data
  and structure use hairlines (`border-hairline`, `divide-hairline`): tables, stat strips,
  timelines, lists. Dashed outline = locked. An element never combines fill, border and shadow.
- **Campaign page:** the hero's art melts into its own colour and carries brand, title, brief
  and the main action, edge to edge on phones. Rates are one table with a row per platform.
  Layout follows the space available (container queries), not the screen width.
- **Campaign card:** brand row, a one-line title, then paid / pool ("$1.5K / $4K") with the
  creators and rate chips on the same line, and the budget bar. The rate is a highlighted
  chip ("up to" when platforms pay differently), not a headline. Every card in a row is the same height.
- **Verified brands** always use Phosphor's `SealCheck`, never a plain check.
- **Progress bars** use Animate UI `Progress` (recessed track, lit brand fill).
- **Page width:** pages are centred (max 1024px) for comfortable reading. Pages with a side
  panel (the campaign page) use `data-page-width="wide"` (max 1152px); browse pages
  (Discover) go edge to edge with `data-page-width="full"`.
- **Scrolling rails** (`ScrollRail`): on full-width pages each section is one sideways row
  at every size: swipe on phones, ← → buttons on larger screens, cards running off the
  edge to show there's more. Positioned children need a `relative` parent inside the
  rail, or they widen the page. `CardRail` (grid on desktop) stays for short lists.
- **Lists on phones:** long campaign lists use `CampaignRow`, which shows everything the
  campaign card does: square artwork with the type; brand, title, platforms and status beside it; then the same paid / pool amounts ("$1.5K / $4K"),
  creators, rate chip and budget bar as the campaign card.
- **Sidebar:** 288px open, 72px collapsed. The collapse toggle lives inside the sidebar
  (never in the page, where it would scroll away): beside the logo when open, under the
  symbol in the icon column when collapsed. Collapsed shows only the symbol logo,
  centred icons with room for their fills, labels as tooltips; no text is ever cut off.

**Before finishing any UI work, check:** is there a visible border around a card or
container? If yes, replace it with a shade difference.

## 4. Type

**Inter variable** (`font-sans`) with the optical-size axis on, so large headings get
display spacing and small text stays open. Money and counts use `tabular-nums`.

| Role | Size / line | Weight | Notes |
|---|---|---|---|
| Page title | 28 / 34 | 700 | tracking −0.025em (`PageHeader`) |
| Section title | 20 / 28 | 700 | tracking −0.02em |
| Card title | 17 / 24 | 600 | tracking −0.01em |
| Body | 15 / 22 | 400 | |
| Secondary | 14 / 20 | 400 | `muted-foreground` |
| Meta | 13 / 18 | 400 | `muted-foreground` |
| Chip | 12 / 16 | 500 | |

Hierarchy comes from weight and colour: titles in `foreground`, everything supporting in
`muted-foreground`, so screens read calm and refined. Sentence case everywhere.

## 5. Shape, spacing and motion

- Radius: cards and sections `rounded-3xl`; inner blocks `rounded-2xl`; icon tiles
  `rounded-[14px]`; **buttons, tabs, chips, filters and avatars are pills** (`rounded-full`).
- Spacing on a 4px grid. Cards pad 20px. Sibling cards sit 16px apart. **Interactive
  rows (sidebar items, list rows, menu items) always keep a gap of at least 4px** so
  hover and selected fills never touch.
- Hover is lighter than selected: hover uses the selected fill at ~55%.
- Icons and labels are muted at rest and **darken to `foreground` on hover and when
  selected**.
- **Motion is subtle only:** springy popovers and dialogs, smooth layout shifts (sliding
  tab pill, tab-bar indicator via Motion `layoutId`), buttons press to 97%. No decorative
  animation. Respect reduced motion.

## 6. Icons

**Phosphor**, **filled** (soft, rounded shapes), from `@/components/icons` only. Small
directional marks (carets, arrows, close, check, spinner) use the bold weight. Default
size 20px (`size-5`); 16–18px inside buttons and chips; 22px in icon tiles; 24px in the
mobile tab bar. Icons inherit `currentColor`. Platform logos (TikTok, Instagram, YouTube)
come from `platform-icons.tsx` and sit on their brand-coloured tiles.

## 7. Components (use these, don't rebuild them)

**From shadcn / registries** (`src/components/ui`, `src/components/animate-ui`):
- **Button** (`ui/button`): pills, no borders. Variants: `brand` (yellow, core actions),
  `default` (charcoal), `secondary` (grey), `outline` (white with soft shadow, for use on
  grey), `ghost`, `destructive`, `link`. Sizes: `sm` 32px, `default` 40px, `lg` 48px, icon sizes.
- **Tabs** (`animate-ui/components/radix/tabs`): pill track in `muted`, white pill that
  slides to the active tab. Use for every status filter and segmented choice; show counts
  with `<span data-count>3</span>`.
- **Switch** (`animate-ui/components/radix/switch`) for settings toggles.
- **Badge** (`ui/badge`): chips. Variants `secondary` (default), `brand`, `success`,
  `warning`, `destructive`, `info`. Always a word, never colour alone.
- **Dialog** and **Drawer** (Vaul): use them through `Confirm` (below), or directly for
  bigger flows. Drawers on phones, dialogs on larger screens.
- **Toasts**: Sonner (`toast.success`, `toast.error`), one short past-tense sentence.
- **Skeleton** for loading states that mirror the real layout.
- **Sidebar** (`ui/sidebar`): desktop navigation.

**Clippifi parts** (`src/components/app`):
- `PageHeader`: page title + muted description.
- `IconTile`: filled icon on a soft square; tones `brand`, `ink`, `muted`, `success`,
  `warning`, `info`, `danger`, or a platform colour via `className`.
- `Notice`: tinted state banner (`info`, `success`, `warning`, `danger`).
- `EmptyState`: solid yellow circle with a filled icon, bold title, one muted line,
  at most one action.
- `UserAvatar`: the photo, or a soft gradient generated from the person (no initials).
- `Confirm`: asks before consequential actions; drawer on phones, dialog elsewhere.
- `MobileTabBar`: floating detached pill, blurred, active icon in a grey circle.
- Cards and sections: `rounded-3xl bg-card p-5`, image-first cards for media with a
  dark gradient over the image so text stays readable.

## 8. Money, numbers and time

- USD is the main figure, two decimals: `$1,234.56`. Local estimate as a second line,
  only for naira-paid viewers: `≈ ₦1,850,000 at today's rate`.
- Rates `$1.50 / 1K views` (cards `$1.50/1K`); budgets `$1,469 / $4,000`.
- Large counts compact (`12.4K`) with the exact value in a tooltip.
- Recent times relative ("2h ago"); older ones dates ("Nov 11, 2026").
- Missing values show `—`, never a fake `0`.

## 9. Voice

Short, plain, second person. "Pick up where you left off." · "No public videos yet. Post
on TikTok and your videos will show up here." Errors say what went wrong and how to fix
it. No apologies, no jargon.

## 10. Accessibility

Text contrast at least 4.5:1 in both themes (charcoal on yellow passes; white on yellow
fails). Visible focus rings. Hit targets 40px+ (48px on touch). Every icon-only button
has a label. Status never relies on colour alone.

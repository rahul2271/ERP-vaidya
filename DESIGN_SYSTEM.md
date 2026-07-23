# VAIDYA ERP — Design System (Calm Clinical)

## What changed in this pass

### 1. Full color retint (mechanical, whole app)
Every `blue-*` Tailwind class → `teal-*`, every `indigo-*` → `sky-*`, across all 83
client files. This was safe because both were used exclusively as brand/action colors
(verified zero false positives before running). Status colors were left untouched:
- `emerald` = success / money
- `rose` / `red` = errors / urgent
- `amber` / `orange` = warnings / premium

### 2. Custom token palette (tailwind.config.ts)
Beyond the mechanical retint, three new named scales were added so future work can use
semantic names instead of raw Tailwind colors:

| Token | Use | Base hex (500/600) |
|---|---|---|
| `primary` | Brand, primary actions, links, active nav | `#34968a` / `#25786f` (deep clinical teal) |
| `secondary` | Secondary actions, wellness/success accents | `#63924f` / `#4c743d` (sage green) |
| `ink` | Text and neutral backgrounds (warmer than slate) | `#65766c` / `#505e56` |

### 3. Typography
- **Poppins** (`font-display`) — logo, hero headlines, section titles only.
- **Inter** (`font-sans`, the new default body font) — dashboards, tables, forms.
  Inter has better small-size legibility and tabular figures than Poppins, which
  matters in a data-dense ERP.

### 4. Dead code removed
~35,000 lines of commented-out historical component/controller/service versions were
stripped across 30+ files (client + API). Every file was verified to still contain
exactly one live export/class after cleanup. This alone cut the client source from
2.4MB → 1.5MB and the API source from 1.4MB → 880KB — faster to navigate, faster to
build, and much easier for future edits (yours or an AI's) to land in the right place.

### 5. Hand-redesigned (not just retinted)
- **Login page** — moved from a dark, glowing SaaS-hero look to a light, spacious,
  trust-forward layout matching "calm clinical": soft teal/sage ambient washes, warm
  neutral card, generous whitespace, no heavy glow effects.

## What was NOT hand-redesigned
The mechanical retint covers color consistently everywhere, but layout, spacing, and
component structure in the individual dashboards (Reception, Doctor, Pharmacist,
Telecaller, Admin, Super Admin) and the ~15 modals were **not** rebuilt from scratch —
that's a much larger effort than color/cleanup and was out of scope for this pass per
your direction to prioritize the therapy flow + a full-app pass on tone.

## Recommended next steps, in priority order
1. **Reception + Doctor dashboards** — highest-traffic screens, worth a full layout
   pass (spacing rhythm, card hierarchy, table density) using the new tokens.
2. **Shared primitives** — `StatCard.tsx`, `DataTable.tsx`, and button styles are
   currently ad-hoc per-file rather than reusable components; extracting real shared
   components would make future design changes 1-file edits instead of 50-file sweeps.
3. **Modals** — standardize padding, header style, and close-button placement across
   all 15 modals (currently each was hand-built slightly differently).

# UI Design Language: Modern Dark Minimalist

## Core Principles

- Dark-first design with zinc color palette (950-300 scale)
- Content-focused with generous whitespace
- Subtle, purposeful interactions
- Professional and premium aesthetic
- High contrast for accessibility

## Color Palette

- **Background**: `bg-zinc-950` (primary), `bg-zinc-900` (cards/surfaces)
- **Borders**: `border-zinc-800/50` with transparency for depth
- **Text**: White (primary), `text-zinc-400` (secondary), `text-zinc-500` (tertiary)
- **Interactive hover**: `hover:bg-zinc-800`, `hover:border-zinc-700`
- **Opacity modifiers**: `/50`, `/70` for layering

## Typography

- **Headings**: Large and bold (`text-4xl`-`text-5xl`, `font-bold`)
- **Body**: `text-zinc-400` with `leading-relaxed`
- **Labels**: `text-sm`, `font-medium`
- Clear hierarchy with size and weight variations

## Layout & Spacing

- **Centered content**: `max-w-4xl mx-auto`
- **Consistent padding**: `px-6 lg:px-8`, `py-16 md:py-24`
- **Vertical rhythm**: `space-y-6`, `space-y-8`
- **Responsive breakpoints**: md, lg

## Components

- **Rounded corners**: `rounded-xl` (cards), `rounded-lg` (buttons)
- **Cards**: `bg-zinc-900/50` with subtle borders and hover states
- **Buttons**: `bg-zinc-800` with hover lift effects
- **Loading states**: Spinner animations with zinc colors

## Interactions

- **All transitions**: `transition-all duration-200`
- **Hover states**: Color shifts + micro-animations (translate-x-1)
- **Group hover**: Parent-child coordinated effects
- **Disabled states**: `disabled:opacity-50 disabled:cursor-not-allowed`

## Visual Effects

- Grayscale images with low opacity (`opacity-20 grayscale`)
- Gradient overlays: `bg-gradient-to-br from-zinc-800 to-zinc-900`
- Subtle shadows on featured content
- Background patterns at low opacity for texture

## Do's

- Use zinc palette exclusively for neutrals
- Maintain 50/70 opacity for layering depth
- Add smooth transitions to all interactive elements
- Use group-hover for coordinated animations
- Keep borders subtle with transparency

## Don'ts

- Mix other neutral palettes (slate, gray, stone)
- Use sharp transitions or jarring animations
- Overcomplicate with too many colors
- Forget disabled/loading states


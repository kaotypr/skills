# shadcn/ui Learning Guide

This guide helps you learn shadcn/ui from basics to advanced patterns.

## Learning Path

### 1. Understanding the Philosophy

shadcn/ui is fundamentally different from traditional component libraries. Five core principles:

- **Open Code**: Components are copied into your project as source code you own and modify freely — not installed as opaque packages
- **Composition**: Build complex UIs by composing small, focused primitives
- **Distribution**: Share components via registries, not npm packages
- **Beautiful Defaults**: Production-ready styling out of the box
- **AI-Ready**: Designed to work well with AI coding assistants

### 2. Core Concepts to Master

#### Class Variance Authority (CVA)
Most components use CVA for variant management:

```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "variant-classes",
        destructive: "destructive-classes",
      },
      size: {
        default: "size-classes",
        sm: "small-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

#### cn Utility Function
The `cn` function combines classes and resolves conflicts:

```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### oklch Color Format
shadcn/ui uses oklch for CSS variables (not HSL). This provides better perceptual uniformity:

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

Use Tailwind utilities with these: `bg-primary text-primary-foreground`.

### 3. Installation Checklist

- [ ] Choose your framework (Next.js, Vite, TanStack Start, React Router, Laravel, Astro)
- [ ] Initialize with the Base UI variant: `pnpm dlx shadcn@latest init --base base`
- [ ] Review generated `components.json` configuration
- [ ] Configure CSS variables in `globals.css` (oklch format)
- [ ] Install first component: `pnpm dlx shadcn@latest add button`
- [ ] Verify import path works: `import { Button } from "@/components/ui/button"`

### 4. CLI Commands to Know

| Command | Purpose |
|---------|---------|
| `shadcn init` | Initialize project with config and dependencies |
| `shadcn add <component>` | Add a component to your project |
| `shadcn add --all` | Add all components at once |
| `shadcn view <component>` | Preview a component before installing |
| `shadcn search -q "query"` | Search available components |
| `shadcn docs <component>` | View component documentation |
| `shadcn info` | Display project info |
| `shadcn migrate rtl` | Add RTL support |
| `shadcn migrate radix` | Migrate to unified radix-ui package |

### 5. Essential Components to Learn First

1. **Button** — Learn variants (default, outline, ghost, destructive, link), sizes (xs through icon-lg), and the `render` prop pattern
2. **Input & Label** — Form inputs with accessible labels
3. **Field** — Structured accessible form fields with FieldLabel, FieldError, FieldDescription
4. **Card** — Container components
5. **Form** — Form handling with React Hook Form + Zod validation
6. **Dialog** — Modal windows with DialogContent, DialogHeader, DialogTitle
7. **Select** — Dropdown selections
8. **Sonner** — Toast notifications

### 6. Common Patterns

#### Form Pattern
Every form follows this structure:

```
1. Define Zod schema
2. Create form with useForm + zodResolver
3. Wrap with Form component
4. Add FormField for each input (with Controller under the hood)
5. Handle submission with form.handleSubmit()
```

Validation modes: onChange, onBlur, onSubmit (default), onTouched, all.

#### Component Customization Pattern
To customize a component:

1. Open the component source in `@/components/ui/`
2. Modify the CVA variants or add new ones
3. Add new props if needed
4. Update TypeScript types accordingly

#### Dark Mode Pattern
1. Install `next-themes` (Next.js) or build a context-based provider (Vite)
2. Wrap your app with `ThemeProvider`
3. Use `.dark` class CSS variables (already defined by shadcn init)
4. Add a theme toggle component

### 7. Key Differences: Base UI vs Radix

If you're coming from standard shadcn/ui (Radix-based):
- Use `render` prop instead of `asChild`
- Pass `nativeButton={false}` when rendering Button as a non-button element
- Data attributes use `data-open` instead of `data-[state=open]`
- Single `@base-ui/react` package replaces multiple `@radix-ui/*` packages
- All components have `data-slot` attributes

### 8. Best Practices

- Always use TypeScript
- Always import from `@/components/ui/`, never from `@base-ui/react` directly
- Follow the existing component structure
- Use semantic HTML when possible
- Test with screen readers for accessibility
- Keep components small and focused
- Use `accessibilityLayer` prop on chart components for keyboard navigation

### 9. Advanced Topics

- Creating custom components from scratch using Base UI primitives
- Building complex forms with dynamic arrays (`useFieldArray`)
- Implementing dark mode with system preference detection
- RTL support with `shadcn migrate rtl`
- Custom registries for sharing components across projects
- Monorepo setups with `shadcn init --monorepo`

## Resources

- [Official Documentation](https://ui.shadcn.com)
- [GitHub Repository](https://github.com/shadcn/ui)
- [Examples Gallery](https://ui.shadcn.com/examples)
- [Base UI Documentation](https://base-ui.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

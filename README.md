# Next.js Form Submission Demo

A beautifully designed, fully functional contact form built with Next.js 14 App Router.

## Run it

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero landing page |
| `/contact` | The full form demo |

## What this project teaches

| Concept | File |
|---------|------|
| `useState` for form data | `contact/page.js` |
| `useEffect` for side effects | `contact/page.js` |
| Form validation | `validateAll()` function |
| Controlled inputs | Every `<input>` with `value` + `onChange` |
| Conditional rendering | Success screen vs form |
| CSS Modules | `contact.module.css` |
| Reusable components | `Field`, `SideRow`, `SuccessScreen` |
| Loading / async simulation | `setTimeout` in `handleSubmit` |

## Features

- Live progress bar (tracks required fields)
- Real-time re-validation after first submit attempt
- Text inputs, select dropdown, radio buttons, checkboxes
- Character counter on the message field
- Spinner animation during submission
- Success screen with full submission summary
- Fully responsive (stacks on mobile)

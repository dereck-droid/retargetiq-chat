# RetargetIQ Support Chat

AI-powered support chat interface for RetargetIQ's support team.

## Features

- AI assistant powered by Claude 3.5 Sonnet
- 127 Q&A knowledge base for accurate answers
- Professional UI with RetargetIQ branding
- Embeddable in GoHighLevel via iframe
- Sources attribution for transparency

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Chat UI:** reachat
- **AI:** Claude 3.5 Sonnet (Anthropic)
- **Deployment:** Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

## Project Structure

```
├── src/
│   ├── components/
│   │   └── ChatWidget.tsx    # Main chat component
│   ├── styles/
│   │   └── index.css         # Tailwind + custom styles
│   ├── App.tsx
│   └── main.tsx
├── data/
│   ├── knowledge-base.json   # Full KB (127 Q&As)
│   └── knowledge-base-v2.json
├── tailwind.config.js        # Brand colors here
└── vercel.json               # Vercel config
```

## Customization

### Brand Colors

Update colors in `tailwind.config.js`:

```js
colors: {
  brand: {
    primary: '#YOUR_COLOR',    // Main brand color
    // ...
  }
}
```

### Logo

Replace the placeholder in `ChatWidget.tsx` header section.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

### GoHighLevel Integration

Embed as iframe:

```html
<iframe
  src="https://your-vercel-url.vercel.app"
  style="position: fixed; bottom: 20px; right: 20px;
         width: 380px; height: 600px; border: none;
         border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
></iframe>
```

## Knowledge Base

The `/data` folder contains the RetargetIQ knowledge base:
- 127 Q&A pairs across 8 categories
- Covers product features, API, pricing, white-label, etc.
- Used by AI to provide accurate, consistent answers

## License

Private - RetargetIQ / Dereck Droid

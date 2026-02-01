# RetargetIQ Support Chat Interface - Design Specification

## Overview
AI-powered support chat interface for RetargetIQ's support team, built to integrate with GoHighLevel and utilize the 127 Q&A knowledge base.

---

## Recommended Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| UI Library | **reachat** | Purpose-built for LLM chat, Tailwind theming |
| Framework | React 18+ | Industry standard, GHL compatible |
| Styling | Tailwind CSS | Easy brand customization |
| Build | Vite | Fast dev, easy iframe embed |
| AI Backend | Claude 3.5 Sonnet | Already planned per project specs |

---

## Brand Colors (TO BE CONFIRMED)

**ACTION REQUIRED:** Get exact colors from retargetiq.com using browser DevTools

### Suggested Professional Palette (placeholder until confirmed):

```css
:root {
  /* Primary - Main brand color (likely blue/teal based on B2B SaaS norms) */
  --color-primary: #0066FF;        /* Adjust to match RetargetIQ */
  --color-primary-dark: #0052CC;
  --color-primary-light: #4D94FF;

  /* Secondary - Accent color */
  --color-secondary: #00C2B2;      /* Teal accent */

  /* Neutrals */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F7F9FC;
  --color-bg-chat: #F1F4F9;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;

  /* Functional */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;

  /* Chat-specific */
  --color-user-bubble: #0066FF;    /* Match primary */
  --color-ai-bubble: #FFFFFF;
  --color-user-text: #FFFFFF;
  --color-ai-text: #1A1A2E;
}
```

---

## Layout Options

### Option A: Companion Mode (Recommended for GHL)
- Floating chat widget in corner
- Expandable/collapsible
- Non-intrusive for main GHL workflow
- Best for: Support team multitasking

```
┌─────────────────────────────────────────┐
│           GoHighLevel Dashboard          │
│                                          │
│  [Main Content Area]                     │
│                                          │
│                                    ┌────┐│
│                                    │Chat││
│                                    │ UI ││
│                                    └────┘│
└─────────────────────────────────────────┘
```

### Option B: Console Mode
- Full-height sidebar or dedicated view
- Persistent visibility
- Best for: Dedicated support workflow

```
┌──────────────────────┬──────────────────┐
│                      │                  │
│  GoHighLevel         │   Chat Console   │
│  Dashboard           │                  │
│                      │   [Messages]     │
│                      │                  │
│                      │   [Input]        │
└──────────────────────┴──────────────────┘
```

---

## Component Structure

```
chat-interface/
├── src/
│   ├── components/
│   │   ├── ChatContainer.tsx      # Main wrapper
│   │   ├── MessageList.tsx        # Scrollable message area
│   │   ├── Message.tsx            # Individual message bubble
│   │   ├── ChatInput.tsx          # Input with send button
│   │   ├── Header.tsx             # RetargetIQ branding
│   │   ├── TypingIndicator.tsx    # AI thinking animation
│   │   └── SourcesPanel.tsx       # Show KB sources used
│   ├── hooks/
│   │   └── useChat.ts             # Chat state management
│   ├── styles/
│   │   └── theme.css              # Brand customizations
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── package.json
└── index.html
```

---

## UI Components Spec

### 1. Header
- RetargetIQ logo (left)
- "AI Support Assistant" label
- Minimize/close button (if companion mode)
- Clean, minimal height (~48-56px)

### 2. Message Bubbles

**User Messages:**
- Right-aligned
- Primary brand color background
- White text
- Rounded corners (16px)
- Max-width: 80%

**AI Messages:**
- Left-aligned
- White/light gray background
- Dark text
- Rounded corners (16px)
- Optional: Small AI avatar icon
- Show sources link when KB used

### 3. Input Area
- Full-width text input
- Placeholder: "Ask a question..."
- Send button (primary color)
- Optional: Keyboard shortcut hint (Cmd+Enter)
- Border-top separator

### 4. Typing Indicator
- Three-dot animation
- "AI is thinking..." text
- Subtle, non-distracting

### 5. Sources Panel (Optional)
- Collapsible section under AI response
- Shows which KB articles were used
- Builds trust with support team

---

## Interaction Design

### States
1. **Empty** - Welcome message, suggested questions
2. **Loading** - Typing indicator while AI responds
3. **Conversation** - Message history with scroll
4. **Error** - Friendly error with retry option

### Animations
- Messages: Fade + slide in (subtle, 200ms)
- Typing indicator: Pulsing dots
- Send button: Press feedback
- Panel expand/collapse: Smooth transition

### Keyboard Shortcuts
- `Enter` - Send message
- `Shift+Enter` - New line
- `Esc` - Minimize (companion mode)

---

## Mobile Responsiveness

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1024px) | Side panel or floating widget |
| Tablet (768-1024px) | Floating widget, adjustable size |
| Mobile (<768px) | Full-screen takeover when opened |

---

## Accessibility

- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus management on new messages
- [ ] High contrast mode support
- [ ] Screen reader announcements for new messages

---

## Integration Points

### GoHighLevel Embedding
```html
<!-- Iframe embed in GHL custom code -->
<iframe
  src="https://your-domain.com/retargetiq-chat"
  style="position: fixed; bottom: 20px; right: 20px;
         width: 380px; height: 600px; border: none;
         border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
></iframe>
```

### API Connection
- Endpoint: TBD (Claude API via backend proxy)
- Auth: Session-based for support team
- Knowledge base: 127 Q&A pairs in vector store

---

## Sample Conversation Flow

```
┌─────────────────────────────────────────┐
│ 🔵 RetargetIQ AI Support        [-][x] │
├─────────────────────────────────────────┤
│                                         │
│  Hi! I'm your AI support assistant.     │
│  How can I help you today?              │
│                                         │
│  Suggested questions:                   │
│  • How do I set up the tracking pixel?  │
│  • What's included in white-label?      │
│  • How does data enrichment work?       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│            ┌────────────────────────┐   │
│            │ Customer asking about  │   │
│            │ API rate limits        │   │
│            └────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ The API has a rate limit of 100   │ │
│  │ requests per minute. If you need  │ │
│  │ higher limits, the VIP Support    │ │
│  │ add-on ($297/mo) includes...      │ │
│  │                                   │ │
│  │ 📚 Sources: API & Technical (2)   │ │
│  └────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ Ask a question...              [Send] 📤│
└─────────────────────────────────────────┘
```

---

## Next Steps

1. [ ] **Get brand colors** - Extract from retargetiq.com
2. [ ] **Get logo assets** - Request from Nate/Alex
3. [ ] **Set up project** - `npm create vite` + reachat
4. [ ] **Build components** - Start with static mockup
5. [ ] **Add theming** - Apply brand colors
6. [ ] **Connect API** - Wire up Claude backend
7. [ ] **Test in GHL** - Iframe integration
8. [ ] **Gather feedback** - Iterate with support team

---

## Resources

- [reachat Documentation](https://reachat.dev/docs/getting-started/getting-started)
- [reachat GitHub](https://github.com/reaviz/reachat)
- [reachat Storybook](https://storybook.reachat.dev)
- [reachat Figma](https://www.figma.com/community/file/...) - Design files available
- [Tailwind CSS](https://tailwindcss.com/docs)

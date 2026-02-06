# CLAUDE.md - RetargetIQ Support Chat

## Active Codebase

The **v0.dev version** is now the root-level app. The old assistant-ui prototype has been archived to `archive/assistant-ui-version/`.

## Project Status

- **Deployed:** Yes (Vercel), but NOT shared with client yet
- **Blocked on:** Knowledge base (52 FAQs) needs client review/refinement before launch

## Architecture

- **Frontend:** Next.js 16 with React 19, Tailwind 4, dark theme
- **Backend:** n8n webhook (`POST /retargetiq-chat`) - separate from this repo
  - Uses OpenRouter with GPT-4o
  - All 52 FAQs embedded in the system prompt
  - Handles multi-turn conversation history
  - Returns `{ response: "..." }`
- **Knowledge Base:** `retarget-iq/knowledge-base/` contains the FAQ data
- **Database:** Supabase (schema in `retarget-iq/supabase-schema.sql`)

## Key Directories

- `app/` - Next.js app (page, layout, API route, styles)
- `components/chat/` - Chat UI components (message display, input)
- `components/ui/` - Shared UI primitives (button, textarea)
- `lib/` - Utilities (`cn()` class merge helper)
- `retarget-iq/` - Knowledge base, call transcripts, email templates, project docs
- `retarget-iq/n8n-chat-workflow.json` - The n8n workflow definition
- `archive/assistant-ui-version/` - Old assistant-ui prototype (kept for reference)
- `backup/` - Backup data

## Client Context

- **Client:** Retarget IQ (Nate Calhoun & Alex Ciereszko)
- **What this is:** Internal support tool for their team (Cindy, Matt, new hires) to paste customer emails and get AI-drafted responses
- **Recently acquired**, revenue doubled to $59K MRR, team is extremely busy
- **Waiting on:** Client to review/validate the 52 FAQ knowledge base, then we launch

## Voice & Style (for AI responses)

- Casual, direct ("Ya, totally!" not "I'd be happy to assist you")
- Hyphens not em-dashes
- Short paragraphs (2-5 max)
- Closings like "Let me know!" or "Happy to walk you through it!"
- If answer not in KB: "Great question! Let me check with the team on that and get back to you."

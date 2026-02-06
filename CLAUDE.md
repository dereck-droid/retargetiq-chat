# CLAUDE.md - RetargetIQ Support Chat

## Active Codebase

The **v0.dev version** (`v0.dev/ai-chat-interface/`) is the approved client-facing design. The root-level assistant-ui code is an earlier prototype that was NOT selected. The v0.dev code needs to be promoted to root and the old code archived or removed.

## Project Status

- **Deployed:** Yes (Vercel), but NOT shared with client yet
- **Blocked on:** Knowledge base (52 FAQs) needs client review/refinement before launch
- **Both builds are fully functional** and connected to the n8n backend

## Architecture

- **Frontend:** Next.js (v0.dev build) with React, Tailwind, theme support (light/dark/blue-gray)
- **Backend:** n8n webhook (`POST /retargetiq-chat`) - separate from this repo
  - Uses OpenRouter with GPT-4o
  - All 52 FAQs embedded in the system prompt
  - Handles multi-turn conversation history
  - Returns `{ response: "..." }`
- **Knowledge Base:** `retarget-iq/knowledge-base/` contains the FAQ data
- **Database:** Supabase (schema in `retarget-iq/supabase-schema.sql`)

## Key Directories

- `v0.dev/ai-chat-interface/` - ACTIVE codebase (promote this to root)
- `retarget-iq/` - Knowledge base, call transcripts, email templates, project docs
- `retarget-iq/n8n-chat-workflow.json` - The n8n workflow definition
- `app/`, `components/`, `hooks/`, `lib/` (root level) - OLD assistant-ui version (archive/remove)
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

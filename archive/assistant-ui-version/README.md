# Assistant UI Version (Archived)

This directory contains the old assistant-ui based chat interface that was NOT selected by the client.

The client chose the v0.dev version (simpler, custom chat UI) which is now the main app at root level.

## What's here

- `app/assistant.tsx` - The assistant-ui wrapper component
- `components/assistant-ui/` - All assistant-ui specific components (thread, attachments, reasoning, etc.)
- `components/ui/` - Shadcn UI components that were only used by the assistant-ui version
- `hooks/use-mobile.ts` - Mobile detection hook
- `package.json` - Snapshot of dependencies (includes @assistant-ui/* packages)

## Why archived

Both versions were built and deployed. The client (Nate & Alex at Retarget IQ) reviewed both and selected the v0.dev version for its simpler, more focused design. This code is kept for reference; full history is also in git.

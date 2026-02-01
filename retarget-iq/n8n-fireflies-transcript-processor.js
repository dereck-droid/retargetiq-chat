/**
 * n8n Code Node: Fireflies Transcript Processor
 *
 * Purpose: Processes Fireflies API webhook data and formats transcripts for GitHub storage
 *
 * Usage:
 * 1. Create n8n workflow with Fireflies webhook trigger
 * 2. Add this as a Code node after the webhook
 * 3. Set node to "Run Once for All Items" in settings
 * 4. Connect output to GitHub node for file creation
 *
 * Input: Fireflies webhook data (supports batch processing)
 * Output: Array of formatted transcript objects ready for GitHub
 */

const items = $input.all();
const outputs = [];

items.forEach((item) => {
  const webhookData = item.json;

  // Extract meeting metadata
  const title = webhookData.data.title || 'Untitled Meeting';
  const attendees = webhookData.data.attendees || [];

  // Format date properly (convert Unix timestamp to readable date)
  const rawDate = webhookData.data.date || Date.now();
  const meetingDate = new Date(rawDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate duration in minutes
  const durationSeconds = webhookData.data.duration || 0;
  const duration = (durationSeconds / 60).toFixed(2);

  // Extract participant names and emails
  const participants = attendees.map(a => a.displayName).join(', ') || 'Unknown';
  const emails = attendees.map(a => a.email).filter(e => e) || [];

  // Build structured transcript with speaker changes
  const sentences = webhookData.data.sentences || [];
  let formattedTranscript = '';
  let lastSpeaker = null;

  sentences.forEach((sentence) => {
    const currentSpeaker = sentence.speaker_name || 'Unknown Speaker';

    // Add blank line between different speakers for readability
    if (lastSpeaker && lastSpeaker !== currentSpeaker) {
      formattedTranscript += '\n';
    }

    formattedTranscript += `**${currentSpeaker}:** ${sentence.text}\n`;
    lastSpeaker = currentSpeaker;
  });

  // Create clean filename (sanitize title for filesystem)
  const cleanTitle = title
    .replace(/[^a-z0-9]/gi, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
    .toLowerCase();

  const filename = `${cleanTitle}.md`;

  // Build complete markdown transcript
  const markdownTranscript = `# ${title}

**Date:** ${meetingDate}
**Duration:** ${duration} minutes
**Participants:** ${participants}
**Attendee Emails:** ${emails.join(', ')}

---

## Transcript

${formattedTranscript}`;

  // Prepare output for GitHub node
  outputs.push({
    json: {
      filename: filename,
      filepath: `retarget-iq/call-transcripts/${filename}`,
      content: markdownTranscript,
      title: title,
      date: meetingDate,
      duration: duration,
      participants: participants,
      transcript_id: webhookData.data.id || null
    }
  });
});

return outputs;

/**
 * CONFIGURATION NOTES:
 *
 * n8n Node Settings:
 * - Mode: "Run Once for All Items"
 * - Language: JavaScript
 *
 * Expected Fireflies Webhook Structure:
 * {
 *   "data": {
 *     "id": "transcript-id",
 *     "title": "Meeting Title",
 *     "date": 1706745600000,  // Unix timestamp
 *     "duration": 2632,        // Seconds
 *     "attendees": [
 *       { "displayName": "John Doe", "email": "john@example.com" }
 *     ],
 *     "sentences": [
 *       { "speaker_name": "John Doe", "text": "Hello everyone..." }
 *     ]
 *   }
 * }
 *
 * Output Structure (for GitHub node):
 * {
 *   "filename": "meeting-title.md",
 *   "filepath": "retarget-iq/call-transcripts/meeting-title.md",
 *   "content": "# Meeting Title\n\n**Date:** January 31, 2026...",
 *   "title": "Meeting Title",
 *   "date": "January 31, 2026",
 *   "duration": "43.87",
 *   "participants": "John Doe, Jane Smith",
 *   "transcript_id": "fireflies-abc123"
 * }
 *
 * TROUBLESHOOTING:
 *
 * Issue: "Cannot read property 'json' of undefined"
 * Fix: Ensure node is set to "Run Once for All Items"
 *
 * Issue: Nested "Business/Business/" paths in GitHub
 * Fix: Use exact filepath shown above (no leading slash, no Business/ prefix)
 *
 * Issue: Files missing .md extension
 * Fix: Ensure filename includes `.md` as shown in code
 *
 * Issue: Date shows as Unix timestamp
 * Fix: Use toLocaleDateString() as shown above
 *
 * PERFORMANCE:
 * - Processes 20-30 transcripts in ~5-10 seconds
 * - No API rate limits (local processing)
 * - Safe for batch processing 50+ transcripts
 *
 * FUTURE ENHANCEMENTS:
 * - Add topic extraction from transcript
 * - Generate summary/key points
 * - Extract action items
 * - Categorize by meeting type (sales, support, etc.)
 */

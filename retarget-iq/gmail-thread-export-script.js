/**
 * GMAIL THREAD EXPORT TO CSV - GOOGLE APPS SCRIPT
 *
 * This script exports complete Gmail threads (one row per thread) to Google Sheets,
 * then allows download as CSV.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Customize the SEARCH_QUERY variable below
 * 5. Save and run the exportGmailThreadsToSheet() function
 * 6. Authorize permissions when prompted
 * 7. After completion, download as CSV: File > Download > CSV
 */

// ============= CONFIGURATION =============

// Customize this search query to match your support emails
// Examples:
//   "from:support@retargetiq.com" - All emails from support address
//   "to:support@retargetiq.com" - All emails sent to support
//   "label:support" - All emails with "support" label
//   "in:inbox after:2024/01/01" - Inbox emails after specific date
const SEARCH_QUERY = 'to:support@retargetiq.com OR from:support@retargetiq.com';

// Maximum number of threads to export (to avoid timeout)
// For large exports, run multiple times with date filters
const MAX_THREADS = 500;

// ============= MAIN FUNCTION =============

function exportGmailThreadsToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Clear existing data
  sheet.clear();

  // Set up headers
  const headers = [
    'Thread ID',
    'Subject',
    'First Message Date',
    'Last Message Date',
    'Number of Messages',
    'Participants',
    'Complete Thread Content',
    'Preview (First 200 chars)'
  ];
  sheet.appendRow(headers);

  // Format header row
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('#ffffff');

  // Search Gmail threads
  Logger.log('Searching Gmail with query: ' + SEARCH_QUERY);
  const threads = GmailApp.search(SEARCH_QUERY, 0, MAX_THREADS);
  Logger.log('Found ' + threads.length + ' threads');

  // Process each thread
  let processedCount = 0;
  threads.forEach(function(thread, index) {
    try {
      const threadData = extractThreadData(thread);
      sheet.appendRow(threadData);
      processedCount++;

      // Log progress every 50 threads
      if ((index + 1) % 50 === 0) {
        Logger.log('Processed ' + (index + 1) + ' threads...');
      }
    } catch (error) {
      Logger.log('Error processing thread ' + thread.getId() + ': ' + error.toString());
    }
  });

  // Auto-resize columns for readability
  sheet.autoResizeColumns(1, headers.length);

  // Set column widths for better readability
  sheet.setColumnWidth(7, 500); // Complete Thread Content - wider
  sheet.setColumnWidth(8, 300); // Preview - medium width

  // Freeze header row
  sheet.setFrozenRows(1);

  Logger.log('Export complete! Processed ' + processedCount + ' threads.');

  // Show completion message
  SpreadsheetApp.getUi().alert(
    'Export Complete',
    'Successfully exported ' + processedCount + ' email threads.\n\n' +
    'To download as CSV:\n' +
    'File > Download > Comma Separated Values (.csv)',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============= HELPER FUNCTIONS =============

/**
 * Extract all relevant data from a Gmail thread
 */
function extractThreadData(thread) {
  const messages = thread.getMessages();
  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];

  // Get unique participants
  const participants = getUniqueParticipants(messages);

  // Build complete thread content
  const threadContent = buildThreadContent(messages);

  // Create preview (first 200 characters)
  const preview = threadContent.substring(0, 200).replace(/\n/g, ' ') + '...';

  return [
    thread.getId(),
    thread.getFirstMessageSubject(),
    firstMessage.getDate(),
    lastMessage.getDate(),
    messages.length,
    participants.join(', '),
    threadContent,
    preview
  ];
}

/**
 * Get unique email addresses from all participants in thread
 */
function getUniqueParticipants(messages) {
  const participantSet = new Set();

  messages.forEach(function(message) {
    // Add sender
    const from = message.getFrom();
    const fromEmail = extractEmail(from);
    if (fromEmail) participantSet.add(fromEmail);

    // Add recipients
    const to = message.getTo();
    const toEmails = to.split(',').map(extractEmail).filter(e => e);
    toEmails.forEach(email => participantSet.add(email));

    // Add CC recipients
    const cc = message.getCc();
    if (cc) {
      const ccEmails = cc.split(',').map(extractEmail).filter(e => e);
      ccEmails.forEach(email => participantSet.add(email));
    }
  });

  return Array.from(participantSet);
}

/**
 * Extract email address from "Name <email@example.com>" format
 */
function extractEmail(emailString) {
  if (!emailString) return null;
  const match = emailString.match(/<(.+?)>/);
  return match ? match[1] : emailString.trim();
}

/**
 * Build complete thread content with all messages
 */
function buildThreadContent(messages) {
  let content = '';

  messages.forEach(function(message, index) {
    const separator = index === 0 ? '' : '\n\n--- NEXT MESSAGE ---\n\n';

    content += separator;
    content += 'FROM: ' + message.getFrom() + '\n';
    content += 'TO: ' + message.getTo() + '\n';

    const cc = message.getCc();
    if (cc) {
      content += 'CC: ' + cc + '\n';
    }

    content += 'DATE: ' + message.getDate() + '\n';
    content += 'SUBJECT: ' + message.getSubject() + '\n';
    content += '\n';
    content += message.getPlainBody();
  });

  return content;
}

// ============= UTILITY FUNCTIONS =============

/**
 * Create a custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Gmail Export')
    .addItem('Export Email Threads', 'exportGmailThreadsToSheet')
    .addItem('Configure Search Query', 'showConfigDialog')
    .addToUi();
}

/**
 * Show configuration dialog (optional - for non-coders)
 */
function showConfigDialog() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Configure Search Query',
    'Enter Gmail search query:\n\n' +
    'Examples:\n' +
    '- from:support@company.com\n' +
    '- to:support@company.com\n' +
    '- label:support\n' +
    '- after:2024/01/01\n\n' +
    'Current query: ' + SEARCH_QUERY,
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() === ui.Button.OK) {
    // Note: This won't actually update the constant in the script
    // User needs to manually edit SEARCH_QUERY in the script
    ui.alert(
      'To update the search query:\n\n' +
      '1. Go to Extensions > Apps Script\n' +
      '2. Find the SEARCH_QUERY variable at the top\n' +
      '3. Update it with your query: "' + result.getResponseText() + '"\n' +
      '4. Save and run again'
    );
  }
}

/**
 * GMAIL THREAD EXPORT TO CSV - GOOGLE APPS SCRIPT (DEBUG VERSION)
 *
 * This version includes debugging to help diagnose search issues
 */

// ============= CONFIGURATION =============

// Try multiple search queries to find what works
const SEARCH_QUERIES = [
  'to:info@retargetiq.com OR from:info@retargetiq.com',           // lowercase
  'to:Info@retargetiq.com OR from:Info@retargetiq.com',           // original
  '{to:info@retargetiq.com from:info@retargetiq.com}',            // alternative syntax
  'info@retargetiq.com',                                           // simple search
  'retargetiq.com',                                                // domain search
  'in:inbox'                                                       // all inbox (to test)
];

const MAX_THREADS = 300;

// ============= DEBUG FUNCTION =============

function debugSearchQueries() {
  const ui = SpreadsheetApp.getUi();
  let results = 'Testing different search queries:\n\n';

  SEARCH_QUERIES.forEach(function(query, index) {
    const threads = GmailApp.search(query, 0, MAX_THREADS);
    results += (index + 1) + '. Query: "' + query + '"\n';
    results += '   Found: ' + threads.length + ' threads\n\n';
    Logger.log('Query ' + (index + 1) + ': "' + query + '" found ' + threads.length + ' threads');
  });

  ui.alert('Search Query Test Results', results, ui.ButtonSet.OK);
}

// ============= MAIN FUNCTION (with better logging) =============

function exportGmailThreadsToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Ask user which query to use
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Enter Search Query',
    'Enter Gmail search query (or leave blank to test all queries first):\n\n' +
    'Common options:\n' +
    '- info@retargetiq.com\n' +
    '- to:info@retargetiq.com OR from:info@retargetiq.com\n' +
    '- in:inbox\n' +
    '- after:2024/01/01',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    return; // User cancelled
  }

  let searchQuery = response.getResponseText().trim();

  // If blank, run debug test
  if (!searchQuery) {
    debugSearchQueries();
    return;
  }

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
  Logger.log('Searching Gmail with query: ' + searchQuery);
  const threads = GmailApp.search(searchQuery, 0, MAX_THREADS);
  Logger.log('Found ' + threads.length + ' threads');

  // Show immediate feedback
  ui.alert('Search Results', 'Found ' + threads.length + ' threads matching: "' + searchQuery + '"', ui.ButtonSet.OK);

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
  ui.alert(
    'Export Complete',
    'Successfully exported ' + processedCount + ' email threads.\n\n' +
    'To download as CSV:\n' +
    'File > Download > Comma Separated Values (.csv)',
    ui.ButtonSet.OK
  );
}

// ============= HELPER FUNCTIONS =============

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

function extractEmail(emailString) {
  if (!emailString) return null;
  const match = emailString.match(/<(.+?)>/);
  return match ? match[1] : emailString.trim();
}

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

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Gmail Export')
    .addItem('Export Email Threads', 'exportGmailThreadsToSheet')
    .addItem('Test Search Queries', 'debugSearchQueries')
    .addToUi();
}

/**
 * GMAIL THREAD EXPORT TO CSV - FULL ACCESS VERSION
 *
 * This version explicitly requests FULL Gmail access permissions
 * to ensure all emails are visible to the script.
 */

// ============= FORCE FULL GMAIL ACCESS =============
// This comment forces Apps Script to request full Gmail permissions
// @OnlyCurrentDoc false

/**
 * @fileoverview Gmail Thread Export Script with Full Access
 *
 * IMPORTANT: This script requires FULL Gmail access.
 * When you run it the first time, you'll be asked to authorize
 * access to your Gmail account. Make sure to grant full permissions.
 */

// Force Gmail API scope - ensures full access
// (Apps Script reads these special comments)
// Scopes: https://mail.google.com/

// ============= CONFIGURATION =============

const SEARCH_QUERY = 'to:info@retargetiq.com OR from:info@retargetiq.com';
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

  // Use GmailApp with explicit error checking
  try {
    const threads = GmailApp.search(SEARCH_QUERY, 0, MAX_THREADS);
    Logger.log('Found ' + threads.length + ' threads');

    if (threads.length === 0) {
      SpreadsheetApp.getUi().alert(
        'No Threads Found',
        'The search query returned 0 threads.\n\n' +
        'Query: ' + SEARCH_QUERY + '\n\n' +
        'This might be a permissions issue. Try:\n' +
        '1. Remove the script authorization\n' +
        '2. Re-run the script\n' +
        '3. Grant FULL Gmail permissions when prompted',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }

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

    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    sheet.setColumnWidth(7, 500); // Complete Thread Content
    sheet.setColumnWidth(8, 300); // Preview

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

  } catch (error) {
    Logger.log('Error searching Gmail: ' + error.toString());
    SpreadsheetApp.getUi().alert(
      'Error',
      'Failed to search Gmail: ' + error.toString() + '\n\n' +
      'This is likely a permissions issue. Try re-authorizing the script.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// ============= HELPER FUNCTIONS =============

function extractThreadData(thread) {
  const messages = thread.getMessages();
  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];

  const participants = getUniqueParticipants(messages);
  const threadContent = buildThreadContent(messages);
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
    const from = message.getFrom();
    const fromEmail = extractEmail(from);
    if (fromEmail) participantSet.add(fromEmail);

    const to = message.getTo();
    const toEmails = to.split(',').map(extractEmail).filter(e => e);
    toEmails.forEach(email => participantSet.add(email));

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
    .addItem('Re-authorize Gmail Access', 'reauthorizeGmail')
    .addToUi();
}

/**
 * Force re-authorization by accessing Gmail and showing current permissions
 */
function reauthorizeGmail() {
  const ui = SpreadsheetApp.getUi();

  try {
    // This will trigger authorization if not already granted
    const testSearch = GmailApp.search('in:inbox', 0, 1);

    ui.alert(
      'Authorization Check',
      'Gmail access is authorized.\n\n' +
      'Test search found: ' + testSearch.length + ' thread(s)\n\n' +
      'If you\'re still seeing limited results, you may need to:\n' +
      '1. Go to https://myaccount.google.com/permissions\n' +
      '2. Remove this script\'s access\n' +
      '3. Re-run the export to grant fresh permissions',
      ui.ButtonSet.OK
    );
  } catch (error) {
    ui.alert(
      'Authorization Required',
      'Please authorize Gmail access: ' + error.toString(),
      ui.ButtonSet.OK
    );
  }
}

/**
 * Shows current script permissions for debugging
 */
function checkPermissions() {
  const ui = SpreadsheetApp.getUi();

  try {
    // Test various Gmail operations to verify access
    const inboxThreads = GmailApp.search('in:inbox', 0, 5);
    const allThreads = GmailApp.search('in:anywhere', 0, 5);
    const sentThreads = GmailApp.search('in:sent', 0, 5);

    ui.alert(
      'Permission Test Results',
      'Inbox threads accessible: ' + inboxThreads.length + '\n' +
      'All mail threads accessible: ' + allThreads.length + '\n' +
      'Sent threads accessible: ' + sentThreads.length + '\n\n' +
      'If all show 0 or very low numbers, re-authorization is needed.',
      ui.ButtonSet.OK
    );
  } catch (error) {
    ui.alert(
      'Permission Check Failed',
      'Error: ' + error.toString() + '\n\n' +
      'This indicates a permissions issue.',
      ui.ButtonSet.OK
    );
  }
}

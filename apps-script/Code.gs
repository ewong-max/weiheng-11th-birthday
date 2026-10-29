/**
 * Wei Heng's 11th Birthday - RSVP receiver
 * Paste into the RSVP sheet: Extensions > Apps Script, replace everything, Save,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Copy the /exec URL into RSVP_URL in index.html.
 */
const SHEET_ID = '1D8T4xqiAfwP3i1pynO1Ix5GShkS0j7vlY9bKJlwegbY';
const TAB = 'RSVP';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    const clean = v => String(v || '').slice(0, 500).replace(/^[=+\-@]/, "'$&"); // stop formula injection
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
    sheet.appendRow([
      new Date(),
      clean(p.friend),
      p.attending === 'No' ? 'No' : 'Yes',
      clean(p.allergies),
      clean(p.message)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Wei Heng RSVP endpoint is running.');
}

/**
 * Code.gs — deploy this in Adri's own Google account
 *
 * SETUP:
 * 1. Go to sheets.google.com (in Adri's account) and create a new spreadsheet, e.g. "Adri Tracker Data"
 * 2. In the sheet: Extensions > Apps Script
 * 3. Delete any starter code and paste this file's contents in
 * 4. Click Deploy > New deployment > type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web app URL it gives you — paste that into the app's Settings > Apps Script Web App URL
 */

const SHEET_NAME = "TrackerData";

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp", "data_json"]);
  }
  return sheet;
}

function doPost(e) {
  const sheet = getSheet();
  const body = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date().toISOString(), JSON.stringify(body.data)]);

  // Keep only the most recent 50 snapshots to avoid unbounded growth
  const numRows = sheet.getLastRow();
  if (numRows > 51) {
    sheet.deleteRows(2, numRows - 51);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = getSheet();
  const numRows = sheet.getLastRow();
  if (numRows < 2) {
    return ContentService.createTextOutput(JSON.stringify({ data: {} }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const lastRow = sheet.getRange(numRows, 1, 1, 2).getValues()[0];
  const data = JSON.parse(lastRow[1]);
  return ContentService.createTextOutput(JSON.stringify({ data }))
    .setMimeType(ContentService.MimeType.JSON);
}


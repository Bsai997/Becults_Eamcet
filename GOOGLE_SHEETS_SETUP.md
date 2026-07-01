# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up Google Sheets integration for the EAMCET College Prediction Platform to save student data to your existing Google Sheet.

## Your Google Sheet
- **Spreadsheet ID:** `1DoM_qUUa4PwjYfUr1T2YZok4GUqNYF188WXBtfTzyto`
- **Sheet URL:** https://docs.google.com/spreadsheets/d/1DoM_qUUa4PwjYfUr1T2YZok4GUqNYF188WXBtfTzyto/edit
- **Existing Columns:** Name, Mobile No, Rank

## Prerequisites
- Google Account
- Access to the shared Google Sheet
- Google Apps Script (built into Google Sheets)

## Step-by-Step Setup

### 1. Add New Columns to Your Sheet (Optional)
Your sheet already has: **Name**, **Mobile No**, **Rank**

Optionally add these columns for complete data:
- Column D: Category
- Column E: Gender
- Column F: Total Colleges
- Column G: Timestamp

### 2. Create a Google Apps Script Web App
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1DoM_qUUa4PwjYfUr1T2YZok4GUqNYF188WXBtfTzyto/edit
2. Click **Tools > Script editor** (or **Extensions > Apps Script** if Tools is not available)
3. A new tab will open with Google Apps Script editor
4. Delete all default code and replace with the following:

```javascript
function doPost(e) {
  try {
    // Parse the request payload
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet and active sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Sheet1"); // Change if your sheet has a different name
    
    if (!sheet) {
      throw new Error("Sheet1 not found. Please rename your sheet to 'Sheet1' or update the script.");
    }
    
    // Prepare the row data - Only Name, Mobile No, and Rank
    const rowData = [
      data.name || '',              // Column A: Name
      data.mobileNo || '',          // Column B: Mobile No
      data.rank || ''               // Column C: Rank
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Log the entry
    Logger.log("Data saved: " + JSON.stringify(data));
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Data saved successfully to Google Sheet"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function
function testFunction() {
  const testData = {
    name: "Test User",
    mobileNo: "9876543210",
    rank: "5000"
  };
  
  doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log("Test data sent!");
}
```

5. Click **Save** (give it a name like "CollegePredictionHandler")
6. Now you need to **Deploy as Web App:**
   - Click on the **Deploy** button (top right)
   - Select **New deployment**
   - In the dialog:
     - Click the gear icon and select **Web app**
     - **Execute as:** Select your Google Account
     - **Who has access:** Select **"Anyone"** (important!)
     - Click **Deploy**
   
7. **Copy the Web App URL** that appears (looks like: `https://script.google.com/macros/d/{scriptId}/userweb`)

### 3. Add Your Google Apps Script URL to Backend Environment

1. Open your backend `.env` file (or create one if it doesn't exist)
2. Add this line:
   ```
   GOOGLE_SHEET_WEB_APP_URL=<paste-your-web-app-url-here>
   ```
   Example:
   ```
   GOOGLE_SHEET_WEB_APP_URL=https://script.google.com/macros/d/AKfycbwXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/userweb
   ```

3. Save the `.env` file
4. Restart your backend server

### 4. Update Your Google Sheet Structure (Important!)

Ensure your Google Sheet has these columns in order:
| Column A | Column B | Column C |
|----------|----------|----------|
| Name | Mobile No | Rank |

**That's it!** Only these 3 columns are needed.

### 5. Test the Integration

1. Start your backend server
2. Open the frontend app
3. Search for colleges by entering rank, category, and gender
4. Click **"Download as PDF"** button
5. Fill in:
   - **Full Name**
   - **Mobile Number** (10 digits)
6. Click **"Download PDF"**
7. Check your Google Sheet - a new row should appear with the data

## Important Notes

- The Web App URL must be from the **latest deployment**
- Access must be set to **"Anyone"** for the script to work
- The sheet name in the script is set to **"Sheet1"** - if your sheet has a different name, update it in line: `sheet = spreadsheet.getSheetByName("YOUR_SHEET_NAME")`
- The order of columns in the script must match your Google Sheet's column order

## Troubleshooting

### No data appears in Google Sheet?
- Check if the Web App URL in `.env` is correct
- Verify the deployment is set to "Anyone"
- Check browser console (F12) for error messages
- Check backend logs for errors

### Script error: "Sheet1 not found"
- Your sheet might have a different name
- Right-click the sheet tab and note the exact name
- Update line 7 in the script: `const sheet = spreadsheet.getSheetByName("YOUR_ACTUAL_SHEET_NAME");`
- Redeploy the script

### 403 Forbidden Error
- Make sure the Web App deployment has:
  - **Execute as:** Your Google Account
  - **Who has access:** Anyone
- Redeploy if needed

### 500 Server Error
- Check if `.env` has `GOOGLE_SHEET_WEB_APP_URL` configured
- Verify the URL is correct and starts with `https://script.google.com`
- Check backend console for error messages

## Re-deploying the Script

If you make changes to the script:
1. Click **Deploy** button
2. Select **Manage deployments** (gear icon)
3. Delete the old deployment
4. Click **Create new deployment**
5. Copy the new URL
6. Update the `.env` file with the new URL
7. Restart the backend server

## Viewing Script Logs

To see what data was received by the script:
1. In Apps Script editor, click **Executions** (left sidebar)
2. You'll see all runs of the script
3. Click on a run to see logs and any errors

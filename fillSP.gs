function fillSPAlert() {
  const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR_WEBHOOK_URL"; // Replace with your actual Slack Webhook URL

  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sprint_stats");
    const range = sheet.getRange("AS82:AS87").getValues();

    const shouldSend = range[0][0]; // AS82
    const message = range[5][0]; // AS87

    Logger.log("Sheet: sprint_stats");
    Logger.log("AS82 value (shouldSend): " + shouldSend);
    Logger.log("Slack message: " + message);

    if (shouldSend === true || shouldSend === "TRUE") {
      Logger.log("Condition met. Sending Slack message...");

      const payload = JSON.stringify({ text: message });
      const options = {
        method: "post",
        contentType: "application/json",
        payload: payload,
        muteHttpExceptions: true,
      };

      const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
      Logger.log("Slack response code: " + response.getResponseCode());
      Logger.log("Slack response body: " + response.getContentText());
    } else {
      Logger.log("Condition not met. No message sent.");
    }
  } catch (error) {
    Logger.log("Script failed: " + error.message);
  }
}

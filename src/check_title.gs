function sendClickUpErrorsToSlack() {
  var webhookUrl = "YOUR_SLACK_WEBHOOK_URL"; // ⬅️ Replace with your actual webhook URL

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shouldSend = ss.getRangeByName("formatting_alert_boolean").getValue();
  var currentMessage = ss.getRangeByName("formatting_alert_msg").getValue();
  var lastSentMessageCell = ss.getSheetByName("sprint_stats").getRange("AS59"); // 🗃️ Cell to store last message
  var lastSentMessage = lastSentMessageCell.getValue();

  if (shouldSend === true) {
    if (currentMessage === lastSentMessage) {
      Logger.log("⏹️ Message not sent: same content as last time.");
      return;
    }

    var payload = {
      channel: "#YOUR_CHANNEL", // ⬅️ Replace with your actual Slack channel
      username: "YOUR_USERNAME", // ⬅️ Optional: Replace with your desired bot name
      icon_url: "YOUR_ICON_URL", // ⬅️ Optional: Replace with the URL of your desired icon
      text: currentMessage,
      mrkdwn: true,
    };

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    };

    UrlFetchApp.fetch(webhookUrl, options);

    lastSentMessageCell.setValue(currentMessage); // ✅ Update stored message after sending
    Logger.log("✅ Slack message sent and saved.");
  } else {
    Logger.log(
      "🔹 ClickUp Errors not sent: formatting_alert_boolean is FALSE."
    );
  }
}

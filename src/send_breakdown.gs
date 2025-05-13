function sendSprintBreakdownToSlack() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shouldSend = ss.getRangeByName("sprint_breakdown_boolean").getValue();

  if (shouldSend === true) {
    // 🔹 Retrieve the Sprint Breakdown message
    var sprintMessage = ss.getRangeByName("sprint_breakdown_msg").getValue();

    var webhookUrl = "YOUR_SLACK_WEBHOOK_URL"; // ⬅️ Replace with your actual webhook URL

    var payload = {
      channel: "#YOUR_CHANNEL", // ⬅️ Replace with your actual Slack channel
      icon_url: "YOUR_ICON_URL", // ⬅️ Optional: Replace with the URL of your desired icon
      text: sprintMessage,
      mrkdwn: true,
    };

    // 🔹 Configure HTTP Request Options
    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    };

    // 🔹 Send the Message to Slack
    UrlFetchApp.fetch(webhookUrl, options);
  } else {
    Logger.log(
      "🔹 Sprint Breakdown not sent: sprint_breakdown_boolean is FALSE."
    );
  }
}

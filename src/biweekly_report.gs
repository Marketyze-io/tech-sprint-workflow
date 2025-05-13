function Sprint_postToslack() {
  // Bi-weekly Sprint Report Slack Notification
  var webhookUrl = "YOUR_SLACK_WEBHOOK_URL"; // Replace with your actual webhook URL
  var ss = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID"); // Replace with your actual Google Sheets ID
  var sheet = ss.getSheetByName("toslack_1");
  var calendar_sheet = ss.getSheetByName("Sprint");
  var date_send_to_slack = calendar_sheet.getRange(2, 5).getValue();

  if (date_send_to_slack === true) {
    var allchannel_channel = sheet.getRange(2, 1).getValue();

    var allchannel_payload = {
      channel: "#YOUR_CHANNEL", // Replace with your actual Slack channel
      icon_url: "YOUR_ICON_URL", // Optional: Replace with the URL of your desired icon
      attachments: [
        {
          pretext:
            "Hello <!channel>! - *Bi-weekly Tech Sprint Planning updates*",
          text: allchannel_channel,
          color: "#6361D1",
          mrkdwn_in: ["text"],
        },
      ],
    };

    var allchannel_options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(allchannel_payload),
    };

    return UrlFetchApp.fetch(webhookUrl, allchannel_options);
  } else {
    return;
  }
}

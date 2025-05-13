function doPost(e) {
  try {
    // Log the raw incoming request body for debugging
    Logger.log("Incoming data: " + e.postData.contents);

    // Open or create the 'ClickupDataStructure' sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("ClickupDataStructure");

    // If the sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet("ClickupDataStructure");
      sheet.appendRow([
        "Timestamp",
        "Event",
        "Task ID",
        "Before Name",
        "After Name",
        "Webhook ID",
      ]); // Add headers
    }

    // Check content type
    var contentType = e.postData.type; // Get the content type

    // Handle JSON data (ClickUp Webhook)
    if (contentType === "application/json") {
      var data = JSON.parse(e.postData.contents); // Convert the incoming JSON data to a JavaScript object

      var event = data.event;
      var taskId = data.task_id;
      var webhookId = data.webhook_id;
      var beforeName = "";
      var afterName = "";

      if (event != null) {
        // Handle 'taskUpdated' event
        if (
          event === "taskUpdated" &&
          data.history_items &&
          data.history_items.length > 0
        ) {
          var historyItem = data.history_items[0]; // Assuming we're working with the first history item
          if (historyItem.field === "name") {
            beforeName = historyItem.before; // Before name
            afterName = historyItem.after; // After name
          }
        }

        // Handle 'taskCreated' event and fetch task name using ClickUp API
        if (event === "taskCreated") {
          var taskApiUrl = "https://api.clickup.com/api/v2/task/" + taskId;
          var options = {
            method: "get",
            headers: {
              Authorization: "YOUR_CLICKUP_API_KEY", // Replace with your ClickUp API token securely
            },
          };

          // Fetch the task details from ClickUp
          var response = UrlFetchApp.fetch(taskApiUrl, options);
          var taskData = JSON.parse(response.getContentText());

          // Extract the task name from the response
          if (taskData && taskData.name) {
            afterName = taskData.name; // Extract the task name from the task data
          }
        }

        // Log to sheet
        sheet.appendRow([
          new Date(),
          event,
          taskId,
          beforeName,
          afterName,
          webhookId,
        ]);

        // Call the function to handle webhook messages for Slack
        handleClickUpWebhook(event, taskId, beforeName, afterName);
      }
    }
    // Handle URL-encoded data (Slack Webhook)
    else if (contentType === "application/x-www-form-urlencoded") {
      // Parse URL-encoded payload from Slack
      var params = {};
      var queryString = e.postData.contents; // Get the raw data sent from Slack
      var queryParams = queryString.split("&");

      // Manually parse each parameter
      queryParams.forEach(function (param) {
        var keyValue = param.split("=");
        params[decodeURIComponent(keyValue[0])] = decodeURIComponent(
          keyValue[1] || ""
        );
      });

      // Handle Slack Webhook
      if (params.command) {
        handleSlackWebhook(params); // Pass parsed parameters to handle Slack webhook
      } else {
        Logger.log("Error: Slack payload does not contain 'command'.");
        return ContentService.createTextOutput(
          "❌ Error: Missing 'command' data in Slack webhook"
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }
  } catch (error) {
    Logger.log("🚨 Error in doPost: " + error.message);
    return ContentService.createTextOutput("❌ *Error:* " + error.message);
  }
}

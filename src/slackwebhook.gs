/**
 * Handles Slack webhook data.
 */
function handleSlackWebhook(e) {
  var slackCommand = e.command;
  var slackUserId = e.user_id;
  var responseUrl = e.response_url;

  // Ensure that the necessary parameters are present
  if (!slackCommand || !slackUserId || !responseUrl) {
    Logger.log("Error: Missing required Slack parameters.");
    return ContentService.createTextOutput(
      JSON.stringify({ error: "❌ Missing required parameters." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("sprint_stats");

  // Check if the sheet exists
  if (!sheet) {
    Logger.log("Error: 'sprint_stats' sheet not found.");
    return ContentService.createTextOutput(
      JSON.stringify({ error: "❌ 'sprint_stats' sheet not found." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Handle `/fetch-clickup-tasks` Command
  if (slackCommand === "/fetch-clickup-tasks") {
    return handleFetchClickUpTasks(responseUrl);
  }

  // Handle `/sprint-status`, `/sprint-breakdown`, `/sprint-tasks`
  if (
    ["/sprint-status", "/sprint-breakdown", "/sprint-tasks"].includes(
      slackCommand
    )
  ) {
    // Acknowledge the request to prevent timeout
    UrlFetchApp.fetch(responseUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        response_type: "ephemeral",
        text: "🔄 *Processing your request... Please wait!*",
      }),
    });

    // Process the request in the background
    processSprintCommand(slackCommand, slackUserId, sheet, responseUrl);
    return ContentService.createTextOutput(
      JSON.stringify({ message: "Request processing." })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // If command is not recognized
  Logger.log("Error: Command not recognized.");
  return ContentService.createTextOutput(
    JSON.stringify({ error: "❌ Command not recognized." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function processSprintCommand(command, userId, sheet, responseUrl) {
  try {
    var responseText = "❌ *Error:* Sprint data not found.";
    getClickUpAllTasks(); // Fetch all tasks before processing

    if (command === "/sprint-status") {
      var data = sheet.getRange("AR9:AY11").getValues();

      for (var i = 0; i < data.length; i++) {
        if (data[i][0] === userId) {
          responseText = data[i][7]; // Fetch Sprint Status Message
          break;
        }
      }
    } else if (command === "/sprint-breakdown") {
      responseText = sheet.getRange("AS51").getValue(); // Fetch Sprint Breakdown Message
    } else if (command === "/sprint-tasks") {
      var data = sheet.getRange("AR9:AZ11").getValues();

      for (var i = 0; i < data.length; i++) {
        if (data[i][0] === userId) {
          responseText = data[i][8]; // Fetch Sprint Tasks Message
          break;
        }
      }
    }

    // Send the response asynchronously after processing
    UrlFetchApp.fetch(responseUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        response_type: "ephemeral",
        text: responseText,
      }),
    });
  } catch (error) {
    Logger.log("🚨 Error processing sprint command: " + error.message);
    UrlFetchApp.fetch(responseUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        response_type: "ephemeral",
        text: "❌ *Error:* " + error.message,
      }),
    });
  }
}

// Handles `/fetch-clickup-tasks` command to prevent timeout.
function handleFetchClickUpTasks(responseUrl) {
  UrlFetchApp.fetch(responseUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      response_type: "ephemeral",
      text: "🔄 *Fetching tasks... Please wait!*",
    }),
  });

  // Fetch ClickUp tasks asynchronously
  getClickUpAllTasks();

  // Notify user when done
  UrlFetchApp.fetch(responseUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      response_type: "ephemeral",
      text: "🆗 *ClickUp tasks updated!*",
    }),
  });

  return ContentService.createTextOutput("🔄 Processing ClickUp tasks...");
}

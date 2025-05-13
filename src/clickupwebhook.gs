function handleClickUpWebhook(event, taskId, beforeName, afterName) {
  getClickUpTasks_2();

  var msg = ""; // Declare msg variable

  var newSP = extractSP(afterName);
  var oldSP = extractSP(beforeName);

  if (!event || !taskId || !afterName) {
    msg = "Missing essential task data.";
  } else {
    if (event === "taskCreated") {
      if (newSP === "") {
        newSP = "Not yet added"; // If SP is empty, change to a more human-readable value
      }

      msg =
        `:sparkles: *ClickUp Task Created:*\n` +
        `--------------------------\n` +
        `*Task Name:* ${afterName} \n` +
        `⏱️ *SP*: ${newSP} \n`; // Add any additional fields you want here
    } else if (event === "taskUpdated") {
      var team = extractTeamFromTaskName(afterName);

      // Check if SP was added in the update (oldSP is empty and newSP is not)
      if (oldSP === "" && newSP !== "") {
        msg =
          `:sparkles: *ClickUp Task Updated:*\n` +
          `--------------------------\n` +
          `*Task Name:* ${beforeName} \n` +
          `➡️ ${afterName} \n` + // Transition arrow for task name change
          `⏱️ *SP added*: ${newSP} \n`;
      } else if (newSP !== oldSP) {
        msg =
          `:sparkles: *ClickUp Task Updated:*\n` +
          `--------------------------\n` +
          `*Task Name:* ${beforeName} \n` +
          `➡️ ${afterName} \n` +
          `⏱️ *SP updated*: ${oldSP} → ${newSP} \n`; // SP update with arrows
      } else {
        msg =
          `:sparkles: *ClickUp Task Updated:*\n` +
          `--------------------------\n` +
          `*Task Name:* ${beforeName} \n` +
          `➡️ ${afterName} \n` +
          `:no_entry_sign: *No change in SP*`; // If no change in SP
      }
    } else {
      msg = "Can't find matching event";
    }

    var currentSPdict = extractSprintStats();
    var spAssignedCreative = currentSPdict.spAssignedCreative;
    var spAssignedGrowth = currentSPdict.spAssignedGrowth;
    var spLeft = currentSPdict.spLeft;
    var spAssigned = currentSPdict.spAssigned;

    // Construct the enhanced, positive alert message
    var alertMessage =
      msg +
      "\n\n" +
      "*SP Overview!* :sparkles:\n" +
      ":art: *Creative:* " +
      spAssignedCreative +
      " | :chart_with_upwards_trend: *Growth:* " +
      spAssignedGrowth +
      "\n" +
      ":muscle: *Total Assigned:* " +
      spAssigned +
      " | ⏱️ *SP available:* " +
      spLeft;

    if (spLeft < 0) {
      alertMessage +=
        "\n\n⚠️ All SP has been fully assigned. Your request may not be completed this sprint. Please contact the tech team for confirmation.";
    }

    // Send the message to Slack if message is valid
    if (msg && !msg.startsWith("Error")) {
      sendSlackAlert(alertMessage);
      simulateSlackAlert(alertMessage);
    }

    // Log the formatted message for debugging
    Logger.log("Formatted Message: " + msg);
  }
}

function sendSlackAlert(message) {
  var webhookUrl = "https://hooks.slack.com/services/YOUR_WEBHOOK_URL"; // Replace with your actual webhook URL

  var payload = {
    channel: "#YOUR_SLACK_CHANNEL", // Specify the Slack channel for sending messages
    username: "YourBotName", // Set the bot name
    icon_url: "YOUR_BOT_ICON_URL", // Set the bot icon
    text: message,
    mrkdwn: true, // Enables Slack Markdown formatting
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };

  try {
    UrlFetchApp.fetch(webhookUrl, options); // Post the message to Slack
    Logger.log("Message sent to Slack successfully.");
  } catch (error) {
    Logger.log("Error sending message to Slack: " + error.message); // Log any error in sending the message
  }
}

/**
 * Function to simulate Slack alerts (optional for logging/testing).
 * @param {string} message - The message to simulate for Slack.
 */
function simulateSlackAlert(message) {
  Logger.log("🔔 Simulated Slack Alert:");
  Logger.log(message);
}

/**
 * Extracts SP value from task name.
 * @param {string} taskName - The task name to extract the SP value from.
 * @returns {string} - The SP value extracted from the task name.
 */
function extractSP(taskName) {
  var spMatch = taskName.match(/\[SP:(\d+)(?:\/(\d+))?\]/);
  if (spMatch) {
    return spMatch[2] || spMatch[1]; // Return second number after slash or first number
  }
  return "";
}

/**
 * Extracts team information from task name.
 * @param {string} taskName - The task name to extract the team information from.
 * @returns {string} - The team name extracted from the task name.
 */
function extractTeamFromTaskName(taskName) {
  var teamMatch = taskName.match(/\[Request\s-\s([A-Za-z]+)\s-\s/);
  if (teamMatch && teamMatch[1]) {
    return teamMatch[1]; // Return the team name (Creative, Growth, etc.)
  }
  return "Unknown Team"; // Return default value if no team is found
}

function extractSprintStats() {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sprint_stats");
  if (!sheet) {
    Logger.log("Sheet 'sprint_stats' not found.");
    return;
  }

  // Retrieve values from each range separately
  var range1Values = sheet.getRange("AU67:AV67").getValues().flat();
  var range2Values = sheet.getRange("AY74:AY75").getValues().flat();

  // Combine the values
  var values = range1Values.concat(range2Values);

  // Ensure the combined array has the expected number of elements
  if (values.length < 4) {
    Logger.log("Insufficient data in the specified ranges.");
    return;
  }

  return {
    spAssigned: values[0],
    spLeft: values[1],
    spAssignedGrowth: values[2],
    spAssignedCreative: values[3],
  };
}

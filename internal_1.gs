function getClickUpTasks_1() {
  // Use environment variables or a secure location to store sensitive data (e.g., API keys)
  var apiKey = "YOUR_CLICKUP_API_KEY"; // ⬅️ Replace with your actual API key securely
  var listId = "YOUR_LIST_ID"; // ⬅️ Replace with your actual ClickUp List ID

  // ✅ Fetch only tasks created after January 1, 2025
  var startOf2025 = new Date("2025-01-01").getTime(); // Convert to Unix timestamp (milliseconds)

  var apiUrl =
    "https://api.clickup.com/api/v2/list/" +
    listId +
    "/task?" +
    "include_closed=true" +
    "&date_created_gt=" +
    startOf2025; // ✅ Fetch only tasks from 2025 onwards

  var headers = { Authorization: apiKey };
  var options = { headers: headers, method: "GET", muteHttpExceptions: true };

  var response = UrlFetchApp.fetch(apiUrl, options);

  if (response.getResponseCode() !== 200) {
    Logger.log("🚨 Error: " + response.getContentText());
    return;
  }

  var data = JSON.parse(response.getContentText());
  if (!data.tasks || data.tasks.length === 0) {
    Logger.log("✅ No new tasks found from 2025.");
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("clickup_internal");
  sheet.clearContents(); // ✅ Clear old data

  // ✅ Set headers (Removed Task ID & Last Updated columns)
  var headers = [
    "Task Name",
    "Status",
    "Assignee",
    "Created Date",
    "Due Date",
    "Sprint1",
    "Sprint2",
  ];
  sheet.appendRow(headers);

  var newRows = [];
  var timeZone = "GMT+7";

  for (var i = 0; i < data.tasks.length; i++) {
    var task = data.tasks[i];

    var taskName = task.name || "Untitled";
    var status = task.status?.status || "Unknown";
    var assignee =
      task.assignees.length > 0 ? task.assignees[0].username : "Unassigned";
    var dueDate = task.due_date
      ? Utilities.formatDate(
          new Date(parseInt(task.due_date)),
          timeZone,
          "yyyy-MM-dd"
        )
      : "No Due Date";
    var createdDate = task.date_created
      ? Utilities.formatDate(
          new Date(parseInt(task.date_created)),
          timeZone,
          "yyyy-MM-dd"
        )
      : "Unknown";

    var sprint_1 = "",
      sprint_2 = "";

    // ✅ Extract Sprint Data
    if (task.locations && task.locations.length > 0) {
      task.locations.sort((a, b) => {
        const sprintA = parseInt(
          (a.name.match(/Sprint (\d+)/) || [0, 0])[1],
          10
        );
        const sprintB = parseInt(
          (b.name.match(/Sprint (\d+)/) || [0, 0])[1],
          10
        );
        return sprintA - sprintB;
      });

      if (task.locations.length > 1) {
        sprint_2 = task.locations[task.locations.length - 1].name;
        sprint_1 = task.locations[task.locations.length - 2].name;
      } else {
        sprint_1 = task.locations[0].name;
      }
    }

    newRows.push([
      taskName,
      status,
      assignee,
      createdDate,
      dueDate,
      sprint_1,
      sprint_2,
    ]);
  }

  // ✅ Batch write data
  if (newRows.length > 0) {
    sheet.getRange(2, 1, newRows.length, newRows[0].length).setValues(newRows);
    Logger.log(
      "✅ " + newRows.length + " tasks from 2025 written to ClickUp Sheet."
    );
  }
}

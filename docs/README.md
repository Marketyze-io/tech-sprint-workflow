# Tech Sprint Workflow System

This repository contains the Google Apps Script code and functions used to automate sprint reporting, task tracking, and team updates by integrating ClickUp, Slack, and Google Sheets. The system ensures real-time sprint updates, performance insights, and smoother collaboration across teams without needing to leave Slack.


## Overview

This repository provides the core Google Apps Script code that powers the **Tech Sprint Workflow System**. The key components of the system include:

- **ClickUp API Integration**: Fetching tasks and sprint points data from ClickUp.
- **Google Sheets**: Used for processing and storing task data.
- **Slack Integration**: Automated notifications and slash commands for team updates.

## Key Features of the Tech Sprint Workflow System

### Automated Slack Notifications:

- **Bi-weekly Sprint Report**: Sends a summary of completed tasks, sprint points (SP), and progress vs. plan to Slack at the end of each sprint.
- **Weekly SP Breakdown**: Sends an automatic or on-demand report of SP distribution by team and task type.
- **Alert to Fill SP**: Sends reminders if there aren't enough sprint points filled for the next sprint.
- **Task Formatting Alert**: Checks task names for formatting errors and sends alerts when issues are detected.

### On-Demand Slack Commands:

- `/sprint-status`: Fetches and displays a user's active sprint tasks, showing progress and SP status.
- `/sprint-tasks`: Lists all in-progress tasks for the current sprint.
- `/sprint-breakdown`: Triggers a mid-sprint SP breakdown for team performance insights.
- `/fetch-clickup-tasks`: Manually fetches the latest tasks from ClickUp to update the Google Sheet.

## Repository Structure

- **/src/**: Contains the Google Apps Script code files:
  - `all_clickup.gs`: Fetches tasks from ClickUp and handles formatting errors.
  - `biweekly_report.gs`: Sends the bi-weekly sprint report to Slack.
  - `send_breakdown.gs`: Sends a breakdown of sprint points to Slack.
  - `check_title.gs`: Checks for formatting issues in task titles.
  - `internal_1.gs`: Fetches internal tasks from ClickUp.
  - `external_1.gs`: Fetches external tasks from ClickUp.
  - `webhook.gs`: Handles incoming webhooks from ClickUp and Slack.
  - `slackwebhook.gs`: Processes incoming Slack webhook commands.
  - `clickupwebhook.gs`: Processes ClickUp task creation and updates.
  - `fillSP.gs`: Sends alerts for sprint point tracking.
  
- **/docs/**: Contains documentation for the repository, including the `README.md` and any other resources like images or examples.
  
- **LICENSE**: The license file outlining the terms of use for the project.

## Prerequisites

Before using the code, ensure that you have the following:

- **ClickUp**: A ClickUp workspace with an API key.
- **Slack**: Set up Slack with an incoming webhook URL.
- **Google Sheets**: A Google Sheets account with access to Google Apps Script.

## Setup Instructions

To protect sensitive information, the template shared does not include the Google Apps Script code. Please duplicate the Google Sheets file and add the code from the repository, replacing the necessary fields to get your system started.

Template: https://docs.google.com/spreadsheets/d/1ZmCSTrR5d_DXy_zKk19pit0cCv23GBAj9bSrAvIzubQ/edit?gid=1556707338#gid=1556707338

### **Configure your integrations:**

**What You Need to Modify:**

1. **Slack Webhook URL:**
   - Replace the placeholder URL (e.g., `'https://hooks.slack.com/services/...'`) with your own **Slack webhook URL**.

2. **ClickUp API Key:**
   - Insert your **ClickUp API key** and **ClickUp List ID** where indicated in the script. This key is necessary to authenticate and fetch data from your ClickUp account.

3. **Slack Channel:**
   - Change the Slack channel (e.g., `#hello-tech-team`) to the channel where you want the notifications to be sent.

4. **Google Sheets ID:**
   - Update the **Google Sheets ID** in the script to point to your own Google Sheets document where task data will be processed and stored.

5. **Sheet Names:**
   - Ensure the sheet names (e.g., `'toslack_1'`, `'Sprint'`, `'sprint_stats'`) match those in your Google Sheets document, or adjust them as needed to align with your specific sheet setup.

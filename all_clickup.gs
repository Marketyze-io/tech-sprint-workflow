function getClickUpAllTasks() {
  getClickUpTasks_1();
  getClickUpTasks_2();

  sendClickUpErrorsToSlack(); //flag formating issues
}

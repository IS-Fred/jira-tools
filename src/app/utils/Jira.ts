import JiraApi from "jira-client";

const Jira = new JiraApi({
  protocol: "https",
  host: "invoicesimple.atlassian.net",
  apiVersion: "2",
  strictSSL: true,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_API_KEY,
});

export const CUSTOM_FIELD_NAMES = {
  StoryPoints: "customfield_10034",
  Classification: "customfield_10040",
  TShirtSize: "customfield_10047",
};

export default Jira;

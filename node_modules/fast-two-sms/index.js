"use strict";
const chalk = require("chalk");
const axios = require("axios");
const updateNotifier = require("update-notifier");

//Update Notifications
const pkg = require("./package.json");
const notifier = updateNotifier({ pkg });
notifier.notify();

let getWalletBalance = async function (authorization) {
  try {
    const response = await axios({
	  url: "https://www.fast2sms.com/dev/wallet",
	  method: 'GET',
      params: {
        authorization,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const sendMessage = async (props) => {
  const url = "https://www.fast2sms.com/dev/bulk";
  const { data, headers } = generateDataAndHeadersForApi(props);
  const { method, showLogs } = props;
  try {
    const response =
      method === "GET"
        ? await axios({url,data,headers,method})
        : await axios.post(url, data, { headers: headers });
    if (showLogs) console.log(chalk.greenBright("Message sent successfully."));
    return response.data;
  } catch (error) {
    if (error.response.data.status_code === 412)
      if (props.showLogs)
        console.log(
          chalk.red("Can't send message. Authorization key missing or invalid.")
        );
    if (error.response.data.status_code === 402)
      if (props.showLogs)
        console.log(chalk.red("Can't send message. Message text is required."));
    if (error.response.data.status_code === 405)
      if (props.showLogs)
        console.log(
          chalk.red("Can't send message.Atleast one Number is required.")
        );
    return error.response.data;
  }
};

let generateDataAndHeadersForApi = function (props) {
  const {
    authorization,
    method = "POST",
    sender_id = "FSTSMS",
    language = "english",
    route = "p",
    flash = 0,
    numbers,
    message,
    variables,
    variables_values,
  } = props;

  let nums = numbers.join(",");

  let data = {},
    headers = {};

  if (method === "GET") {
    data = {
      authorization: authorization,
      sender_id: sender_id,
      message: message,
      language: language,
      route: route,
      numbers: nums,
      flash: flash,
      variables,
      variables_values,
    };
    headers = {
      "cache-control": "no-cache",
    };
  } else {
    data = {
      sender_id: sender_id,
      message: message,
      language: language,
      route: route,
      numbers: nums,
      variables,
      variables_values,
    };
    headers = {
      authorization: authorization,
    };
  }
  return { data, headers };
};

module.exports = {
  sendMessage,
  getWalletBalance,
};

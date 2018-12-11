require('dotenv').config();

const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const ejs = require('ejs');
//const env = require('ibm-cloud-env');
const cfenv   = require('cfenv');
const appEnv = cfenv.getAppEnv();
const logger = log4js.getLogger(appName);
const app = express();
const server = http.createServer(app);

const name = process.env.WML_INSTANCE_NAME;
const username = process.env.USERNAME || cfenv.getAppEnv().getService(name).credentials.username;
const password = process.env.PASSWORD || cfenv.getAppEnv().getService(name).credentials.password;
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

var token = 'Bearer ';

fetch('https://ibm-watson-ml.mybluemix.net/v3/identity/token', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': auth
  }
})
.then(response => response.json())
.then(json => token += json.token);

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app,server);

// Add your code here

const port = process.env.PORT || localConfig.port;
server.listen(port, function(){

  logger.info(`CustomerChurnWebapp listening on http://localhost:${port}`);
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/results', function(req, res) {
  const tenure = req.body.tenure;
  const security = req.body.security;
  const support = req.body.support;
  const contract = req.body.contract;
  const dependents = req.body.dependents;
  const phone = req.body.phone;
  const internet = req.body.internet;
  const payment = req.body.payment;
  const backup = req.body.backup;
  const charges = req.body.charges;
  const protection = req.body.protection;
  const paperless = req.body.paperless;

  fetch(process.env.MODEL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({
      "fields": [
        "tenure",
        "OnlineSecurity_No",
        "TechSupport_No",
        "Contract_Month-to-month",
        "MonthlyCharges_OnlineSecurity_No",
        "MonthlyCharges_TechSupport_No",
        "MonthlyCharges_Contract_Month-to-month",
        "Dependents_No_OnlineSecurity_No",
        "Dependents_No_TechSupport_No",
        "Dependents_No_Contract_Month-to-month",
        "PhoneService_Yes_Contract_Month-to-month",
        "InternetService_Fiber optic_OnlineSecurity_No",
        "InternetService_Fiber optic_TechSupport_No",
        "InternetService_Fiber optic_Contract_Month-to-month",
        "InternetService_Fiber optic_PaymentMethod_Electronic check",
        "OnlineSecurity_No_OnlineBackup_No",
        "OnlineSecurity_No_TechSupport_No",
        "OnlineSecurity_No_Contract_Month-to-month",
        "OnlineSecurity_No_PaymentMethod_Electronic check",
        "OnlineBackup_No_Contract_Month-to-month",
        "DeviceProtection_No_Contract_Month-to-month",
        "TechSupport_No_Contract_Month-to-month",
        "TechSupport_No_PaymentMethod_Electronic check",
        "Contract_Month-to-month_PaperlessBilling_Yes",
        "Contract_Month-to-month_PaymentMethod_Electronic check"
      ],
      "values": [
        [
          parseFloat(tenure), // tenure
          security === 'No' ? 1 : 0, // OnlineSecurity_No
          support === 'No' ? 1 : 0, // TechSupport_No
          contract === 'month-to-month' ? 1 : 0, // Contract_Month-to-month
          security === 'No' ? parseFloat(charges) : 0, // MonthlyCharges_OnlineSecurity_No
          support === 'No' ? parseFloat(charges) : 0, // MonthlyCharges_TechSupport_No
          contract === 'month-to-month' ? parseFloat(charges) : 0, // MonthlyCharges_Contract_Month-to-month
          dependents === 'No' && security === 'No' ? 1 : 0, // Dependents_No_OnlineSecurity_No
          dependents === 'No' && support === 'No' ? 1 : 0, // Dependents_No_TechSupport_No
          dependents === 'No' && contract === 'month-to-month' ? 1 : 0, // Dependents_No_Contract_Month-to-month
          phone === 'Yes' && contract === 'month-to-month' ? 1 : 0, // PhoneService_Yes_Contract_Month-to-month
          internet === 'fiber-optic' && security === 'No' ? 1 : 0, // InternetService_Fiber optic_OnlineSecurity_No
          internet === 'fiber-optic' && support === 'No' ? 1 : 0, // InternetService_Fiber optic_TechSupport_No
          internet === 'fiber-optic' && contract === 'month-to-month' ? 1 : 0, // InternetService_Fiber optic_Contract_Month-to-month
          internet === 'fiber-optic' && payment === 'electronic-check' ? 1 : 0, // InternetService_Fiber optic_PaymentMethod_Electronic check
          security === 'No' && backup === 'No' ? 1 : 0, // OnlineSecurity_No_OnlineBackup_No
          security === 'No' && support === 'No' ? 1 : 0, // OnlineSecurity_No_TechSupport_No
          security === 'No' && contract === 'month-to-month' ? 1 : 0, // OnlineSecurity_No_Contract_Month-to-month
          security === 'No' && payment === 'electronic-check' ? 1 : 0, // OnlineSecurity_No_PaymentMethod_Electronic check
          backup === 'No' && contract === 'month-to-month' ? 1 : 0, // OnlineBackup_No_Contract_Month-to-month
          protection === 'No' && contract === 'month-to-month' ? 1 : 0, // DeviceProtection_No_Contract_Month-to-month
          support === 'No' && contract === 'month-to-month' ? 1 : 0, // TechSupport_No_Contract_Month-to-month
          support === 'No' && payment === 'electronic-check' ? 1 : 0, // TechSupport_No_PaymentMethod_Electronic check
          contract === 'month-to-month' && paperless === 'Yes' ? 1 : 0, // Contract_Month-to-month_PaperlessBilling_Yes
          contract === 'month-to-month' && payment === 'electronic-check' ? 1 : 0, // Contract_Month-to-month_PaymentMethod_Electronic check
        ]
      ]
    })
  })
  .then(response => response.json())
  .then((data) => {
    output = JSON.stringify(data);
    prediction = JSON.stringify(data.values[0][0]);
    no_churn_probability = JSON.stringify(data.values[0][1][0]);
    churn_probability = JSON.stringify(data.values[0][1][1]);
    res.render('pages/results', {
      prediction: prediction == 0 ? 'This customer is not likely to churn' : 'This customer is likely to churn',
      no_churn_probability: parseFloat(no_churn_probability * 100).toFixed(2) + '%',
      churn_probability: parseFloat(churn_probability * 100).toFixed(2) + '%',
      output: output
    });
  });
});

app.use(function(req, res, next) {
  res.render('pages/404');
});

app.use(function(err, req, res, next) {
  res.render('pages/500');
});

## CustomerChurnWebapp

Basic Web project with ExpressJS on NodeJS

[![](https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg)](https://bluemix.net)
![Platform](https://img.shields.io/badge/platform-NODE-lightgrey.svg?style=flat)

### Table of Contents
* [Summary](#summary)
* [Requirements](#requirements)
* [Configuration](#configuration)
* [Run](#run)
* [Debug](#debug)

<a name="summary"></a>
### Summary
The Web basic starter contains an opinionated set of files for web serving:

<<<<<<< HEAD
- `public/index.html`
- `public/404.html`
- `public/500.html`
=======
- `index.html`
- `results.html`
- `404.html`
- `500.html`
>>>>>>> upstream/uiBranch



<a name="enablement"></a>
### IBM Cloud Enablement

<a name="requirements"></a>
### Requirements
#### Local Development Tools Setup (optional)

- Install the latest [NodeJS](https://nodejs.org/en/download/) 6+ LTS version.

#### IBM Cloud development tools setup (optional)

1. Install [IBM Cloud Developer Tools](https://console.bluemix.net/docs/cli/idt/setting_up_idt.html#add-cli) on your machine  
2. Install the plugin with: `bx plugin install dev -r bluemix`


#### IBM Cloud DevOps setup (optional)

[![Create Toolchain](https://console.ng.bluemix.net/devops/graphics/create_toolchain_button.png)](https://console.ng.bluemix.net/devops/setup/deploy/)

[IBM Cloud DevOps](https://www.ibm.com/cloud-computing/bluemix/devops) services provides toolchains as a set of tool integrations that support development, deployment, and operations tasks inside IBM Cloud. The "Create Toolchain" button creates a DevOps toolchain and acts as a single-click deploy to IBM Cloud including provisioning all required services. 

***Note** you must publish your project to [Github](https://github.com/) for this to work.



<a name="configuration"></a>
### Configuration

The project contains IBM Cloud specific files that are used to deploy the application as part of an IBM Cloud DevOps flow. The `.bluemix` directory contains files used to define the IBM Cloud toolchain and pipeline for your application. The `manifest.yml` file specifies the name of your application in IBM Cloud, the timeout value during deployment, and which services to bind to.

Service credentials are taken from the VCAP_SERVICES environment variable if running IBM Cloud Cloud Foundry, from individual environment variables per service if running on IBM Cloud Container Service (see ./server/config/mappings.json), or from a config file if running locally, named`./server/config/localdev-config.js`.


<a name="run"></a>
<<<<<<< HEAD
### Run
=======
>>>>>>> upstream/uiBranch
#### Using IBM Cloud development CLI
The IBM Cloud development plugin makes it easy to compile and run your application if you do not have all of the tools installed on your computer yet. Your application will be compiled with Docker containers. To compile and run your app, run:

```bash
bx dev build
bx dev run
```


#### Using your local development environment
<<<<<<< HEAD

=======
> Note: The application may not run locally as it is programmed to communicate with IBM Cloud environment and grab credentials from that environment, if you want to try out the UI with the server callbacks, comment out the following block of code in `server/server.js`:

```
const env = JSON.parse(process.env.VCAP_SERVICES);
const credentials = env['pm-20'][0].credentials;
const auth = 'Basic ' + new Buffer(credentials.username + ':' + credentials.password).toString('base64');

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
```
>>>>>>> upstream/uiBranch


##### Endpoints

Your application is running at: `http://localhost:3000/` in your browser.

- Health endpoint: `/appmetrics-dash`
<<<<<<< HEAD
=======
- ML Model Results (only available/working when deployed to the cloud): `/results` 
>>>>>>> upstream/uiBranch


##### Session Store
You may see this warning when running `bx dev run`:
```
Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
```
When deploying to production, it is best practice to configure sessions to be stored in an external persistence service.


<a name="debug"></a>
### Debug

#### Using IBM Cloud development CLI
To build and debug your app, run:
```bash
bx dev build --debug
bx dev debug
```


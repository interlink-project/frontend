<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/interlink-project/frontend">
    <img src="images/logo.png" alt="Logo" width="172" height="80">
  </a>

  <h3 align="center">Interlink collaborative environment frontend</h3>

  <p align="center">
    React frontend that integrates and orchestrates all components related to the project
    <br />
    <a href="https://interlink-project.eu/"><strong>View Interlink project »</strong></a>
    <br />
    <br />
    <img src="https://github.com/interlink-project/frontend/actions/workflows/build-and-publish-docker.yml/badge.svg" alt="Docker build and publish status"></img>
    <br />
    <a href="https://github.com/interlink-project/frontend/issues">Report Bug</a>
    ·
    <a href="https://github.com/interlink-project/frontend/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE COMPONENT -->

## About the component

![Screen Shot](images/screenshot.png)

This component is intended to be the graphical interface with which the users of the "collaborative environment" defined by the project interact.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Create React App](https://create-react-app.dev/)
- [Docker-compose](https://docs.docker.com/compose/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### With docker:

1. Build the images (make up)
   ```sh
   make devbuild
   ```
2. Run the containers:

   **If you want to run the standalone version:**

   ```sh
   make solo
   ```

   Now, the frontend will be accessible through: http://localhost:3005 (can be changed by modifying DOMAIN and SOLODEVPORT variables defined in .env file)

   **If proxy is running and you want to run the integrated version (routed by traefik):**

   ```sh
   make integrated
   ```

   Now, the frontend will be accessible through: http://localhost

<!-- GETTING STARTED -->

## Customizations

<a href="http://demo.interlink-project.eu/weblate/engage/interlink/">
<img src="http://demo.interlink-project.eu/weblate/widgets/interlink/-/frontend/multi-auto.svg" alt="Translations status" />

<p align="right">(<a href="#top">back to top</a>)</p>

---

## Test E2E (Cypress)

#### Linux Prerequisites

##### Ubuntu/Debian

`apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb`

##### CentOS

`yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib`

##### Docker

If you're running your projects in containers, then you'll want Cypress in the container with the Node.js process.

```
  ui:
    image: cypress/base:latest
    # if targeting a specific node version, use e.g.
    # image: cypress/base:14
```

### Run test

First in all, you should define de the secrets `.secrets` used to do the testing and error tracking with sentry. The example of this file is located in `.secrets.example`

###### Note: the ´CYPRESS_EMAIL_LOGIN´ and ´CYPRESS_EMAIL_PASS´ aren't mandatory in production

#### Graphical interface

If you want to see a graphical interface, you can use the following command
**For Localhost**
`npm run cypress:open:localhost`
**For https://dev.interlink-project.eu**
`npm run cypress:open:dev`

**For https://demo.interlink-project.eu**
`npm run cypress:open:demo`

#### Via Terminal

**For Localhost**
`npm run cypress:run:localhost`

**For https://dev.interlink-project.eu**
`npm run cypress:run:dev`

**For https://demo.interlink-project.eu**
`npm run cypress:run:demo`

<p align="right"><sub><sup>Source: https://docs.cypress.io/guides/getting-started/installing-cypress</sup></sub></p>

<p align="right">(<a href="#top">back to top</a>)</p>

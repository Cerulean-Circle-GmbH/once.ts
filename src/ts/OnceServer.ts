import http from "http";
import url from "url";
import express from "express";
import fs from "fs";
import serveIndex from "serve-index";
import path from "path"


export class OnceServer {
  private servers: any[] = [];
  private readonly defaultPorts: number[] = [ /*80,*/ 777, 7777, 8077, 8080];
  private dynamicPort: number = this.defaultPorts[0];
  public static readonly pathSeperator: string = path.sep;
  static startPath: string;

  static start() {
    new OnceServer().init()
  }

  static getPlatformIndependantPathString(pathString: string) {
    const piPArray = pathString.split(this.pathSeperator);
    return piPArray.join("/");
  }

  static getPlatformSpecificPathString(pathString: string) {
    const piPArray = this.getPlatformIndependantPathString(pathString).split('/');
    return piPArray.join(this.pathSeperator);
  }


  async init() {
    // process.on('uncaughtException', function (err) {
    //     logger.error("Unhandled exception follows");
    //     logger.error(err, err.stack);
    // })

    // path.sep;

    //OnceServer.startPath = OnceServer.getPlatformIndependantPathString(__dirname + OnceServer.pathSeperator);
    // ONCE.installationMode = Once.INSTALLATION_MODE.TRANSIENT;

    // ONCE.global.Buffer = ONCE.global.Buffer || require('buffer').Buffer;


    // if (typeof atob === 'undefined') {
    //   ONCE.global.atob = function (b64Encoded) {
    //     return new Buffer.from(b64Encoded, 'base64').toString('binary');
    //   };
    // }
    ONCE.ENV = process.env;

    logger.log("Arguments: ", process.argv);
    logger.log("Environment: ", process.env);

    ONCE.express = express();
    ONCE.express.get("/", this.handleHTTPRequest.bind(this));
    ONCE.express.serveIndex = serveIndex;
    ONCE.express.use("/", ONCE.express.serveIndex("./dist"));
    ONCE.express.use("/", express.static("./dist"));


    this.servers = [];
    const httpsServer = null;
    /*
            Once.REPOSITORY_HOSTS.forEach(host => {
                ONCE.startServer(host);
            });
            */

    this.dynamicPort = await this.startServer(
      "http://localhost:" + this.dynamicPort,
      this.dynamicPort
    );
  }

  async startServer(host: string, dynamicPort: number | undefined): Promise<number> {
    return new Promise((resolve, reject) => {
      const currentURL = new URL(host);
      let port: number | undefined;
      if (currentURL.port) {
        port = parseInt(currentURL.port, 10);
      }
      else {
        port = 80;
      }

      const server = http.createServer(ONCE.express);
      const ports = this.defaultPorts;
      server.on("error", (err: { code: string }) => {
        logger.error("XXX", err);
        if (err.code !== "EADDRINUSE") {
          //   server.state = Once.STATE_CRASHED;

          return reject(err);
        }
        logger.log("/////////////");
        dynamicPort = ports.shift();
        if (dynamicPort) {
          server.listen(dynamicPort);
          this.dynamicPort = dynamicPort;
        }
        else {
          server.listen(++this.dynamicPort);
        }
        logger.log(dynamicPort);
      });
      server.on("listening", () => {
        this.servers.push(server);

        if (dynamicPort)
          logger.log(
            "ONCE Server listening on dynamic port: http://localhost:" +
            dynamicPort
          );
        else logger.log("ONCE Server listening on " + currentURL.toString());
        // server.state = Once.STATE_STARTED;
        if (dynamicPort) this.dynamicPort = dynamicPort;
        if (port) resolve(port);
        else resolve(-1);
      });
      server.listen(port);
    });
  }

  async handleHTTPRequest(request: any, response: any) {
    // const url = require("url");

    const localPath = url.parse(request.url).pathname;
    logger.log(
      "Received " + request.method + " to:",
      request.headers.host,
      localPath,
      "from",
      request.connection.remoteAddress
    );

    // ONCE.hostnames.add(request.headers.host);
    // ONCE.clients.add(request.connection.remoteAddress);

    // dns.reverse(request.connection.remoteAddress, function (err, hostnames) {
    //     if (err)
    //         logger.error("No problem, but:", err);
    //     else
    //         logger.log("Client hostname(s) are " + hostnames.join("; "));
    // });

    switch (request.method) {
      case "GET":
        switch (localPath) {
          case "/":
            this.renderHTML("./dist/EAMD.ucp/Components/com/github/ucpComponents/Cerulean-Circle-GmbH/once.ts/html/Once.html", "text/html", response);
            break;
          // case '/test':
          //     response.redirect(ONCE.localPath + '/test/html/Once.mochaTest.html');
          //     //ONCE.renderHTML(ONCE.baselocalPath + '/test/html/Once.mochaTest.html', 'text/html', response);
          //     break;
          // case "/once/env":
          //     response.writeHead(200, {
          //         'Content-Type': "application/json"
          //     });

          //     // Marcel: does not work over the ngx proxy on test.wo-da.de   will fallback to http and the produce a cors error 20210804

          //     // let clientEnv = {};
          //     // Object.assign(clientEnv, ONCE.ENV);
          //     // clientEnv.ONCE_DEFAULT_URL = request.protocol + '://' + request.headers.host;

          //     response.write(JSON.stringify(ONCE.ENV));
          //     response.end();
          //     break;
          // case '/favicon.ico':
          //     ONCE.renderHTML(ONCE.repositoryRootlocalPath + Once.REPOSITORY_ROOT + '/favicon.ico', 'image/x-icon', response);
          //     break;
          // /*
          //                 case Once.REPOSITORY_ROOT:
          //                     ONCE.renderHTML('./login.html', response);
          //                     break;
          //     */
          default:
            response.writeHead(404);
            response.write("Route not defined: " + localPath);
            response.end();
        }
        break;
    }
  }

  renderHTML(localPath: any, contentType: any, response: any) {
    // const fs = require("fs");

    const thelocalPath = localPath;
    fs.readFile(localPath, null, (error: any, data: any) => {
      if (error) {
        response.writeHead(404);
        response.write("File " + thelocalPath + " not found!");
        logger.error("File " + thelocalPath + " not found!");
      } else {
        response.writeHead(200, {
          "Content-Type": contentType,
        });
        response.write(data);
      }
      response.end();
    });
  }
}


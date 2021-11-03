import { OnceServer } from './OnceServer';

/*
 * The Web 4.0 ™ platform is supported by enterprise level subscription through Cerulean Circle GmbH
 *    Copyright (C) 2017  Marcel Donges (marcel@donges.it)
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
      {
            license: "AGPL3.0",
            href: "http://www.gnu.org/licenses/agpl-3.0.de.html"
            coAuthors: [
                "Philipp Bartels",
                }
      }
 */



declare global {
  //   interface Window {
  //     ONCE: Once
  //     indow: Window& typeof globalThis

  //   }
  var ONCE: Once.Kernel;
  var window: Window & typeof globalThis;
  var logger: Console;
}



export enum REPOSITORY {
  ROOT = "/EAMD.ucp",
  COMPONENTS = "/Components",
  SCENARIOS = "/Scenarios"
}

namespace Once {

  export enum MODE {
    NAVIGATOR,
    I_FRAME,
    NODE_SERVER,
  }
  export enum STATE {
    NEW = "new",
    INITIALIZED = "initialized",
    STARTED = "started",
    STOPED = "stopped",
    HIBERNATED = "hibernate",
    CRASHED = "crashed",
    SHUTDOWN = "shutdorwn"
  }

  export enum STAGE {
    DEV = "0_DEV",
    TEST = "1_TEST",
    INT = "2_INT",
    PROD = "3_PROD"
  }
  export enum INSTALLATION_MODE {
    TRANSIENT = "transient",
    NPM_LOCAL = "npm-local",
    NPM_GLOBAL = "npm-global",
    REPOSITORY_LOCAL = "repository-local",
    REPOSITORY_GLOBAL = "repository-global"
  }

  export class Kernel {
    private startTime: number;
    private global: typeof globalThis | null;
    private mode: MODE = Once.MODE.NODE_SERVER;
    private state: string = Once.STATE.NEW;
    express: any;
    private servers: any[] = [];
    private dynamicPort: number | undefined;
    private installationMode: INSTALLATION_MODE = Once.INSTALLATION_MODE.TRANSIENT;


    public  ENV: NodeJS.ProcessEnv | undefined;
    private repositoryRootPath: any;
    private basePath: string = "";
    private path: string = "";
    private versionNumber: string = "";
    private versionNamespace: string = "";
    private namespaceString: string = "";
    pathSeperator: string = "/";
    startPath: any;

    static async start() {
      const ONCE = new Kernel();
      const logger = console;


      logger.log("starting...");
      if (typeof global === "object") {
        if (global.ONCE) {
          logger.log("ONCE is already running: " + global.ONCE.mode);
          ONCE.state = "shutdown";
          logger.log(
            "leaving uninitialized Once instance behind for garbage collection... ",
            ONCE
          );
          logger.log("This happens if you start ONCE a second time.");
          return global.ONCE;
        }

        logger.log("starting in a node environment");
        global.ONCE = ONCE;
        ONCE.mode = Once.MODE.NODE_SERVER;
        // TODO PB Check TS and fix if necessary™
        //   global.window = global;
        //   global.document = null;
        ONCE.global = global;
      } else {
        logger.log("not in a node environment");
        // if (ONCE.global.frameElement && iframeSupport) {
        //     logger.log("running in an iFrame");
        //     var rootWindow = ONCE.global.frameElement.contentONCE.global.parent;
        //     ONCE = rootONCE.global.ONCE;
        //     Namespaces = rootONCE.global.Namespaces;
        //     var UcpComponentSupport = rootONCE.global.UcpComponentSupport;
        //     ONCE.global.frameElement.onload = UcpComponentSupport.onload.bind(UcpComponentSupport);
        //     logger.log("iFrame initialized");
        //     ONCE.mode = "iFrame";
        // } else {
        if (ONCE.global?.ONCE) {
          logger.log("ONCE is already running: " + ONCE.global.ONCE.mode);
          ONCE.state = "shutdown";
          logger.log(
            "leaving uninitialized Once instance behind for garbage collection... ",
            ONCE
          );
          return ONCE.global.ONCE;
        }
        logger.log("running in a Browser");
        window.ONCE = ONCE;
        ONCE.global = window;
        ONCE.mode = Once.MODE.NAVIGATOR;
        // }
      }
      ONCE.global.logger = console;

      await ONCE.init();
    }




    constructor() {
      this.global = null;
      this.startTime = Date.now();
    }

    async init() {
      // general init

      ONCE.checkInstallationMode();

      logger.group("word");
    }

    async checkInstallationMode() {
      switch (ONCE.mode) {
        case Once.MODE.NAVIGATOR:
        case Once.MODE.I_FRAME:
          await this.initClientsideOnce();
          break;
        case Once.MODE.NODE_SERVER:

         (await import("./OnceServer.js")).OnceServer.start();
          break;
      }

      // const repositoryRootIndex = ONCE.startPath.indexOf(REPOSITORY.ROOT);
      // switch (repositoryRootIndex) {
      //   case -1:
      //     ONCE.installationMode = Once.INSTALLATION_MODE.TRANSIENT;
      //     break;
      //   case 0:
      //     ONCE.installationMode = Once.INSTALLATION_MODE.REPOSITORY_GLOBAL;
      //     ONCE.repositoryRootPath = ONCE.startPath.substr(0, repositoryRootIndex);
      //     ONCE.findNamespaceAndVersion(repositoryRootIndex);
      //     ONCE.basePath = ONCE.repositoryRootPath /* + Once.REPOSITORY.ROOT + Once.REPOSITORY.COMPONENTS + '/'*/
      //       + ONCE.path;
      //     break;
      //   default:
      //     ONCE.installationMode = Once.INSTALLATION_MODE.NPM_LOCAL;
      //     ONCE.repositoryRootPath = ONCE.startPath.substr(0, repositoryRootIndex);
      //     ONCE.findNamespaceAndVersion(repositoryRootIndex);
      //     ONCE.basePath = ONCE.repositoryRootPath /* + Once.REPOSITORY.ROOT + Once.REPOSITORY.COMPONENTS + '/'*/
      //       + ONCE.path;

      // }

      // logger.log("ONCE.startPath: ", ONCE.startPath);
      // logger.log("ONCE.basePath: ", ONCE.basePath);
      // logger.log("ONCE.path: ", ONCE.path);
      // logger.log("ONCE.repositoryRootPath: ", ONCE.repositoryRootPath);


    }
    // findNamespaceAndVersion(repositoryRootIndex: number) {
    //   ONCE.path = ONCE.startPath.substr(repositoryRootIndex, ONCE.startPath.indexOf("/src") - repositoryRootIndex);
    //   let namespaces = ONCE.path.split(ONCE.pathSeperator);
    //   ONCE.versionNumber = namespaces.pop() || "";
    //   namespaces = namespaces.splice(3);
    //   ONCE.versionNamespace = ONCE.versionNumber.replace(/\./g, "_");
    //   ONCE.namespaceString = namespaces.join(".");
    // }

    async initClientsideOnce() {
      ONCE.installationMode = Once.INSTALLATION_MODE.TRANSIENT;
      ONCE.pathSeperator = '/';
      // __dirname =  window.location.pathname;
      // // path.sep;
      // const dirname = document.currentScript.src;
      // ONCE.startPath = Once.Kernel.getPlatformIndependantPathString(dirname);
    }

  }
}

Once.Kernel.start();


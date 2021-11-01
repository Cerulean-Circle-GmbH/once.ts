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



import { OnceServer } from "./OnceServer.js";
declare global {
  //   interface Window {
  //     ONCE: Once
  //     indow: Window& typeof globalThis

  //   }
  var ONCE: Once;
  var window: Window & typeof globalThis;
  var logger: Console;
}

enum ONCE_MODE {
  NAVIGATOR,
  I_FRAME,
  NODE_SERVER,
}

export class Once {
  private startTime: number;
  private global: typeof globalThis | undefined;
  mode: ONCE_MODE | undefined;
  state: string | undefined;
  express: any;
  private servers: any[] = [];
  private dynamicPort: number | undefined;

  static async start() {
    const ONCE = new Once();
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
      ONCE.mode = ONCE_MODE.NODE_SERVER;
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
      ONCE.mode = ONCE_MODE.NAVIGATOR;
      // }
    }
    ONCE.global.logger = console;

    await ONCE.init();
  }
  constructor() {
    this.startTime = Date.now();
  }

  async init() {
    // general init

    switch (ONCE.mode) {
      case ONCE_MODE.NAVIGATOR:
      case ONCE_MODE.I_FRAME:
        await this.initClientsideOnce();
        break;
      case ONCE_MODE.NODE_SERVER:
       OnceServer.start()
        break;
    }
    logger.group("word");
  }

  async initClientsideOnce() {
    throw new Error("not implemented");
  }

}

Once.start();

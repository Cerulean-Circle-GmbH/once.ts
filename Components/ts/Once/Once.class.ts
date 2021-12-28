/*
 *    The Web 4.0 ™ platform is supported by enterprise level subscription through Cerulean Circle GmbH
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
            Authors: [
                "Marcel Donges",
                "Philipp Bartels",
            ]
      }
 */

import { BrowserKernel } from './BrowserKernel.js'
import { DevelopmentExpressKernel } from './DevelopmentExpressKernel.js'
import { ExpressKernel } from './ExpressKernel.js'
import { Thinglish } from './Thinglish.js'

function getNodeKernel () {
  switch (process.env.NODE_ENV) {
    case 'development': return DevelopmentExpressKernel
    default: return ExpressKernel
  }
}

export async function start () {
  if (Thinglish.isNode) {
    console.log(process.env.NGROK_AUTH)

    ONCE = Thinglish.GetInstance(getNodeKernel())
  } else {
    ONCE = Thinglish.GetInstance(BrowserKernel)
  }
  await ONCE.start()
}

start()

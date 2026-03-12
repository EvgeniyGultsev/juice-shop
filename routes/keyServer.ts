/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path from 'node:path'
import { type Request, type Response, type NextFunction } from 'express'

export function serveKeyFiles () {
  return ({ params }: Request, res: Response, next: NextFunction) => {
    const file = params.file

    if (!file.includes('/')) {
      const requestedPath = path.resolve('encryptionkeys', file);
      if (!requestedPath.startsWith(path.resolve('encryptionkeys'))) {
        return res.status(400).send('Invalid file path');
      }
      res.sendFile(requestedPath);res.sendFile(path.resolve('encryptionkeys/', file))
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }
}

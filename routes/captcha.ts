/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { CaptchaModel } from '../models/captcha'

export function captchas () {
  return async (req: Request, res: Response) => {
    const captchaId = req.app.locals.captchaId++
    const operators = ['*', '+', '-']

const firstTerm = Math.floor(Math.random() * 10 + 1)
const secondTerm = Math.floor(Math.random() * 10 + 1)
const thirdTerm = Math.floor(Math.random() * 10 + 1)
const firstOperator = operators[Math.floor(Math.random() * operators.length)]
const secondOperator = operators[Math.floor(Math.random() * operators.length)]

const expression = firstTerm.toString() + firstOperator + secondTerm.toString() + secondOperator + thirdTerm.toString()
    
function applyOp(a: number, op: string, b: number) {
  switch(op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    default: throw new Error('Unknown operator')
  }
}

let intermediate: number
let answer: string
if ((firstOperator === '*' || secondOperator !== '*') && secondOperator !== '*') {

  intermediate = applyOp(firstTerm, firstOperator, secondTerm)
  answer = applyOp(intermediate, secondOperator, thirdTerm).toString()
} else {
  if (firstOperator === '*') {
    intermediate = applyOp(firstTerm, firstOperator, secondTerm)
    answer = applyOp(intermediate, secondOperator, thirdTerm).toString()
  } else {
    intermediate = applyOp(secondTerm, secondOperator, thirdTerm)
    answer = applyOp(firstTerm, firstOperator, intermediate).toString()
  }
}
    const captcha = {
      captchaId,
      captcha: expression,
      answer
    }
    const captchaInstance = CaptchaModel.build(captcha)
    await captchaInstance.save()
    res.json(captcha)
  }
}

export const verifyCaptcha = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const captcha = await CaptchaModel.findOne({ where: { captchaId: req.body.captchaId } })
    if ((captcha != null) && req.body.captcha === captcha.answer) {
      next()
    } else {
      res.status(401).send(res.__('Wrong answer to CAPTCHA. Please try again.'))
    }
  } catch (error) {
    next(error)
  }
}

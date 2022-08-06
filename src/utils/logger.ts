import { red, cyan, green, yellow, white } from 'kleur'

export enum Severity {
  success = 'success',
  warning = 'warning',
  error = 'error',
  neutral = 'neutral',
  info = 'info',
}

const LOGGERS = {
  neutral: white,
  success: green,
  warning: yellow,
  error: red,
  info: cyan,
}

export default function logger(
  message: string,
  severity: Severity = Severity.neutral,
) {
  console.log(LOGGERS[severity](message))
}

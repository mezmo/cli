import {Command} from '@cliffy/command'

export class MZMCommand extends Command {
  constructor() {
    super()
    return this.globalEnv(
      'MZM_ACCESS_KEY=<value:string>',
      'Platform IAM token',
      {prefix: 'MZM_'},
    )
  }
}

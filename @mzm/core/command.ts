import {Command} from '@cliffy/command'

export class MZMCommand extends Command<void, {}> {
  constructor() {
    super()
    return this.env(
      'MZM_ACCESS_KEY=<value:string>',
      'Platform IAM token',
      {prefix: 'MZM_'},
    )
  }
}

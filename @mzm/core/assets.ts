import {colors} from './mod.ts'
const bold = colors.bold
const ascii_logo = [
       bold(colors.yellow('                                                                ,,,,,           '))
,      bold(colors.yellow('                                                               ,,,,,,,          '))
,      bold(colors.yellow('                                                              ,,,,,,,,,         '))
,      bold(colors.yellow('                                                             ,,,,,,,,,,,        '))
,      bold(colors.yellow('                                                         ,,,,,,,,,,,,,,,,,,     '))
,      bold(colors.yellow('                                                    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,'))
,      bold(colors.yellow('                                                    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,'))
,      bold(colors.yellow('                                                         ,,,,,,,,,,,,,,,,,,     '))
,      bold(colors.yellow('                                                             ,,,,,,,,,,,        '))
,      bold(colors.yellow('                                                              ,,,,,,,,,         '))
, bold('@@@@@@@@     @@@@@@@@@@@@         @@@@@@@@@@@@@') + bold(colors.yellow('                ,,,,,,,          '))
, bold('@@@@@@@@  @@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@@@@') + bold(colors.yellow('              ,,,,,           '))
, bold('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                             ')
, bold('@@@@@@@@@@           @@@@@@@@@@@           @@@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
, bold('@@@@@@@@@             @@@@@@@@@             @@@@@@@@                            ')
].join('\n')

export function logo() {
  return ascii_logo
}

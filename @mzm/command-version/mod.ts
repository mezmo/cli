import {join, dirname, fromFileUrl} from '@std/path'
import {EOL} from '@std/fs'
import {parse} from '@std/semver'
import {difference} from '@std/datetime'
import {ResourceCommand} from '@mzm/core'

const current_directory = dirname(fromFileUrl(import.meta.url))
const project_root = join(current_directory, '..', '..')
const pkg_file = join(project_root, 'package.json')

function renderAge(date?: string): string {
  if (!date) return ''
  const now = new Date(Temporal.Now.zonedDateTimeISO('UTC').epochMilliseconds)
  const release_date = new Date(date)

  const diff = difference(now, release_date, {units: ['days', 'hours', 'minutes']})
  if (diff.days) return `${diff.days}d`
  if (diff.hours) return `${diff.hours}h`
  return `${diff.minutes}m`
}

export default new ResourceCommand('version')
  .name('version')
  .description([
    'The version command outputs the current version, as a standard semver string,'
  , 'its individual component values as well as the age of running version'
  ].join(EOL))
  .column({name: 'VERSION', property: 'version'})
  .column({name: 'MAJOR', property: 'major'})
  .column({name: 'MINOR', property: 'minor'})
  .column({name: 'PATCH', property: 'patch'})
  .column({name: 'AGE', property: 'date', render: renderAge})
  .example('print version information', 'mzm version')
  .example('print version information in json format', 'mzm version -o json')
  .example('print version information in yaml format', 'mzm version -o json')
  .action(async function(options: any) {
    const [stats, pkg_text] = await Promise.all([
      Deno.stat(pkg_file)
    , Deno.readTextFile(pkg_file)
    ])
    const pkg_json = JSON.parse(pkg_text)
    const semver = parse(pkg_json.version)

    if (options.quiet) return console.log(pkg_json.version)

    const to_render = {
      version: pkg_json.version
    , major: semver.major
    , minor: semver.minor
    , patch: semver.patch
    , date: stats.ctime
    }

    //@ts-ignore work around for command subclassing
    console.log(this.render(to_render, options.output))
  })

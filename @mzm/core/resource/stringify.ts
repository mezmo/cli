import {yaml} from '../mod.ts'

enum StringifyFormat {
  JSON = 'json'
, YAML = 'yaml'
}
export default function stringify(content: Record<string, any>, format: StringifyFormat): string {
  switch(format) {
    case StringifyFormat.JSON: return JSON.stringify(content, null, 2)
    case StringifyFormat.YAML: return yaml.stringify(content)
    default: {
      const error = new Error(`Unknown stringify format ${format}`)
      throw error
    }
  }
}

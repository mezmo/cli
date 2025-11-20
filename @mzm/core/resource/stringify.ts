import {yaml} from '../mod.ts'
import {StringifyFormat} from './types.ts'
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

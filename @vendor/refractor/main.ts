import bash from 'https://esm.sh/refractor@5/bash'
import clike from 'https://esm.sh/refractor@5/clike'
import go from 'https://esm.sh/refractor@5/go'
import hcl from 'https://esm.sh/refractor@5/hcl'
import javascript from 'https://esm.sh/refractor@5/javascript'
import json from 'https://esm.sh/refractor@5/json'
import lua from 'https://esm.sh/refractor@5/lua'
import python from 'https://esm.sh/refractor@5/python'
import ruby from 'https://esm.sh/refractor@5/ruby'
import sql from 'https://esm.sh/refractor@5/sql'
import typescript from 'https://esm.sh/refractor@5/typescript'
import yaml from 'https://esm.sh/refractor@5/yaml'
import {refractor} from 'https://esm.sh/refractor@5/core'

refractor.register(bash)
refractor.register(clike)
refractor.register(go)
refractor.register(hcl)
refractor.register(javascript)
refractor.register(json)
refractor.register(lua)
refractor.register(python)
refractor.register(ruby)
refractor.register(sql)
refractor.register(typescript)
refractor.register(yaml)

export default refractor
export {visit, CONTINUE, EXIT, SKIP} from 'https://esm.sh/unist-util-visit@5'

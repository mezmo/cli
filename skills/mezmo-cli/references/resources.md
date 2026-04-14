# Resources

Use `mzm get`, `mzm create`, `mzm edit`, and `mzm delete` to manage Mezmo views and categories.

## Read Before Write

Inspect current resources before mutating them.

```bash
# accounts
mzm get account
mzm get account <account-id>

# categories
mzm get category
mzm get category <category-id-or-name>

# views
mzm get view
mzm get view <view-id-or-name>
```

When another command needs an identifier, prefer structured output:

```bash
# list ids only
mzm get view -q

# select ids by name
mzm get view -o json | jq -r '.[] | select(.name=="My View Name") .pk'
mzm get category -o json | jq -r '.[] | select(.name=="Category One") .pk'
```

## Creating Resources

Use file-based creation for reproducible changes and interactive creation when the user wants editor-driven workflows.

```bash
# apply a resource file
mzm create -f view.yaml
mzm create -f category.json

# create from stdin
cat view.yaml | mzm create -f -

# interactive creation
mzm create category
mzm create view
```

`mzm create category` and `mzm create view` open the user's editor and accept YAML by default, or JSON with `-o json`.

## Editing Resources

Inspect the resource first, then edit by ID or an explicitly resolved name.

```bash
# edit a view
mzm edit view -o yaml 7fb51dc261
mzm edit view -o json 7fb51dc261

# edit a category
mzm edit category -o yaml 7fb51dc261
mzm edit category -o json 7fb51dc261
```

Name-based selection patterns supported by the CLI:

```bash
mzm edit view "$(mzm get view -o json | jq -r '.[] | select(.name==\"My View Name\") .pk')"
mzm edit category "$(mzm get category -o json | jq -r '.[] | select(.name==\"Category One\") .pk')"
```

## Deleting Resources

Delete only after confirming the target ID or exact name-derived ID.

```bash
# remove one or more views
mzm delete view a3d194
mzm delete view a3d194 fab3134

# remove categories
mzm delete category a3d194
mzm delete category a3d194 fab3134
```

## Safe Mutation Pattern

1. List current views/categories with `mzm get ...`.
2. Resolve exact IDs if the user supplied a human name.
3. Prefer file-based `mzm create -f ...` for reproducible changes.
4. Use `mzm edit ...` for existing single-resource updates that benefit from editor review.
5. Only delete after confirming the exact target resource.

# env-to-yaml

A tool allowing the insertion of env vars into a yml file.

## Installation

```bash
npm link
```

## Usage

```bash
env2yml -e {path-to-env-file} -y {path-to-yml} -o {path-to-output}
```

For example imagine you are in a directory with 2 files:
`./.env`

```env
SECRET=secret
```

And
`./config.yaml`

```yaml
property:
  value: ${SECRET}
```

We can use this command to insert the env var `SECRET` defined in `.env` into `property.value` in `config.yaml` and dump the output of this operation in `out.yaml`:

```bash
env2yaml -e .env -y config.yaml -o out.yaml
```

`./out.yaml`

```yaml
property:
  value: secret
```

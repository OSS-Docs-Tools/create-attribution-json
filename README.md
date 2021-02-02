# Create Attribution JSON

A GitHub Action for creating an `attribution.json` file which contains git log metadata about files in your repo.

### Usage

This action is meant to be use in a scheduled workflow which has a local checkout, and node set up. It will use the `glob` you put in to decide which files you want in the `attribution.json`.

```yml
name: Update Attributions Weekly

on:
    schedule:
      # https://crontab.guru/#0_6_*_*_*
      - cron: '0 6 * * *'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0

    - uses: actions/setup-node@v1
      with:
        node-version: 12
        registry-url: https://registry.npmjs.org/

    # Updates the attribution.json file in git    
    - uses: OSS-Docs-Tools/create-attribution-json@master
      with:
        glob: "docs/*.md"
    
    - name: Configure git and update attribution.json
      run: |
        git config user.email "bot@github.com"
        git config user.name "GitHub Bot"
        git add -f attribution.json
        if git commit -m "Update attribution.json"; then
          git push
        fi
```

The attribution.json file is optimized for a UI which shows up to 5 contributors (with gravatars), then has a list of many others. E.g:

> This document was created by Ryan Cavanaugh, Daniel Rosenwasser, Orta Therox, Nathan Shively-Sanders, Martin Veith and 27 others.

The JSON looks like:

```json
{  
  "docs/handbook-v1/Basic Types.md": {
    "top": [
      {
        "name": "Ryan Cavanaugh",
        "gravatar": "2484d99c8a58bc51ae587e07a05ba6e2",
        "count": 53
      },
      {
        "name": "Daniel Rosenwasser",
        "gravatar": "cd1cc3769958ccc22b86d6a87badfe31",
        "count": 25
      },
      {
        "name": "Orta Therox",
        "gravatar": "28e997da43c10d99aa99273b48efe8cf",
        "count": 4
      },
      {
        "name": "Nathan Shively-Sanders",
        "gravatar": "f2d3b194d100bd25842ca048ab101408",
        "count": 4
      },
      {
        "name": "Martin Veith",
        "gravatar": "c14e40955314d925ddde906ee48fc437",
        "count": 3
      }
    ],
    "total": 32
  }
}
```

### Options

```yml
  glob: 
    description: 'A glob for files which you want to provide attribution for'
    default: '**/*.md'
    required: false

  useLocalizeJSON: 
    description: 'A boolean to use a localize.json (used in @oss-docs/sync) for the paths to set attribution instead of a glob'
    default: 'false'
    required: false

  output:
    description: 'The filename for the JSON file for attribution'
    default: './attribution.json'
    required: false

  cwd:
    description: 'The sub-folder to run everything from, useful for monorepos'
    default: '.'
    required: false
```

#!/usr/bin/env node

"use strict";

import commandLineArgs from "command-line-args";
import fs from "fs/promises";

async function main() {
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      type: String,
      multiple: true,
      defaultValue: [],
    },
    {
      name: "yaml",
      alias: "y",
      type: String,
    },
    {
      name: "out",
      alias: "o",
      type: String,
      defaultValue: "out.yml",
    },
  ]);

  const envs = await Promise.all(
    options.env.map(async (filename) => {
      console.log(filename);
      const contents = await fs.readFile(filename);
      const file = contents.toString();
      const env = {};
      file.replace(/(\w+)=(.+)/g, function ($0, $1, $2) {
        env[$1] = $2;
      });
      return env;
    })
  );
  const env = envs.reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const ymlBuffer = await fs.readFile(options.yaml);
  const yml = ymlBuffer
    .toString()
    .replace(/\$\{(\w+)(?::-?(.*))?}/g, ($0, $1, $2) => {
      let envValue = env[$1];

      if (!envValue) {
        if (!$2) {
          console.log(
            `Error interpreting ${$1} - Neither provided with a default value or covered by env - using default value`
          );
          return "";
        }

        envValue = $2;
      }

      return envValue;
    });

  await fs.writeFile(options.out, yml);
}

await main()
  .then(() => console.log("\nCompleted!"))
  .catch((e) => console.error(e));

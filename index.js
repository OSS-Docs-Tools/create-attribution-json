// @ts-check

const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { createAttributionJSON } = require("./src/createAttributionJSON");

async function run() {
  // Setup for options
  const glob = core.getInput("glob");
  const useLocalizeJSON = core.getInput("useLocalizeJSON") === "true";
  const output = core.getInput("output");
  const cwd = core.getInput("cwd");

  const opts = {
    glob,
    useLocalizeJSON,
    output,
    cwd,
  };

  try {
    // Run the thing
    const getFiles = opts.useLocalizeJSON ? getGlobFiles : getLocalizedDirs
    const files = getFiles(opts)
    createAttributionJSON(files, opts)

  } catch (error) {
    core.setFailed(error.message);
  }
}

// Grab filenames from a glob
const getGlobFiles = (opts) => {
  const glob = opts.glob;
  return globby.sync(glob);
};

// Run through each "to" as a glob grabbing filenames
const getLocalizedDirs = (opts) => {
  const localizeJSONPath = path.posix.join(opts.cwd, "localize.json");
  if (!fs.existsSync(localizeJSONPath)) {
    throw new Error(`There isn't a localize.json file in the root of ${opts.cwd}`);
  }
  
  const settings = JSON.parse(fs.readFileSync(localizeJSONPath, "utf8"))
  
  let allFiles = [];
  settings.docsRoots.forEach(docs => {
    const docsRootPath = path.posix.join(opts.cwd, docs.to);
    allFiles = [...allFiles, ...globby.sync(docsRootPath)];
  });

  return allFiles
};

run();

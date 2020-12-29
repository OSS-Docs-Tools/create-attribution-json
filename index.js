// @ts-check

const core = require("@actions/core");
const { createAttributionJSON } = require("./src/createAttributionJSON");
const { getGlobFiles, getLocalizedDirs } = require("./src/getFiles");

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

run();

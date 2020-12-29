const fs = require("fs");
const path = require("path");
const globby = require("globby");

// Grab filenames from a glob
const getGlobFiles = (opts) => {
  return globby.sync(opts.glob, { cwd: opts.cwd });
};

// Run through each "to" as a glob grabbing filenames
const getLocalizedDirs = (opts) => {
  const localizeJSONPath = path.posix.join(opts.cwd, "localize.json");
  if (!fs.existsSync(localizeJSONPath)) {
    throw new Error(`There isn't a localize.json file in the root of ${opts.cwd}`);
  }

  const settings = JSON.parse(fs.readFileSync(localizeJSONPath, "utf8"));

  let allFiles = [];
  settings.docsRoots.forEach((docs) => {
    const docsRootPath = path.posix.join(opts.cwd, docs.to);
    const files = globby.sync(docsRootPath)
    allFiles = [...allFiles, ...files];
  });

  return allFiles;
};

module.exports = {
    getGlobFiles,
    getLocalizedDirs
}
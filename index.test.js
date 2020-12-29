const { createAttributionJSON } = require("./src/createAttributionJSON");
const { getGlobFiles, getLocalizedDirs } = require("./src/getFiles");

// Go check the results in test/jsons/x.json

test("Gets attributions for some files", async () => {
  const opts = { cwd: ".", output: "test/jsons/1.json"};
  createAttributionJSON(["test/file1.md", "test/file2.md"], opts);
});

test("handles cwd", async () => {
  const opts = { cwd: "test", output: "jsons/2.json"};
  createAttributionJSON(["file1.md", "file2.md"], opts);
});

test("globs correctly", async () => {
  const testFiles = getGlobFiles({ glob: "test"})
  expect(testFiles).toContain("test/file1.md")
});

test("globs cwd correctly", async () => {
  const testFiles = getGlobFiles({ glob: "file1.*", cwd: "test"})
  expect(testFiles).toContain("file1.md")
});

test("uses a localize json", async () => {
  const testFiles = getLocalizedDirs({ cwd: "test" })
  expect(testFiles).toContain("test/subfolder/ja/file3.md")
});
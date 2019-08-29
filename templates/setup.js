// This file is not required when running the project locally. Its purpose is to set up the
// AssemblyScript compiler when a new project has been loaded in WebAssembly Studio.

require.config({
  paths: {
    "binaryen": "https://cdn.jsdelivr.net/gh/AssemblyScript/binaryen.js@84.0.0-nightly.20190522/index",
    "assemblyscript": "https://cdn.jsdelivr.net/gh/nearprotocol/assemblyscript@61bda9091d039f2989e26f42fdb7f2d5b8d11d44/dist/assemblyscript",
    "assemblyscript/dist/asc": "https://cdn.jsdelivr.net/gh/nearprotocol/assemblyscript@61bda9091d039f2989e26f42fdb7f2d5b8d11d44/dist/asc"
  }
});

logLn("Loading AssemblyScript compiler ...");
window.logLn = logLn;

Object.assign(window.StudioFs, {
  readFileSync(path) {
    const file = getProject().getFile(path);
    return file ? file.data : null;
  },
  writeFileSync(path, contents) {
    path = path.replace(/^\.\//, "");
    const type = fileTypeForExtension(path.substring(path.lastIndexOf(".") + 1));
    getProject().newFile(path, type, true).setData(contents);
  },
  existsSync(path) {
    return !!getProject().getFile(path);
  }
});

require(["assemblyscript/dist/asc"], asc => {
  Object.assign(window.AssemblyScriptCompiler, asc);

  if (!window.process) {
    window.process = {};
  }

  monaco.languages.typescript.typescriptDefaults.addExtraLib(asc.definitionFiles.assembly);
  logLn("AssemblyScript compiler is ready!");
  setupCallback();
});
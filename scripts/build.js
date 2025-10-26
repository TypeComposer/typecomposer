const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const packageJson = {
  name: "typecomposer",
  version: "0.1.47",
  repository: {
    type: "git",
    url: "https://github.com/zico15",
  },
  description: "A component library for getting people started with easy to re-use components for everyday projects.",
  main: "index.js",
  module: "index.js",
  types: "index.d.ts",
  sideEffects: ["./global/index.js", "./core/styles/**"],
  files: ["README.md", "core", "global", "styles", "index.js", "index.d.ts", "index.js.map", "typings/index.d.ts", "assets", "translation", "LICENSE"],
  keywords: ["typecomposer"],
  preferGlobal: true,
  author: "Ezequiel",
  license: "MIT",
  devDependencies: {
    "@types/node": "^24.3.3",
    csstype: "^3.1.3",
    terser: "^5.44.0",
    "ts-morph": "^27.0.0",
    typescript: "^5.9.2",
    vite: "^7.1.5",
  },
};

function readPackageVersion() {
  const packageJsonPath = path.resolve(__dirname, "../package.json");
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
  const packageData = JSON.parse(packageJsonContent);
  packageJson.version = packageData.version;
}

function writePackageJson() {
  const packageJsonPath = path.resolve(__dirname, "../dist/package.json");
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function copyFolders() {
  const foldersToCopy = ["styles", "translation", "typings"];
  const distPath = path.resolve(__dirname, "../dist");

  foldersToCopy.forEach((folder) => {
    const srcFolderPath = path.resolve(__dirname, "../", folder);
    const destFolderPath = path.resolve(distPath, folder);

    if (fs.existsSync(destFolderPath)) {
      fs.rmSync(destFolderPath, { recursive: true, force: true });
    }

    if (fs.existsSync(srcFolderPath)) {
      copyRecursiveSync(srcFolderPath, destFolderPath);
    }
  });
  const tsconfigSrcPath = path.resolve(__dirname, "../tsconfig.json");
  const tsconfigDestPath = path.resolve(distPath, "tsconfig.json");
  if (fs.existsSync(tsconfigSrcPath)) {
    fs.copyFileSync(tsconfigSrcPath, tsconfigDestPath);
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function build() {
  // executar o tsc -p tsconfig.json
  execSync("tsc -p tsconfig.json", { stdio: "inherit" });
  // executar o comando de minificação
  // execSync("npm run minify", { stdio: "inherit" });
}

if (require.main === module) {
  build();
  copyFolders();
  readPackageVersion();
  writePackageJson();
}

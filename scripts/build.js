const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const packageJson = {
  name: "typecomposer",
  version: "0.1.61",
  repository: {
    type: "git",
    url: "https://github.com/zico15",
  },
  description: "A component library for getting people started with easy to re-use components for everyday projects.",
  main: "index.js",
  module: "index.js",
  types: "index.d.ts",
  type: "module",
  sideEffects: ["./global/index.js", "./core/styles/**"],
  files: ["README.md", "core", "global", "index.js", "index.d.ts", "index.js.map", "typings/index.d.ts", "assets", "translation", 'styles', 'theme.css', "LICENSE"],
  keywords: ["typecomposer"],
  preferGlobal: true,
  author: "Ezequiel",
  license: "MIT",
  // exports: {
  //   ".": "./index.js",
  // },
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
  console.log("packageData")
  packageJson.version = packageData.version;
}

function writePackageJson() {
  const packageJsonPath = path.resolve(__dirname, "../dist/package.json");
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function copyFolders() {
  const foldersToCopy = ["translation", "typings"];
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

function copyCssFiles(src, dest) {
  fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyCssFiles(srcPath, destPath);
    } else if (entry.isFile() && (entry.name.endsWith('.css') || entry.name.endsWith('.css.map'))) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.scss')) {
      execSync(`npx sass ${srcPath} ${destPath.replace('.scss', '.css')}`, { stdio: 'inherit' });
    }
  });
}

/* Read copy.json and copy the dist folder to the specified projects */
function copyDebugPorject() {
  const jsonPath = path.resolve(__dirname, "./copy.json");
  if (fs.existsSync(jsonPath)) {
    const jsonContent = fs.readFileSync(jsonPath, "utf-8");
    const { project } = JSON.parse(jsonContent);
    for (const projectPath of project) {
      console.log("Copying to project:", projectPath);
      // se nao existir a pasta node_modules/typecomposer, criar
      const typecomposerPath = path.join(projectPath, "node_modules", "typecomposer");
      if (!fs.existsSync(typecomposerPath)) {
        fs.mkdirSync(typecomposerPath, { recursive: true });
      }
      const command = `rm -rf '${projectPath}/node_modules/typecomposer/*' -y && cp -r ./dist/* '${projectPath}/node_modules/typecomposer'`;
      execSync(command, { stdio: "inherit" });
    }
  }
}


function build() {
  // executar o tsc -p tsconfig.json
  execSync("tsc -p tsconfig.json", { stdio: "inherit" });
  execSync("npm run build-scss", { stdio: "inherit" });

  // executar o comando de minificação
  // execSync("npm run minify", { stdio: "inherit" });
}

if (require.main === module) {
  build();
  copyFolders();
  copyCssFiles('src', 'dist');
  readPackageVersion();
  writePackageJson();
  copyDebugPorject();
}

const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const glob = require("glob");

// Function to get plugin version from the main plugin file
function getPluginVersion(pluginFile) {
  const content = fs.readFileSync(pluginFile, "utf8");
  const versionMatch = content.match(/Version:\s*(.+)/);
  return versionMatch ? versionMatch[1].trim() : "unknown";
}

// Function to remove .DS_Store files recursively
function removeDSStoreFiles(dir) {
  const files = glob.sync("**/.DS_Store", { cwd: dir, dot: true });
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    fs.removeSync(filePath);
    console.log(`Removed: ${filePath}`);
  });
}

// Function to remove directories recursively
function removeDirectories(dir, dirsToRemove) {
  dirsToRemove.forEach((dirName) => {
    const dirs = glob.sync(`**/${dirName}`, { cwd: dir, dot: true });
    dirs.forEach((subDir) => {
      const fullPath = path.join(dir, subDir);
      fs.removeSync(fullPath);
      console.log(`Removed directory: ${fullPath}`);
    });
  });
}

// Function to remove specified files and clean up directories
function cleanupFiles(dir, filesToRemove, dirsToClean) {
  // Remove specified files
  filesToRemove.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath);
      console.log(`Removed: ${filePath}`);
    }
  });

  // Clean up specified directories
  dirsToClean.forEach(({ dir: subDir, except }) => {
    const fullPath = path.join(dir, subDir);
    if (fs.existsSync(fullPath)) {
      fs.readdirSync(fullPath).forEach((item) => {
        if (!except.includes(item)) {
          fs.removeSync(path.join(fullPath, item));
          console.log(`Removed: ${path.join(subDir, item)}`);
        }
      });
    }
  });

  // Remove .DS_Store files
  removeDSStoreFiles(dir);

  // Remove .git and .nova directories
  removeDirectories(dir, [".git", ".nova"]);
}

// Function to create zip file
function createZipFile(sourceDir, outputFile, excludeFiles) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));
    archive.pipe(output);

    // Add files to the archive with 'uipress-lite' as the root directory
    archive.glob(
      "**/*",
      {
        cwd: sourceDir,
        ignore: [".DS_Store", ".git/**", ".nova/**", ...excludeFiles],
        dot: true,
      },
      { prefix: "uipress-lite" }
    );

    archive.finalize();
  });
}

// Main function
async function packagePlugin(pluginDir, pluginFile, scriptName) {
  try {
    const version = getPluginVersion(path.join(pluginDir, pluginFile));
    const pluginName = path.basename(pluginDir);

    // Define staging directory
    const stagingDir = path.resolve(pluginDir, "..", "..", "..", "..", "staging");
    const uncompressedDir = path.join(stagingDir, pluginName);

    // Remove existing uncompressed directory if it exists
    if (fs.existsSync(uncompressedDir)) {
      fs.removeSync(uncompressedDir);
    }

    // Create uncompressed version in staging directory
    console.log("Creating uncompressed version...");
    fs.copySync(pluginDir, uncompressedDir);

    // Clean up files in the uncompressed version
    console.log("Cleaning up files...");
    cleanupFiles(uncompressedDir, [".gitignore"], [{ dir: "app", except: ["dist"] }]);

    // Create zip file
    const zipFileName = `${pluginName}-${version}.zip`;
    const zipFilePath = path.join(stagingDir, zipFileName);
    console.log(`Creating ${zipFileName}...`);
    await createZipFile(uncompressedDir, zipFilePath, [scriptName]);

    console.log("Plugin packaged successfully!");
    console.log(`Uncompressed version: ${uncompressedDir}`);
    console.log(`Compressed version: ${zipFilePath}`);
  } catch (error) {
    console.error("Error packaging plugin:", error);
  }
}

// Usage
const pluginDirectory = "../uipress-lite"; // Replace with your plugin directory
const mainPluginFile = "uipress-lite.php"; // Replace with your main plugin file name
const packagingScriptName = "package-plugin.js"; // The name of this script file

packagePlugin(pluginDirectory, mainPluginFile, packagingScriptName);

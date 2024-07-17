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
}

// Function to create zip file
function createZipFile(sourceDir, outputFile, excludeFiles) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);

    archive.glob("**/*", {
      cwd: sourceDir,
      ignore: [".DS_Store", ...excludeFiles],
      dot: true,
    });

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
    const uncompressedDir = path.join(stagingDir, `${pluginName}-${version}`);

    // Create uncompressed version in staging directory
    console.log("Creating uncompressed version...");
    fs.copySync(pluginDir, uncompressedDir);

    // Clean up files in the uncompressed version
    console.log("Cleaning up files...");
    cleanupFiles(uncompressedDir, [".gitignore", ".DS_Store"], [{ dir: "app", except: ["dist"] }]);

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
const pluginDirectory = "./my-plugin"; // Replace with your plugin directory
const mainPluginFile = "my-plugin.php"; // Replace with your main plugin file name
const packagingScriptName = "package-plugin.js"; // The name of this script file

packagePlugin(pluginDirectory, mainPluginFile, packagingScriptName);

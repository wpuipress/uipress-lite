const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

// Function to get plugin version from the main plugin file
function getPluginVersion(pluginFile) {
  const content = fs.readFileSync(pluginFile, "utf8");
  const versionMatch = content.match(/Version:\s*(.+)/);
  return versionMatch ? versionMatch[1].trim() : "unknown";
}

/** Hidden entries required at runtime and must stay in the packaged plugin. */
const HIDDEN_KEEP = [".vite"];

/**
 * Recursively removes hidden files and directories (names starting with ".")
 *
 * @param {string} dir Directory to walk
 * @returns {void}
 */
function removeHiddenEntries(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.name.startsWith(".")) {
      if (HIDDEN_KEEP.includes(entry.name)) {
        return;
      }

      fs.removeSync(fullPath);
      console.log(`Removed hidden: ${fullPath}`);
      return;
    }

    if (entry.isDirectory()) {
      removeHiddenEntries(fullPath);
    }
  });
}

// Function to remove specified files and clean up directories
function cleanupFiles(dir, filesToRemove, dirsToClean, scriptName) {
  // Remove specified files
  filesToRemove.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath);
      console.log(`Removed: ${filePath}`);
    }
  });

  // Remove the packaging script
  const scriptPath = path.join(dir, scriptName);
  if (fs.existsSync(scriptPath)) {
    fs.removeSync(scriptPath);
    console.log(`Removed packaging script: ${scriptPath}`);
  }

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

  // Remove .cursor, .vscode, .cursorrules, .git, .DS_Store, and any other hidden entries
  removeHiddenEntries(dir);
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
        ignore: excludeFiles,
        dot: false,
      },
      { prefix: "uipress-lite" }
    );

    // Vite writes the runtime manifest to a hidden folder that glob skips when dot is false
    const viteManifestDir = path.join(sourceDir, "app", "dist", ".vite");
    if (fs.existsSync(viteManifestDir)) {
      archive.directory(viteManifestDir, "uipress-lite/app/dist/.vite");
    }

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
    cleanupFiles(
      uncompressedDir,
      ["package.json", "package-lock.json", "node_modules"],
      [{ dir: "app", except: ["dist"] }],
      scriptName
    );

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

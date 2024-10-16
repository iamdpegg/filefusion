# FileFusion

FileFusion is a desktop application designed to help users consolidate multiple files into a single document. This tool is particularly useful for preparing large codebases or collections of documents for input into Large Language Models (LLMs) or for easy review.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
7. [For Developers](#for-developers)

## Features

- **Directory Selection**: Choose the input directory containing the files you want to merge.
- **Output File Selection**: Specify where you want to save the consolidated file.
- **File Exclusion**: Use patterns to exclude specific files or directories from the merging process.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Status Updates**: Real-time logging of the merging process.

## Installation

To install FileFusion:

1. Go to the [Releases](https://github.com/iamdpegg/filefusion/releases) section of the GitHub repository.
2. Download the appropriate file for your operating system:
   - For macOS: Download the `.dmg` file (use arm64 for silicon-based Macs)
   - For Windows: Coming soon
3. Install the application:
   - On macOS: Open the `.dmg` file and drag FileFusion to your Applications folder
   - On Windows: Installation instructions will be provided when available

Note: We are actively working on Windows and Linux versions. Check back soon for updates!

## Usage

1. Launch FileFusion by running the executable.
2. Click "Select Input Directory" to choose the folder containing your files.
3. (Optional) Enter exclusion patterns in the text area, one per line (e.g., `*.json`, `.git/`).
4. Click "Select Output File Location" to specify where to save the merged file.
5. Click "Merge Files" to start the consolidation process.
6. Monitor the status log for progress updates and any potential issues.

## For Developers

If you want to work with the FileFusion source code, follow these steps:

### Prerequisites

- Node.js (version 12 or higher recommended)
- npm (usually comes with Node.js)

### Setting Up the Development Environment

1. Clone the repository:
   ```
   git clone https://github.com/iamdpegg/filefusion.git
   ```
2. Navigate to the project directory:
   ```
   cd filefusion
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the App in Development Mode

To start FileFusion in development mode, run:

```
npm start
```

### Building the App

FileFusion uses both electron-packager and electron-builder for creating distributable packages. Here are the available build commands:

#### Using electron-packager:

- For macOS:
  ```
  npm run package-mac
  ```
- For Windows:
  ```
  npm run package-win
  ```
- For macOS Universal (Apple Silicon and Intel):
  ```
  npm run package-mac-universal
  ```

#### Using electron-builder:

- For all platforms:
  ```
  npm run build
  ```
- For macOS (Intel):
  ```
  npm run build-mac-intel
  ```
- For macOS (Apple Silicon):
  ```
  npm run build-mac-silicon
  ```
- For Windows:
  ```
  npm run build-win
  ```

electron-builder provides more advanced packaging options and is configured to create distributable formats like DMG for macOS and NSIS installers for Windows.

### Acknowledgments

- Built with Electron
- Uses micromatch for file pattern matching
- Packaged with electron-packager and electron-builder

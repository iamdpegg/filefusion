// main.js

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const micromatch = require('micromatch');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
  createMenu(win);
}

function createMenu(win) {
  const template = [
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Toggle Dark Mode',
          click: () => {
            win.webContents.send('toggle-dark-mode');
          }
        },
        { type: 'separator' }
      ]
    },
    // {
    //   label: 'Edit',
    //   submenu: [
    //     { role: 'undo' },
    //     { role: 'redo' },
    //     { type: 'separator' },
    //     { role: 'cut' },
    //     { role: 'copy' },
    //     { role: 'paste' },
    //     { role: 'delete' },
    //     { role: 'selectAll' }
    //   ]
    // },
    // {
    //   label: 'View',
    //   submenu: [
    //     { role: 'reload' },
    //     { role: 'forceReload' },
    //     { role: 'toggleDevTools' },
    //     { type: 'separator' },
    //     { role: 'resetZoom' },
    //     { role: 'zoomIn' },
    //     { role: 'zoomOut' },
    //     { type: 'separator' },
    //     { role: 'togglefullscreen' }
    //   ]
    // },
    // {
    //   label: 'Window',
    //   submenu: [
    //     { role: 'minimize' },
    //     { role: 'zoom' },
    //     { role: 'close' }
    //   ]
    // }
  ];

  // Add macOS-specific menu items
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog({
    title: 'Select Output File',
    defaultPath: 'concatenated.txt',
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePath;
  }
});

ipcMain.handle('files:concatenate', async (event, data) => {
  const { inputDir, outputFile, exclude } = data;

  const isExcluded = (relativePath) => {
    return micromatch.isMatch(relativePath, exclude);
  };

  const getAllFiles = async (dir, baseDir) => {
    let files = [];
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (isExcluded(relativePath)) {
        event.sender.send('status:update', `Excluded: ${relativePath}`);
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, baseDir);
        files = files.concat(subFiles);
      } else if (entry.isFile()) {
        files.push({ fullPath, relativePath });
      }
    }
    return files;
  };

  try {
    const allFiles = await getAllFiles(inputDir, inputDir);
    event.sender.send('status:update', `Found ${allFiles.length} files to process.`);

    let concatenatedContent = '\ufeff'; // Add BOM for UTF-8

    for (const file of allFiles) {
      try {
        const content = await readFile(file.fullPath, 'utf8');
        concatenatedContent += `\n---\n${file.relativePath}\n---\n${content}\n`;
        event.sender.send('status:update', `Processed: ${file.relativePath}`);
      } catch (error) {
        event.sender.send('status:update', `Error reading ${file.relativePath}: ${error.message}`);
      }
    }

    await writeFile(outputFile, concatenatedContent, { encoding: 'utf8', flag: 'w' });
    return { success: true };
  } catch (error) {
    event.sender.send('status:update', `Error: ${error.message}`);
    throw error;
  }
});

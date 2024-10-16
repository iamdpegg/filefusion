// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  selectOutputFile: () => ipcRenderer.invoke('dialog:saveFile'),
  concatenateFiles: (data) => ipcRenderer.invoke('files:concatenate', data),
  onStatusUpdate: (callback) => ipcRenderer.on('status:update', callback),
  onToggleDarkMode: (callback) => ipcRenderer.on('toggle-dark-mode', callback)
});

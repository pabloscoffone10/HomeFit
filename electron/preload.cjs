const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('homefit', {
  platform: process.platform,
  openExternalVideo: (url) => ipcRenderer.invoke('open-external-video', url)
})

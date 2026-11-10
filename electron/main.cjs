const { app, BrowserWindow, ipcMain, shell } = require('electron')
const fs = require('fs')
const http = require('http')
const path = require('path')

let appServer

function startAppServer() {
  const root = path.resolve(__dirname, '../dist')
  return new Promise((resolve, reject) => {
    appServer = http.createServer((request, response) => {
      const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
      const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '')
      const filePath = path.resolve(root, relativePath)
      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403)
        response.end('Forbidden')
        return
      }
      const target = fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : path.join(root, 'index.html')
      const extension = path.extname(target).toLowerCase()
      const contentType = extension === '.js' ? 'text/javascript' : extension === '.css' ? 'text/css' : extension === '.svg' ? 'image/svg+xml' : extension === '.png' ? 'image/png' : 'text/html'
      response.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' })
      fs.createReadStream(target).pipe(response)
    })
    appServer.once('error', reject)
    appServer.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${appServer.address().port}`))
  })
}

function createWindow(appUrl) {
  const win = new BrowserWindow({ width: 1440, height: 900, minWidth: 1100, minHeight: 700, backgroundColor: '#f7f8fc', webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false } })
  if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL)
  else win.loadURL(appUrl)
}
app.whenReady().then(() => {
  ipcMain.handle('open-external-video', async (_event, rawUrl) => {
    const url = new URL(String(rawUrl))
    const allowedHosts = new Set(['youtube.com', 'www.youtube.com', 'youtu.be'])
    if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname.toLowerCase())) throw new Error('URL de video no permitida')
    await shell.openExternal(url.toString())
    return true
  })
  startAppServer().then((appUrl) => {
    createWindow(appUrl)
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(appUrl) })
  })
})
app.on('window-all-closed', () => { if (appServer) appServer.close(); if (process.platform !== 'darwin') app.quit() })

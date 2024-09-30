import { BrowserWindow, app, globalShortcut } from "electron";



export function createShortcuts(Window: BrowserWindow){
	app.on('browser-window-focus', () => {
		globalShortcut.register('CommandOrControl+N', () => {
			window.webContents.send('new-customer')
		})
	})
}
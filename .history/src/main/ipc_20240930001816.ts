import { app, ipcMain } from 'electron';

// Handle
ipcMain.handle('fetch-users', () => {
	return[
		{ id: 1, nome: 'Matheus' },
		{ id: 2, nome: 'Lucas' },
		{ id: 3, nome: 'Amanda' },
		{ id: 4, nome: 'Ana' },
	]
})


ipcMain.handle('get-version', () => {
	console.log('teste => ', app.getVersion())
	return app.getVersion();
})
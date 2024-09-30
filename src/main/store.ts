import { app, ipcMain } from 'electron'
import Pouchdb from 'pouchdb'
import path from 'node:path'
import fs from 'node:fs'
import { Customer, NewCustomer } from '../shared/types/ipc'
import { randomUUID } from 'node:crypto'

// Determinar o caminho base parar o banco de dados com base no sistema operacional
let dbPath;
if(process.platform === 'darwin'){
	// Caminho para o macos
	dbPath = path.join(app.getPath('appData'), 'devclientes', 'my_db')
}
else{
	// Caminho para windwos
	dbPath = path.join(app.getPath('userData'), 'my_db')
}

// Verificar e criar o diretório se não existir
const dbDir = path.dirname(dbPath)
if(!fs.existsSync(dbDir))
{
	fs.mkdirSync(dbDir, { recursive: true })
}

// Inicializar o db
const db = new Pouchdb<Customer>(dbPath)

// Função para adicionar novo cliente
async function addCutomer(doc: NewCustomer): Promise<PouchDB.Core.Response | void>{
	const id = randomUUID();
	
	const data: Customer = {
		...doc,
		_id: id
	}
	
	return db.put(data)
		.then(response => response)
		.catch(err => console.log('Erro ao cadastrar => ', err));
}

ipcMain.handle('add-customer', async (event, doc: Customer) => {
	const result = await addCutomer(doc);
	return result;
})

// Função para buscar todos os clientes
async function fetchAllCustomers(): Promise<Customer[]>{
	try{
		const result = await db.allDocs({ include_docs: true })
		return result.rows.map(row => row.doc as Customer)
	}catch(err){
		console.log('Erro ao buscar =>', err)
		return []
	}
}

ipcMain.handle('fetch-all-customer', async () => {
	return await fetchAllCustomers();
})

// Buscar cliente pelo id
async function fetchCustomerById(doc: string){
	return db.get(doc)
	.then(doc => doc as Customer)
	.catch(err => {
		console.log('Erro ao buscar pelo id => ', err)
		return null;
	});
}

ipcMain.handle('fetch-customer-id', async (event, docId) => {
	const result = await fetchCustomerById(docId);
	return result;
})

// Deletar um cliente
async function deleteCustomer(docId: string): Promise<PouchDB.Core.Response | null>{
	try{
		const doc = await db.get(docId)
		const result = await db.remove(doc._id, doc._rev)
		return result;
	}catch(err){
		console.log('Erro ao Deletar =>', err)
		return null
	}
}

ipcMain.handle('delete-customer', async (event, docId): Promise<PouchDB.Core.Response | null> => {
	const result = await deleteCustomer(docId);
	return result;
})
import Database from "better-sqlite3"

const db = new Database("tarefas.db")

db.exec(`
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    concluida INTEGER NOT NULL DEFAULT 0,
    criada_em TEXT NOT NULL DEFAULT (datetime('now'))
)        
`)

export default db
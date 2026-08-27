import express  from "express";
import db from './db.js';

const app = express (); //declarando minha aplicação

app.use(express.json()); //faz as respostas serem em json

app.get('/', (req, res) => {
    res.json({mensagem: 'API Tarefas está online!'});
});

app.post('/tarefas', (req, res) => {
    const {titulo, descricao} = req.body; //estamos dizendo que esses valores estao vindo do corpo da requisição
    if (!titulo || titulo.trim() === '')
    {
        return res.status(400).json({erro: 'O campo titulo é obrigatório'}); //resposta se erro
    }

    const insercao = db.prepare(
        'INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)'
        );
    
    const resultado = insercao.run(titulo, descricao ?? null); // ?? null (ternario) significa que se nao tiver nada em descricao ele vai colocar null no lugar
    const novaTarefa = db
    .prepare('SELECT * FROM tarefas WHERE id = ?')
    .get(resultado.lastInsertRowid);

    res.status(201).json(novaTarefa); //resposta

});


//metodo para pegar todos os registros, tradicionalmente get all
app.get('/tarefas', (req, res) => { 
    const tarefas = db.prepare('SELECT * FROM tarefas ORDER BY id').all();
    res.json(tarefas); //esse res é a resposta, nas outras linhas tambem
});

//metodo para pegar um registro, tradicionalmente get by id
app.get('/tarefas/:id', (req, res) => {
    const {id} = req.params;
    //tarefa para casa, fazer um if para validar se é um numero realmente que está chegando

    const tarefa = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(id); //coloca o .get(id) depois da query para o lugar do sinal de interrogação
    //fazer um if para validar se existe a tarefa. coloca o !tarefa para significar nao tarefa, ! para negar
    if (!tarefa)
    {
        return res.status(404).json({erro: 'Tarefa não encontrada'})
    }
    res.json(tarefa);
});

app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333'); //apenas informativo, nao é necessario ter esse console.log
});

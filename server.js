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

app.put('/tarefas/:id', (req, res) => {
    const {id} = req.params;
    const {titulo, descricao, concluida} = req.body;
    const tarefa = db.prepare('SELECT * FROM tarefas WHERE id = ?').get(id);

    //fazer um if para verificar se a tarefa existe
    if(!tarefa){
        return res.status(404).json({erro: 'Tarefa não encontrada'});
    }

    //fazer um if para verificar se tem titulo
    if (!titulo || titulo.trim() === '')
    {
        return res.status(400).json({erro: 'O campo titulo é obrigatório'}); //resposta se erro
    }

    //verifica se o campo é definido e se é um booleano. o definido é pq ele nao precisa passar, mas se passar tem que ser booleano
    if (concluida !== undefined && typeof concluida !== 'boolean')
    {
        return res.status(400).json({erro: 'O campo concluida deve ser um valor booleano'});
    }

    //o professor vem separando em linhas, o .run poderia estar na mesma linha, mas fiz como ele nesse, diferente dos anteriores.
    db.prepare('UPDATE tarefas SET titulo = ?, descricao = ?, concluida = ? WHERE id = ?')
    .run(titulo, descricao ?? null, concluida ? 1 : 0, id); // o ternario da concluida ta falando: "se tiver 1, beleza, se nao coloca um 0"

    //utiliza-se a quebra de linha para ficar mais legivel o codigo, tem que quebrar antes do ponto, e somente uma linha para nao quebrar a sintaxe
    const tarefaAtualizada = db
    .prepare('SELECT * FROM tarefas WHERE id = ?')
    .get(id);

    res.json(tarefaAtualizada);
});

app.delete('/tarefas/:id', (req, res) => {
    const {id} = req.params;
    const tarefa = db.prepare('SELECT * FROM tarefas WHERE id = ?')
    .get(id);

    if(!tarefa){
        return res.status(404).json({erro: 'Tarefa não encontrada'});
    }

    const resultado = db
    .prepare('DELETE FROM tarefas WHERE id = ?')
    .run(id);

    res.json({mensagem: 'Tarefa excluída com sucesso!'});
});

app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333'); //apenas informativo, nao é necessario ter esse console.log
});

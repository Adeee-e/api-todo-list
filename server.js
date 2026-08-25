import express  from "express";

const app = express (); //declarando minha aplicação

app.use(express.json()); //faz as respostas serem em json

app.get('/', (req, res) => {
    res.json({mensagem: 'API Tarefas está online!'});
});

app.post('/tarefas', (req, res)) =>{
    const {titulo, descricao} = req.body; //estamos dizendo que esses valores estao vindo do corpo da requisição
    if (!titulo || titulo.trim() === '')
    {
        return res.status(400).json({erro: 'O campo titulo é obrigatório'});
    }

    const insercao = db.prepare(
        'INSERT INTO tarefas (titulo, descricao) VALUES (?, ?)'
        );
    
}

app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333'); //apenas informativo, nao é necessario ter esse console.log
});

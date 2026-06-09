import Fastify from 'fastify';

const fastify = Fastify({
    logger: true // Mantém o log ativo para visualizar as requisições no terminal
});

// Banco de dados simulado em memória (Array de Objetos)
let cursos = [
    { id: "1", nome: "Logica de Programacao", disponivel: true },
    { id: "2", nome: "APIs com Node.js", disponivel: false }
];

// --- OPERAÇÕES CRUD ---

// 1. READ ALL (Buscar todos os cursos)
fastify.get('/cursos', async (request, reply) => {
    return cursos;
});

// 2. READ BY ID (Buscar um curso específico)
fastify.get('/cursos/:id', async (request, reply) => {
    const { id } = request.params;
    const curso = cursos.find(c => c.id === id);
    
    if (!curso) {
        return reply.code(404).send({ erro: "Curso nao encontrado" });
    }
    return curso;
});

// 3. CREATE (Criar um novo curso)
fastify.post('/cursos', async (request, reply) => {
    const { nome, disponivel } = request.body;
    
    const novoCurso = {
        id: String(cursos.length + 1),
        nome,
        disponivel: Boolean(disponivel)
    };
    
    cursos.push(novoCurso);
    return reply.code(201).send(novoCurso);
});

// 4. UPDATE (Atualizar dados de um curso existente)
fastify.put('/cursos/:id', async (request, reply) => {
    const { id } = request.params;
    const { nome, disponivel } = request.body;
    
    const cursoIndex = cursos.findIndex(c => c.id === id);
    
    if (cursoIndex === -1) {
        return reply.code(404).send({ erro: "Curso nao encontrado" });
    }
    
    cursos[cursoIndex] = {
        id,
        nome: nome || cursos[cursoIndex].nome,
        disponivel: disponivel !== undefined ? Boolean(disponivel) : cursos[cursoIndex].disponivel
    };
    
    return cursos[cursoIndex];
});

// 5. DELETE (Remover um curso do sistema)
fastify.delete('/cursos/:id', async (request, reply) => {
    const { id } = request.params;
    const cursoIndex = cursos.findIndex(c => c.id === id);
    
    if (cursoIndex === -1) {
        return reply.code(404).send({ erro: "Curso nao encontrado" });
    }
    
    cursos = cursos.filter(c => c.id !== id);
    return reply.code(204).send(); // Retorna 204 No Content (Sucesso sem corpo)
});

// Inicialização do Servidor HTTP
const start = async () => {
    try {
        // O servidor escuta na porta 3000
        await fastify.listen({ port: 3000 });
        console.log('Servidor rodando com sucesso na porta 3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
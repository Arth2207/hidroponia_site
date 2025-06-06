CREATE TABLE restaurantes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20),
    telefone VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('admin', 'funcionario', 'cliente')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restaurante_id INT,
    reset_token TEXT,
    reset_token_expires TIMESTAMP,
    CONSTRAINT fk_usuario_restaurante FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE SET NULL
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    unidade VARCHAR(10) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    restaurante_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_entrega DATE NOT NULL,
    comprovante TEXT,
    status VARCHAR(30) NOT NULL CHECK (status IN ('pendente', 'separado', 'entregue')),
    CONSTRAINT fk_pedido_restaurante FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade NUMERIC NOT NULL CHECK (quantidade > 0),
    observacoes TEXT,
    CONSTRAINT fk_item_pedido_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_pedido_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INT,
    acao TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE avisos (
    id SERIAL PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE
);

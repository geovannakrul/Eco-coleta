SQL


CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco_rua VARCHAR(150) NOT NULL,
    endereco_numero VARCHAR(10) NOT NULL,
    endereco_bairro VARCHAR(50) NOT NULL
);

CREATE TABLE PontoColeta (
    id_ponto INT PRIMARY KEY,
    nome_local VARCHAR(100) NOT NULL UNIQUE,
    horario_funcionamento VARCHAR(100) NOT NULL
);

CREATE TABLE Material (
    id_material INT PRIMARY KEY,
    nome_material VARCHAR(50) NOT NULL UNIQUE,
    pontos_por_kg INT NOT NULL
);

CREATE TABLE Agendamento (
    id_agendamento INT PRIMARY KEY,
    data_agendamento DATE NOT NULL,
    id_usuario INT NOT NULL,
    id_ponto INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_ponto) REFERENCES PontoColeta(id_ponto)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE ItemColetado (
    id_item INT PRIMARY KEY,
    quantidade_kg DECIMAL(6,2) NOT NULL,
    pontos_acumulados INT NOT NULL,
    id_agendamento INT NOT NULL,
    id_material INT NOT NULL,
    FOREIGN KEY (id_agendamento) REFERENCES Agendamento(id_agendamento)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_material) REFERENCES Material(id_material)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE Parceiro (
    id_parceiro INT PRIMARY KEY,
    nome_parceiro VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(50) NOT NULL,
    contato VARCHAR(100)
);

CREATE TABLE RecompensaDesconto (
    id_recompensa INT PRIMARY KEY,
    id_parceiro INT NOT NULL,
    titulo_recompensa VARCHAR(100) NOT NULL,
    pontos_necessarios INT NOT NULL,
    valor_desconto DECIMAL(6,2) NOT NULL,
    FOREIGN KEY (id_parceiro) REFERENCES Parceiro(id_parceiro)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE ResgateCupom (
    id_resgate INT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_recompensa INT NOT NULL,
    data_resgate DATE NOT NULL,
    codigo_cupom VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_recompensa) REFERENCES RecompensaDesconto(id_recompensa)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

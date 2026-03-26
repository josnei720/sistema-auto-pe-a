-- CreateTable
CREATE TABLE "auto_pecas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imagem_id" TEXT,
    "nome_produto" TEXT NOT NULL,
    "marca_veiculo" TEXT,
    "aplicacao_veiculos" TEXT,
    "aplicacao_ano_modelo" TEXT,
    "preco_custo" REAL,
    "preco_venda" REAL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "data_cadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

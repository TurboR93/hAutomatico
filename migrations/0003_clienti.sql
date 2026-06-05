-- Migrazione: anagrafica clienti + collegamento dei movimenti al cliente.
--
-- Esecuzione:
--   locale:  wrangler d1 execute hautomatico-db --local  --file=./migrations/0003_clienti.sql
--   remoto:  wrangler d1 execute hautomatico-db --remote --file=./migrations/0003_clienti.sql

CREATE TABLE IF NOT EXISTS clienti (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  email       TEXT,
  telefono    TEXT,
  piva_cf     TEXT,          -- Partita IVA o Codice Fiscale
  indirizzo   TEXT,
  note        TEXT,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_clienti_nome ON clienti(nome);

ALTER TABLE movimenti ADD COLUMN cliente_id TEXT REFERENCES clienti(id);
CREATE INDEX IF NOT EXISTS idx_movimenti_cliente_id ON movimenti(cliente_id);

-- Migrazione: collega un movimento (incasso) a un preventivo.
-- Il residuo del preventivo = imponibile - somma dei NETTI dei movimenti collegati
-- effettivamente incassati (i preventivi sono riferiti all'incasso effettivo).
--
-- Esecuzione:
--   locale:  wrangler d1 execute hautomatico-db --local  --file=./migrations/0002_preventivo_link.sql
--   remoto:  wrangler d1 execute hautomatico-db --remote --file=./migrations/0002_preventivo_link.sql

ALTER TABLE movimenti ADD COLUMN preventivo_id TEXT REFERENCES movimenti(id);
CREATE INDEX IF NOT EXISTS idx_movimenti_preventivo_id ON movimenti(preventivo_id);

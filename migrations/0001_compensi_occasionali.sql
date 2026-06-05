-- Migrazione: il tipo 'ritenuta' passa da "tassa da versare collegata a fattura"
-- a "compenso da prestazione occasionale" (privato senza P.IVA).
--   - La ritenuta d'acconto la versa il committente, non l'utente: niente più
--     stati 'da_versare'/'versata' -> diventano 'da_incassare'/'incassato'.
--   - Nessun collegamento a fattura: azzera fattura_id sui compensi.
--
-- Esecuzione:
--   locale:  wrangler d1 execute hautomatico-db --local  --file=./migrations/0001_compensi_occasionali.sql
--   remoto:  wrangler d1 execute hautomatico-db --remote --file=./migrations/0001_compensi_occasionali.sql

UPDATE movimenti SET stato = 'incassato'    WHERE tipo = 'ritenuta' AND stato = 'versata';
UPDATE movimenti SET stato = 'da_incassare' WHERE tipo = 'ritenuta' AND stato = 'da_versare';
UPDATE movimenti SET fattura_id = NULL      WHERE tipo = 'ritenuta' AND fattura_id IS NOT NULL;

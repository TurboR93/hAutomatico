-- hAutomatico — Area Amministrazione
-- Schema D1 (SQLite). Esecuzione:
--   locale:    wrangler d1 execute hautomatico-db --local  --file=./schema.sql
--   remoto:    wrangler d1 execute hautomatico-db --remote --file=./schema.sql
--
-- Tabella unica `movimenti` con discriminatore `tipo`.
-- Tutti gli importi sono in CENTESIMI interi (no float) per la contabilita'.
-- Struttura fiscale italiana: imponibile (+ contributo cassa) + IVA - ritenuta d'acconto.
--   totale_cents = imponibile + cassa + iva            -> Totale documento (lordo)
--   netto_cents  = totale - ritenuta                   -> Netto a pagare / incassare

CREATE TABLE IF NOT EXISTS movimenti (
  id              TEXT PRIMARY KEY,              -- crypto.randomUUID()
  tipo            TEXT NOT NULL,                 -- 'pagamento'|'fattura_emessa'|'fattura_ricevuta'|'ritenuta'|'preventivo'
                                                 -- 'ritenuta' = compenso da prestazione occasionale (privato senza P.IVA):
                                                 --  imponibile=lordo, ritenuta=20% (la versa il committente), netto=bonifico incassato
  controparte     TEXT,                          -- cliente o fornitore
  descrizione     TEXT,
  numero          TEXT,                          -- numero fattura/preventivo (opzionale)
  data            TEXT,                          -- ISO 'YYYY-MM-DD' (data documento/competenza)
  data_scadenza   TEXT,                          -- ISO, opzionale (fatture)
  data_pagamento  TEXT,                          -- ISO, opzionale (quando incassata/pagata)

  -- Importi in CENTESIMI interi; le percentuali sono REAL (ammettono decimali,
  -- es. ritenuta agenti effettiva 11,5% o casse 2%).
  imponibile_cents      INTEGER NOT NULL DEFAULT 0,  -- compenso / base
  cassa_percentuale     REAL NOT NULL DEFAULT 0,     -- contributo previdenziale/cassa, es. 4 = 4%
  cassa_cents           INTEGER NOT NULL DEFAULT 0,
  iva_percentuale       REAL NOT NULL DEFAULT 0,     -- es. 22 = 22% (0 = forfettario/esente)
  iva_cents             INTEGER NOT NULL DEFAULT 0,
  ritenuta_percentuale  REAL NOT NULL DEFAULT 0,     -- es. 20 = 20%
  ritenuta_cents        INTEGER NOT NULL DEFAULT 0,
  totale_cents          INTEGER NOT NULL DEFAULT 0,  -- imponibile + cassa + iva (Totale documento)
  netto_cents           INTEGER NOT NULL DEFAULT 0,  -- totale - ritenuta (Netto a pagare/incassare)

  stato           TEXT,                          -- macchina a stati per tipo (validata server-side)
  fattura_id      TEXT REFERENCES movimenti(id), -- soft FK (legacy, non più usato dai compensi)
  preventivo_id   TEXT REFERENCES movimenti(id), -- soft FK: incasso -> preventivo collegato
  cliente_id      TEXT REFERENCES clienti(id),   -- soft FK: movimento -> cliente in anagrafica
  note            TEXT,

  ricorrenza        TEXT NOT NULL DEFAULT 'una_tantum', -- 'una_tantum'|'mensile'|'annuale'
  prossimo_rinnovo  TEXT,                               -- ISO 'YYYY-MM-DD', prossima scadenza/rinnovo

  created_at      INTEGER NOT NULL,              -- epoch ms
  updated_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_movimenti_tipo       ON movimenti(tipo);
CREATE INDEX IF NOT EXISTS idx_movimenti_stato      ON movimenti(tipo, stato);
CREATE INDEX IF NOT EXISTS idx_movimenti_data       ON movimenti(data);
CREATE INDEX IF NOT EXISTS idx_movimenti_fattura_id ON movimenti(fattura_id);
CREATE INDEX IF NOT EXISTS idx_movimenti_preventivo_id ON movimenti(preventivo_id);
CREATE INDEX IF NOT EXISTS idx_movimenti_cliente_id ON movimenti(cliente_id);

-- Anagrafica clienti. I movimenti vi puntano via movimenti.cliente_id (soft FK).
CREATE TABLE IF NOT EXISTS clienti (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  email       TEXT,
  telefono    TEXT,
  piva_cf     TEXT,                          -- Partita IVA o Codice Fiscale
  indirizzo   TEXT,
  note        TEXT,
  created_at  INTEGER NOT NULL,              -- epoch ms
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_clienti_nome ON clienti(nome);

-- Anti brute-force sul login: conteggio tentativi falliti per IP.
CREATE TABLE IF NOT EXISTS login_attempts (
  ip           TEXT PRIMARY KEY,
  fails        INTEGER NOT NULL DEFAULT 0,
  first_fail   INTEGER,        -- epoch ms del primo tentativo della finestra
  locked_until INTEGER         -- epoch ms fino a cui l'IP e' bloccato
);

-- Allegati (documenti) collegati a un movimento. I file stanno su R2; qui i metadati.
CREATE TABLE IF NOT EXISTS allegati (
  id            TEXT PRIMARY KEY,
  movimento_id  TEXT NOT NULL,
  filename      TEXT NOT NULL,
  content_type  TEXT,
  size          INTEGER NOT NULL DEFAULT 0,   -- byte
  r2_key        TEXT NOT NULL,                -- chiave oggetto su R2
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_allegati_movimento ON allegati(movimento_id);

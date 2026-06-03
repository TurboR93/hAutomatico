# Area Amministrazione (gestionale)

Area riservata per tracciare pagamenti, fatture (emesse e ricevute), ritenute
d'acconto e preventivi, con una panoramica economica del business.

- **Frontend**: stesse tecnologie del sito (React + Vite + Tailwind), montato in
  `src/admin/`. Sul sottodominio `amministrazione.hautomatico.com` l'app mostra il
  gestionale; sul dominio pubblico mostra il sito normale (vedi `src/main.tsx`).
- **Backend**: Cloudflare Pages Functions in `functions/api/*` + database **D1**
  (SQLite). Schema in `schema.sql`.
- **Accesso**: una sola password, verificata lato server (hash PBKDF2) con cookie
  di sessione firmato (HMAC). La password non è mai nel codice né nel browser.

---

## 1. Setup iniziale su Cloudflare (una tantum)

> Serve la CLI `wrangler` (già fra le devDependencies): usa `npx wrangler ...`.

1. **Crea il database D1**
   ```bash
   npx wrangler d1 create hautomatico-db
   ```
   Copia il `database_id` restituito dentro `wrangler.toml` al posto di
   `REPLACE_WITH_DATABASE_ID`, poi committa.

2. **Crea le tabelle sul DB remoto**
   ```bash
   npm run db:remote
   ```

3. **Collega D1 al progetto Pages**
   Dashboard Cloudflare → progetto Pages → *Settings → Functions → D1 database
   bindings* → aggiungi binding con **Variable name `DB`** → database
   `hautomatico-db` (sia Production che Preview).

4. **Imposta i secret** (Pages → *Settings → Environment variables*, tipo
   **Secret**, per Production e Preview). Generali con:
   ```bash
   npm run hash-password
   ```
   Lo script chiede la password (minimo **12 caratteri**) e stampa due valori da
   incollare:
   - `ADMIN_PASSWORD_HASH`
   - `AUTH_SECRET`

5. **Aggiungi il sottodominio**
   Pages → *Custom domains* → aggiungi `amministrazione.hautomatico.com`
   (Cloudflare crea il record da solo). Attendi che l'SSL sia attivo.

6. **Pubblica**: fai push su `main`. Cloudflare deploya sito + Functions + binding.
   Vai su `https://amministrazione.hautomatico.com`, inserisci la password e usa
   il gestionale.

Per cambiare password in futuro: ri-esegui `npm run hash-password` e aggiorna il
secret `ADMIN_PASSWORD_HASH` su Cloudflare (l'`AUTH_SECRET` puoi lasciarlo; se lo
cambi, dovrai rifare il login).

---

## 2. Sviluppo locale

1. Crea il file `.dev.vars` nella root (è in `.gitignore`) con i secret di test:
   ```
   ADMIN_PASSWORD_HASH='...'   # da: npm run hash-password
   AUTH_SECRET='...'
   ```
2. Crea le tabelle nel D1 locale:
   ```bash
   npm run db:local
   ```
3. Avvia (due terminali):
   ```bash
   npm run dev        # Vite su :5173
   npm run pages:dev  # Wrangler su :8788 (API + D1 + proxy verso Vite)
   ```
4. Apri **http://localhost:8788/?admin=1** per vedere il gestionale in locale
   (il flag `?admin=1` resta memorizzato per la sessione del browser).

Solo-UI senza backend: `npm run dev` e apri `http://localhost:5173/?admin=1`
(le chiamate alle API falliranno, ma l'interfaccia si vede).

---

## 3. Modello dati

Tutto è salvato nella tabella `movimenti`, distinta dal campo `tipo`:
`pagamento`, `fattura_emessa`, `fattura_ricevuta`, `ritenuta`, `preventivo`.

Importi in **centesimi interi**. Calcolo (coerente con le fatture italiane):

```
imponibile (compenso)
  + cassa     = imponibile × cassa %        (contributo previdenziale, opzionale)
  base IVA    = imponibile + cassa
  + IVA       = base IVA × IVA %
  − ritenuta  = imponibile × ritenuta %     (ritenuta d'acconto sul compenso)
  = Totale documento = imponibile + cassa + IVA
  = Netto a pagare   = Totale documento − ritenuta
```

Regime forfettario: imposta IVA % = 0 e ritenuta % = 0.

Le percentuali ammettono **decimali** (es. ritenuta effettiva 11,5% sulle
provvigioni agenti, contributi cassa non interi). I centesimi risultanti sono
sempre arrotondati al centesimo.

**Ritenute d'acconto e doppio conteggio.** Puoi indicare la ritenuta in due modi:
direttamente sulla *fattura emessa* (campo "Ritenuta %"), oppure come voce a sé
nella pagina *Ritenute*. Nella panoramica, il totale "Ritenute d'acconto"
somma le ritenute delle fatture emesse + le ritenute a sé **non collegate** a una
fattura. Quindi, se colleghi una voce *Ritenuta* a una fattura, vale quella della
fattura (niente doppio conteggio); se invece registri una ritenuta non presente su
nessuna fattura, lasciala **scollegata** così viene conteggiata.

Il login è protetto da un limite anti tentativi ripetuti (max 8 errori per IP, poi
blocco temporaneo) — la tabella `login_attempts` viene creata dallo schema.

---

## 4. API (tutte sotto `/api/`, protette dal cookie tranne login/session)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| POST | `/api/login` | `{password}` → cookie di sessione |
| POST | `/api/logout` | cancella il cookie |
| GET | `/api/session` | `{authenticated}` |
| GET/POST | `/api/records` | elenco filtrabile / crea |
| GET/PUT/PATCH/DELETE | `/api/records/:id` | dettaglio / modifica / stato / elimina |
| GET | `/api/summary` | KPI panoramica + serie mensile |
| GET | `/api/export?format=json\|csv` | backup completo |

Backup consigliato: dalla Panoramica, pulsanti **CSV** e **Backup JSON**.

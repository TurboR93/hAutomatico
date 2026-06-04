# Area Amministrazione (gestionale)

Area riservata per tracciare pagamenti, fatture (emesse e ricevute), ritenute
d'acconto e preventivi, con allegati documentali e una panoramica economica.

**In produzione:** https://amministrazione.hautomatico.com

- **Frontend**: React + Vite + Tailwind, in `src/admin/`. L'app sceglie cosa
  mostrare in base all'hostname (`src/main.tsx`): sul sottodominio
  `amministrazione.*` monta il gestionale, altrimenti il sito pubblico (invariato).
- **Backend**: Cloudflare Pages Functions in `functions/api/*`.
- **Dati**: database **D1** (`hautomatico-db`) per i record; **R2**
  (`hautomatico-docs`) per i file allegati. Schema in `schema.sql`.
- **Accesso**: una sola password, verificata lato server (hash PBKDF2) con cookie
  di sessione firmato (HMAC) + limite anti brute-force. La password non è mai nel
  codice né nel browser.

> ⚠️ **Importante sul deploy:** il progetto Pages `hautomatico` **non è collegato a
> GitHub** — si pubblica **da terminale** con `npm run deploy` (vedi sotto), non con
> un `git push`. Il push su GitHub serve solo come backup del codice sorgente.

---

## 1. Deploy / aggiornamenti (operazione tipica)

Per pubblicare una modifica già pronta:

```bash
npx wrangler login      # solo la prima volta sulla macchina
npm run deploy          # build + wrangler pages deploy dist
```

`npm run deploy` esegue `tsc && vite build` e poi carica `dist/` (con le Functions
in `functions/` e `public/_routes.json`) sul progetto Pages di produzione.

> Le **modifiche allo schema** (`schema.sql`) vanno applicate a parte con
> `npm run db:remote`. I **secret** vanno (re)impostati come al punto 4 e diventano
> attivi **solo dopo un nuovo deploy**.

---

## 2. Setup iniziale (già fatto — per riferimento / disaster recovery)

1. **Database D1**
   ```bash
   npx wrangler d1 create hautomatico-db      # -> copia database_id in wrangler.toml
   npm run db:remote                          # crea le tabelle sul DB remoto
   ```
2. **Bucket R2** (richiede R2 abilitato dal pannello: *R2 Object Storage → Enable*;
   serve registrare una carta, ma è gratis entro 10 GB)
   ```bash
   npx wrangler r2 bucket create hautomatico-docs
   ```
   Il binding `DOCS` è già in `wrangler.toml` e viene applicato a ogni deploy.
3. **Secret** (vedi punto 4) e **deploy** (`npm run deploy`).
4. **Sottodominio** (vedi punto 5).

Binding e risorse sono dichiarati in `wrangler.toml` (`DB` per D1, `DOCS` per R2).

---

## 3. Modello dati

Tutto nella tabella `movimenti`, distinta dal campo `tipo`: `pagamento`,
`fattura_emessa`, `fattura_ricevuta`, `ritenuta`, `preventivo`.
Importi in **centesimi interi**; percentuali con decimali. Calcolo (fatture IT):

```
imponibile (compenso)
  + cassa     = imponibile × cassa %        (contributo previdenziale, opzionale)
  base IVA    = imponibile + cassa
  + IVA       = base IVA × IVA %
  − ritenuta  = imponibile × ritenuta %     (ritenuta d'acconto sul compenso)
  = Totale documento = imponibile + cassa + IVA
  = Netto a pagare   = Totale documento − ritenuta
```
Regime forfettario: IVA % = 0 e ritenuta % = 0.

Gli **allegati** (PDF/scansioni) sono su R2; in D1 (tabella `allegati`) restano solo
i metadati. Limite 10 MB per file. Eliminando un movimento si eliminano anche i suoi
allegati. Gli allegati NON sono inclusi nell'export CSV/JSON (che riguarda i dati).

---

## 4. Password e secret

Genera i valori:
```bash
npm run hash-password      # chiede la password (min 12 caratteri)
```
Stampa `ADMIN_PASSWORD_HASH` e un `AUTH_SECRET`. Impostali come **secret** di Pages.
Metodo affidabile (un JSON, niente newline parassiti):
```bash
# crea un file secrets.json: {"ADMIN_PASSWORD_HASH":"...","AUTH_SECRET":"..."}
npx wrangler pages secret bulk secrets.json --project-name=hautomatico
rm secrets.json
npm run deploy             # i secret diventano attivi dopo il deploy
```
> ⚠️ **PBKDF2 = 100000 iterazioni** (massimo consentito da Cloudflare Workers; oltre,
> `crypto.subtle.deriveBits` fallisce e il login va sempre in errore). `hash-password.mjs`
> è già impostato così.
> ⚠️ Usa `secret bulk` con un file JSON, non `secret put` da stdin (rischio di un
> carattere a-capo finale che corrompe il valore).

Per cambiare password: rigenera l'hash, ri-esegui `secret bulk` (solo
`ADMIN_PASSWORD_HASH`) e `npm run deploy`.

---

## 5. Sottodominio (custom domain)

Non c'è un comando CLI affidabile in wrangler 3.x. Servono **due** cose:

1. **Aggiungere il dominio al progetto Pages**: pannello → Workers & Pages →
   `hautomatico` → *Custom domains* → `amministrazione.hautomatico.com`.
   (In alternativa via API: `POST /accounts/{acct}/pages/projects/hautomatico/domains`
   con `{"name":"amministrazione.hautomatico.com"}` — l'oauth di wrangler ha i permessi
   Pages.)
2. **Creare il record DNS**: pannello → dominio `hautomatico.com` → DNS → Add record:
   - Type `CNAME`, Name `amministrazione`, Target `hautomatico.pages.dev`,
     **Proxied** (nuvola arancione).
   (L'oauth di wrangler NON ha permessi DNS write, quindi questo va fatto dal pannello.)

Il dominio diventa `active` da solo entro pochi minuti. Nota: i resolver pubblici
possono tenere in cache il "non esiste" fino a ~30 min (SOA min 1800s) — è normale.

---

## 6. Sviluppo locale

1. `.dev.vars` nella root (in `.gitignore`) con i secret di test:
   ```
   ADMIN_PASSWORD_HASH='...'   # da npm run hash-password
   AUTH_SECRET='...'
   ```
2. `npm run db:local` — crea le tabelle nel D1 locale.
3. In due terminali: `npm run dev` (Vite :5173) e `npm run pages:dev`
   (Wrangler :8788, con D1 e R2 simulati + proxy verso Vite).
4. Apri **http://localhost:8788/?admin=1** (il flag resta per la sessione).

---

## 7. API (sotto `/api/`, protette dal cookie tranne login/session)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| POST | `/api/login` | `{password}` → cookie (con throttle anti brute-force) |
| POST | `/api/logout` | cancella il cookie |
| GET | `/api/session` | `{authenticated}` |
| GET/POST | `/api/records` | elenco filtrabile / crea |
| GET/PUT/PATCH/DELETE | `/api/records/:id` | dettaglio / modifica / stato / elimina |
| GET/POST | `/api/records/:id/allegati` | elenco / upload (multipart, campo `file`) |
| GET/DELETE | `/api/allegati/:id` | scarica (`?dl=1` per download) / elimina |
| GET | `/api/summary` | KPI panoramica + serie mensile |
| GET | `/api/export?format=json\|csv` | backup dei dati |

---

## 8. Risorse Cloudflare (account riccardo@hautomatico.com)

- Pages project: `hautomatico` (direct upload)
- D1: `hautomatico-db` (id in `wrangler.toml`)
- R2 bucket: `hautomatico-docs` (binding `DOCS`)
- Secret: `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`
- Dominio: `amministrazione.hautomatico.com` (CNAME proxied → `hautomatico.pages.dev`)

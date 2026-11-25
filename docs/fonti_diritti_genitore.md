# Matrice regola → fonte

Guida: [`guida_diritti_medico_genitore.html`](../guida_diritti_medico_genitore.html). Le regole e i parametri della pagina stanno nel JSON `<script id="dati">`; questa tabella dice da dove viene ciascuna.

Data di verifica di tutte le righe: **25/11/2026**, salvo diversa indicazione.

Abbreviazioni: TU = D.Lgs. 151/2001; CCNL 2024 = CCNL Area Sanità 23/1/2024 (triennio 2019-2021); CCNL 2026 = CCNL Area Sanità 27/2/2026 (triennio 2022-2024); CCNL 2019 = CCNL Area Sanità 19/12/2019 (triennio 2016-2018).

## Da dove ho letto i testi

| Fonte | Letta da | Note |
|---|---|---|
| TU, testo vigente | Normattiva, pagina di ogni articolo (`…;151~artN`), con note di aggiornamento | Lettura diretta. Ogni link della pagina apre l'articolo |
| D.Lgs. 105/2022 | Effetti letti nel testo vigente del TU su Normattiva + circ. INPS 122/2022 | Non ho letto il decreto in sé: tutte le sue modifiche sono nel TU vigente |
| L. 197/2022 c. 359; L. 213/2023 c. 179; L. 207/2024 cc. 217-218 | Note di aggiornamento (48), (49), (51) all'art. 34 TU su Normattiva, che riportano il testo delle clausole di decorrenza; circ. INPS 95/2025 | Lettura indiretta ma testuale |
| L. 199/2025 cc. 219-220 | Testo vigente artt. 32, 33, 34, 36, 47 TU su Normattiva («Testo in vigore dal 1-1-2026»); messaggio INPS 251/2026 per il c. 219 | La pagina Normattiva della legge non ha caricato l'art. 1 dalla sandbox: il numero del c. 220 (malattia del figlio) viene da fonti secondarie (Ipsoa, Edotto) |
| CCNL 2024 | Copia del testo in GU (SG n. 59 dell'11/3/2024) pubblicata da Anaao: `anaao.it/public/aaa_9348614_testogu.pdf` | Pagina ufficiale ARAN verificata (esiste ed è il triennio giusto); il testo l'ho letto dalla copia sindacale |
| CCNL 2026 | Copia del testo firmato il 27/2/2026 pubblicata da Anaao: `anaao.it/public/aaa_2476166_2026.02.27-ccnl-area-sanita-2022-2024.pdf` | Art. 3 (Conferme): restano in vigore le norme del CCNL 2024 e precedenti non disapplicate. Non tocca congedi, guardie, pronta disponibilità, lavoro agile |
| CCNL 2019 | Copia del testo ARAN pubblicata dall'Università di Perugia: `unipg.it/files/pagine/1275/ccnl-2016-2018.pdf` | Serve per l'area 2 (art. 110, part-time), ancora vigente: lo richiama il CCNL 2024 |
| Nota DFP 27/3/2023 | PDF protocollato DFP-0020810-P pubblicato da lentepubblica.it | Copia della nota originale, destinataria un'Azienda socio-sanitaria |
| Circ. INPS 122/2022 | PDF copia pubblicata dall'Università di Palermo | Link della pagina alla scheda INPS ufficiale |
| Circ. INPS 95/2025, msg. INPS 251/2026 | PDF ufficiali INPS | Lettura diretta |
| Parere ARAN sui 30 giorni oltre i 6 anni | Solo commento Anaao (`anaao.it/content.php?cont=38975`) | Indizio, non fonte primaria: il parere non l'ho trovato |
| Cass. 17192/2024 (link 28 del file di partenza) | Banca dati pubblica della Cassazione (Italgiure) | Cass. civ. n. 17192/2024 è un'ordinanza della III sezione civile (21/6/2024) su una fornitura di funghi; la n. 17192/2024 penale è un'inammissibilità. Nessuna delle due riguarda i medici genitori. La pagina Anaao del link è riservata agli iscritti. **Non usata**: va chiesto ad Anaao a quale pronuncia si riferisce |

## Area 1 — Congedi e permessi (completa)

| Regola (id nel JSON) | Articolo e comma | Modificata da | Condizioni | Data che decide | Regime |
|---|---|---|---|---|---|
| `maternita` | TU art. 16 c. 1 lett. a-d, c. 1.1; art. 20 c. 1; art. 22 c. 1, 3; art. 2 c. 2. CCNL 2024 art. 41 c. 2, art. 59 c. 2 lett. c, art. 87 c. 9 | c. 1.1 da L. 145/2018 (dal 1/1/2019) | Dipendente; flessibilità e "tutto dopo" solo con attestazioni del ginecologo SSN e del medico competente | Data presunta e data effettiva del parto | Unico vigente |
| `maternita-casi` | TU art. 16-bis; art. 16 c. 1-bis | D.Lgs. 80/2015 | Ricovero del neonato: una volta per figlio, certificato medico | Date di ricovero e dimissione | Dal 24/9/2015 |
| `interdizione` | TU artt. 7, 8, 12, 17, 53 c. 1; CCNL 2024 art. 41 c. 2 (trattamento) | Art. 17 da D.L. 5/2012 | ASL per complicanze, ITL per rischi del lavoro | Accertamento gravidanza; parto (+7 mesi) | Dal 1/4/2012 |
| `paternita` | TU art. 27-bis cc. 1-6; art. 29 c. 1; CCNL 2024 art. 41 c. 2; circ. INPS 122/2022 par. 2 e 2.2 | D.Lgs. 105/2022; Corte cost. 115/2025 | Padre dipendente; anche adottivo/affidatario; madre intenzionale in coppia di donne | Data presunta e data di nascita (adozione: ingresso) | Dal 13/8/2022 |
| `paternita-alternativa` | TU art. 28 cc. 1, 1-bis, 2; art. 29 c. 2 | D.Lgs. 105/2022 (rubrica) | Morte, grave infermità, abbandono della madre, affidamento esclusivo | Data dell'evento | Dal 13/8/2022 |
| `parentale` | TU art. 32 cc. 1, 1-bis, 1-ter, 2, 3, 4; art. 34 cc. 1, 3, 5; art. 35; CCNL 2024 art. 41 cc. 3, 5, 6, 7 | D.Lgs. 105/2022; L. 199/2025 c. 219 (14 anni) | Genitore dipendente; spetta anche se l'altro non ne ha diritto | Data d'uso (12 o 14 anni); nascita/ingresso | 12 anni per giorni fino al 31/12/2025; 14 anni dal 1/1/2026 (msg. INPS 251/2026: vale anche per figli che avevano già compiuto 12 anni) |
| `parentale-80` | TU art. 34 c. 1; L. 197/2022 c. 359; L. 213/2023 c. 179; L. 207/2024 cc. 217-218; circ. INPS 95/2025 par. 2-3; nota DFP 27/3/2023; CCNL 2024 art. 41 c. 3 | Tre leggi di bilancio | Dipendenti; entro 6 anni; dentro i 3 mesi non trasferibili di ciascun genitore | Data di nascita/ingresso e fine maternità/paternità (anche obbligatoria) di un genitore dipendente | 0/1/2/3 mesi: tabella nella pagina. **Da verificare**: cumulo con i 30 gg CCNL |
| `riposi` | TU artt. 39, 40, 41, 43, 45 | Corte cost. 104/2003 (art. 45) | Padre: lett. a-d dell'art. 40 | Nascita/ingresso | Unico vigente |
| `malattia-figlio` | TU art. 47 cc. 1-6; art. 48; art. 49; art. 50; CCNL 2024 art. 41 cc. 4-5 | L. 199/2025 c. 220 (10 giorni, 14 anni) | Certificato del pediatra SSN | Data d'uso; età del figlio | 5 gg 3-8 anni fino al 31/12/2025; 10 gg 3-14 anni dal 1/1/2026. **Da verificare**: anno solare o di età |
| `notte` | TU art. 53 cc. 1, 2 lett. a, b, b-bis, 3; CCNL 2024 art. 29 | D.Lgs. 105/2022 (lett. b-bis e c. 3-bis) | Esonero a richiesta | Nascita/ingresso, età | Dal 13/8/2022 |
| `tutele` | TU art. 54 cc. 1, 3, 6, 7, 9; art. 56 | D.Lgs. 105/2022 | — | Inizio gravidanza; nascita | Dal 13/8/2022 |
| `tempo-determinato` | TU art. 24 cc. 1-2; art. 54 c. 3 lett. c; CCNL 2024 art. 85 c. 1 lett. g | — | Contratto a termine | Scadenza del contratto rispetto alla maternità | **Da verificare**: chi paga dopo la scadenza |

### Combinazione CCNL ↔ legge (area 1)

| Istituto | Legge | CCNL dirigenza | Come si combinano | Fonte della combinazione |
|---|---|---|---|---|
| Maternità, paternità obbligatoria e alternativa | 80% (maternità), 100% (paternità) | Retribuzione art. 59 c. 2 lett. c | Il CCNL sostituisce l'indennità (art. 2 c. 2 TU: per le PA le indennità «corrispondono» ai trattamenti contrattuali e non possono essere inferiori) | TU art. 2 c. 2; CCNL 2024 art. 41 c. 2 |
| Congedo parentale, primi 30 giorni | 30% o 80% | 100%, 30 giorni per la coppia | Fanno parte dei mesi di legge (non sono giorni in più di congedo). Sul mese all'80%: assorbito secondo DFP | Nota DFP 27/3/2023; CCNL art. 41 c. 3 («nell'ambito del congedo parentale») |
| Congedo parentale, 2° e 3° mese all'80% | 80% | Nessuna previsione | Si applicano anche ai dirigenti SSN, pagati dall'Azienda | Circ. INPS 95/2025 (per i pubblici: «a cura dell'Amministrazione»); art. 2 c. 2 TU |
| Malattia del figlio sotto i 3 anni | Non retribuita | 30 gg/anno al 100% per la coppia | Il CCNL retribuisce una parte dei giorni di legge | CCNL art. 41 c. 4 |
| Riposi giornalieri | 100% | — | Ore lavorative a tutti gli effetti | TU art. 39 c. 2 |

## Area 2 — CCNL dirigenza medica (completa)

Per ogni materia ho controllato quale CCNL la regola oggi. Il CCNL 2026 (art. 3) conferma tutto ciò che non sostituisce; sostituisce solo, tra le materie di questa guida, le ferie (art. 9). Il CCNL 2024 sostituisce l'art. 44 (congedi dei genitori) del CCNL 2019 con l'art. 41 e gli artt. 26-27 (guardia, pronta disponibilità) con gli artt. 29-30. Restano del CCNL 2019 l'art. 45 (congedo a ore) e l'art. 110 (part-time), richiamato dal CCNL 2024 (artt. 9 e 15).

| Regola (id) | Articolo e comma | CCNL che la regola oggi | Condizioni | Data che decide |
|---|---|---|---|---|
| `ccnl-economico` | CCNL 2024 art. 41 cc. 2-5; art. 59 c. 2 lett. c; TU art. 2 c. 2 | CCNL 2024, confermato da CCNL 2026 art. 3 | Dirigente SSN dipendente | Data del congedo |
| `guardie` | CCNL 2024 art. 29 cc. 2, 3, 5, 6; art. 30 cc. 2, 3, 6, 7; TU art. 53 | CCNL 2024 | Nessun esonero contrattuale per genitori (cercato in CCNL 2019, 2024, 2026: trovato solo l'esonero dai turni disagiati per le donne vittime di violenza, art. 36 c. 9 CCNL 2024) | Età del figlio al turno. **Da verificare**: pronta disponibilità notturna e art. 53 |
| `orario-flessibile` | CCNL 2024 art. 27 c. 10 lett. g, h, i; CCNL 2026 art. 9 c. 10 | CCNL 2024 (orario), CCNL 2026 (ferie) | Compatibilità organizzativa | Età del figlio |
| `lavoro-agile` | L. 81/2017 art. 18 c. 3-bis; CCNL 2024 artt. 93-94 | CCNL 2024 | Attività remotizzabili, esclusi i turni | Età del figlio (12 anni; senza limite con disabilità) |
| `part-time` | CCNL 2019 art. 110 cc. 1-4, 6-10; D.Lgs. 81/2015 art. 8 cc. 5, 5-bis, 7; CCNL 2024 art. 87 c. 9 | CCNL 2019 | Rapporto esclusivo; niente incarico gestionale; intramoenia sospesa | Età del figlio (8 anni per la quota; 13 per la priorità di legge); congedo parentale residuo |
| `parentale-ore` | CCNL 2019 art. 45; TU art. 32 cc. 1-bis, 1-ter, 3; CCNL 2024 art. 34 | CCNL 2019 + legge | — | Data d'uso. **Da verificare**: criteri aziendali |
| `assegnazione-temporanea` | TU art. 42-bis; art. 45 c. 2-bis | Legge (solo dipendenti pubblici) | Posto vacante; assenso delle due amministrazioni | Età del figlio alla domanda |

### Combinazione CCNL ↔ legge (area 2)

| Istituto | Legge | CCNL | Combinazione |
|---|---|---|---|
| Lavoro notturno | Divieto fino a 1 anno, esonero fino a 3 / 12 anni (art. 53 TU) | Nessuna regola specifica | Vale la legge |
| Lavoro agile | Priorità per figli ≤ 12 anni (art. 18 c. 3-bis L. 81/2017) | Esclusi i lavori in turno (art. 93 c. 2) | La priorità vale solo tra le attività che l'Azienda ha individuato come remotizzabili |
| Part-time | Priorità figli ≤ 13 anni (art. 8 c. 5); diritto in luogo del congedo (art. 8 c. 7) | Quota 3-7% per figli ≤ 8 anni; diritto art. 8 c. 7 fuori quota (art. 110 c. 7) | Il CCNL recepisce il diritto di legge e aggiunge una via a quota |

## Aree 3 e 4

Non ancora verificate in questa versione. Ricerca già fatta per l'area 3: L. 104/1992 art. 33 (testo vigente dal 13/8/2022), TU artt. 26, 31, 33, 36, 42, 45, 50 (Normattiva).

## Confronto a campione (5 regole)

| # | Regola | Riferimento | Esito |
|---|---|---|---|
| 1 | Mesi all'80%, regime 3 mesi per nato nel 2024 con maternità finita nel 2025 | Circ. INPS 95/2025, esempio A | Coincide (test 7) |
| 2 | Mesi all'80% dentro i 3 mesi non trasferibili; mese residuo alla madre | Circ. INPS 95/2025, esempio B | Coincide (test 20) |
| 3 | Fine della paternità obbligatoria nel 2025 dà diritto a 3 mesi | Circ. INPS 95/2025, esempio C | Coincide (test 21) |
| 4 | Residuo del padre con giorni usati prima del 13/8/2022 | Circ. INPS 122/2022, esempio 1 | Totale coincide (107 giorni); la divisione per fasce no (47 al 30% invece di 90), perché il motore presume che i giorni già usati fossero indennizzati. Limite dichiarato con avviso nella pagina (test 22) |
| 5 | 30 giorni al 100% per la coppia; 30 giorni/anno al 100% per malattia del figlio sotto i 3 anni | CCNL 2024 art. 41 cc. 3-4 (testo GU) | Coincide (test 10 e parametri `ccnlGiorni100`, `ccnlGiorniAnno100`) |

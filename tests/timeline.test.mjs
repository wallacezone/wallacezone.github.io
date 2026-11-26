// Test della timeline di guida_diritti_medico_genitore.html.
// Eseguire con: node --test tests/
// Il test legge il JSON delle regole e il motore direttamente dalla pagina,
// così verifica lo stesso codice che gira nel browser.
// Ogni risultato atteso è calcolato a mano dalla norma indicata nel commento.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../guida_diritti_medico_genitore.html', import.meta.url), 'utf8');
const json = html.match(/<script type="application\/json" id="dati">([\s\S]*?)<\/script>/)[1];
const motore = html.match(/<script id="motore">([\s\S]*?)<\/script>/)[1];
const dati = JSON.parse(json);
const P = dati.parametri;
const ctx = {};
vm.runInNewContext(motore, { globalThis: ctx, window: undefined });
const M = ctx.Motore;

// Input di base: due dirigenti SSN, nessun congedo parentale usato.
function input(over = {}) {
  const base = {
    oggi: '2026-11-25', evento: 'nascita', dataNascita: null, dataPresunta: null, dataIngresso: null,
    opzioneMaternita: 'ordinaria', partoPlurimo: false, disabilitaGrave: false, genitoreSolo: '', letturaCCNL: 'assorbe',
    madre: { tipo: 'ssn', fineCongedo: null, parentaleGiorni: 0, parentale80Giorni: 0 },
    padre: { tipo: 'ssn', fineCongedo: null, parentaleGiorni: 0, parentale80Giorni: 0 },
  };
  return { ...base, ...over, madre: { ...base.madre, ...(over.madre || {}) }, padre: { ...base.padre, ...(over.padre || {}) } };
}
const plain = (o) => JSON.parse(JSON.stringify(o));
const diritto = (r, id) => r.diritti.find((x) => x.id === id);

// ---------- Maternità (art. 16 e 20 D.Lgs. 151/2001) ----------

test('1. Maternità ordinaria, parto alla data presunta: 2 mesi prima + 3 dopo', () => {
  // Presunta 10/3/2026 -> inizio 10/1/2026; parto 10/3/2026 -> fine 10/6/2026 (art. 16 c. 1 lett. a e c).
  const m = M.maternita(P, '2026-03-10', '2026-03-10', 'ordinaria');
  assert.equal(m.inizio, '2026-01-10');
  assert.equal(m.fine, '2026-06-10');
  assert.equal(m.giorniAggiunti, 0);
});

test('2. Parto prematuro: i giorni non goduti prima si aggiungono dopo', () => {
  // Presunta 10/3/2026, parto 20/2/2026: 18 giorni di anticipo (20/2 -> 10/3).
  // Fine = 20/5/2026 + 18 giorni = 7/6/2026 (art. 16 c. 1 lett. d).
  const m = M.maternita(P, '2026-03-10', '2026-02-20', 'ordinaria');
  assert.equal(m.giorniAggiunti, 18);
  assert.equal(m.fine, '2026-06-07');
});

test('3. Parto molto prematuro, prima dell\'inizio previsto del congedo', () => {
  // Presunta 10/5/2026 -> inizio previsto 10/3/2026; periodo prima = 61 giorni (10/3 -> 10/5), goduti 0.
  // Parto 1/2/2026: inizio = 1/2/2026, fine = 1/5/2026 + 61 = 1/7/2026.
  const m = M.maternita(P, '2026-05-10', '2026-02-01', 'ordinaria');
  assert.equal(m.inizio, '2026-02-01');
  assert.equal(m.giorniAggiunti, 61);
  assert.equal(m.fine, '2026-07-01');
});

test('4. Parto dopo la data presunta: fine = parto + 3 mesi', () => {
  // Presunta 10/3/2026, parto 15/3/2026: i 5 giorni tra presunta e parto sono congedo (lett. b); fine 15/6/2026.
  const m = M.maternita(P, '2026-03-10', '2026-03-15', 'ordinaria');
  assert.equal(m.inizio, '2026-01-10');
  assert.equal(m.fine, '2026-06-15');
});

test('5. Flessibilità (1+4) e maternità tutta dopo il parto (0+5)', () => {
  // Art. 20: presunta e parto 10/3/2026 -> 10/2/2026 - 10/7/2026. Art. 16 c. 1.1: 10/3/2026 - 10/8/2026.
  const f = M.maternita(P, '2026-03-10', '2026-03-10', 'flessibile');
  assert.deepEqual([f.inizio, f.fine], ['2026-02-10', '2026-07-10']);
  const s = M.maternita(P, '2026-03-10', '2026-03-10', 'solo_dopo');
  assert.deepEqual([s.inizio, s.fine], ['2026-03-10', '2026-08-10']);
});

// ---------- Paternità obbligatoria (art. 27-bis) ----------

test('6. Paternità: finestra da 2 mesi prima della presunta a 5 mesi dopo la nascita; 20 giorni se parto plurimo', () => {
  // Presunta 12/3/2026 -> dal 12/1/2026; nascita 10/3/2026 -> al 10/8/2026 (circ. INPS 122/2022, es. 1: ultimo giorno = stesso giorno del 5° mese).
  const r = M.calcola(input({ dataNascita: '2026-03-10', dataPresunta: '2026-03-12', oggi: '2026-03-20' }), P);
  const p = diritto(r, 'paternita');
  assert.equal(p.dal, '2026-01-12');
  assert.equal(p.al, '2026-08-10');
  assert.equal(p.stato, 'attivo');
  assert.match(p.dettaglio, /^10 giorni/);
  const r2 = M.calcola(input({ dataNascita: '2026-03-10', dataPresunta: '2026-03-12', oggi: '2026-03-20', partoPlurimo: true }), P);
  assert.match(diritto(r2, 'paternita').dettaglio, /^20 giorni/);
});

// ---------- Regime dei mesi all'80% (art. 34 c. 1; circ. INPS 95/2025 par. 3) ----------

test('7. Regime: esempio A della circolare INPS 95/2025 (nato 20/11/2024, maternità finita 20/2/2025) = 3 mesi', () => {
  assert.equal(M.mesiMaggiorati(P, '2024-11-20', '2025-02-20').mesi, 3);
});

test('8. Regime: soglia del 31/12/2024 sulla fine del congedo', () => {
  // Nato nel 2024: 2 mesi se il congedo finisce entro il 31/12/2024, 3 mesi se finisce dal 1/1/2025 ("successivamente al 31 dicembre 2024").
  assert.equal(M.mesiMaggiorati(P, '2024-09-30', '2024-12-31').mesi, 2);
  assert.equal(M.mesiMaggiorati(P, '2024-10-01', '2025-01-01').mesi, 3);
});

test('9. Regime: soglie per nati nel 2022 e 2023 e per i nati dal 1/1/2025', () => {
  // Nato 1/6/2022, maternità finita 1/9/2022 -> 0 mesi. Nato 31/12/2022 con fine 31/3/2023 -> 1 mese (L. 197/2022).
  assert.equal(M.mesiMaggiorati(P, '2022-06-01', '2022-09-01').mesi, 0);
  assert.equal(M.mesiMaggiorati(P, '2022-12-31', '2023-03-31').mesi, 1);
  // Nato 31/12/2023, fine congedo 31/3/2024 -> 2 mesi (dopo il 31/12/2023); nato 1/1/2025 -> 3 mesi senza condizioni.
  assert.equal(M.mesiMaggiorati(P, '2023-12-31', '2024-03-31').mesi, 2);
  assert.equal(M.mesiMaggiorati(P, '2025-01-01', null).mesi, 3);
});

// ---------- Congedo parentale: giorni residui per fascia ----------

test('10. Due dirigenti SSN, nessun giorno usato, lettura "assorbe" (nota DFP 27/3/2023)', () => {
  // Nato 1/3/2025 -> 3 mesi all'80% (90 gg). Madre: cap = min(180, 300) = 180.
  // 100%: 30 gg (CCNL art. 41 c. 3). 80%: pool 90 - 30 assorbiti = 60, entro i suoi 90 non trasferibili - 30 = 60 -> 60.
  // 30%: indennizzabili 90 propri + 90 condivisi = 180 - 30 - 60 = 90. Non retribuiti: 0.
  // Padre: cap = 210 (6 + 1 mese se ne usa almeno 3). 30 + 60 + 90 = 180 indennizzati, 30 non retribuiti.
  const r = M.calcola(input({ dataNascita: '2025-03-01', dataPresunta: '2025-03-01', madre: { fineCongedo: '2025-06-01' } }), P);
  assert.equal(r.regime.mesi80, 3);
  assert.deepEqual(plain(r.parentale.madre.fasce), { p100: 30, p80: 60, p30: 90, p0: 0 });
  assert.equal(r.parentale.madre.totale, 180);
  assert.deepEqual(plain(r.parentale.padre.fasce), { p100: 30, p80: 60, p30: 90, p0: 30 });
  assert.equal(r.parentale.padre.totale, 210);
});

test('11. Stessi dati, lettura alternativa "aggiuntivo" (circ. INPS 95/2025): 30 gg al 100% + 90 all\'80%', () => {
  // Madre: i 30 gg al 100% consumano prima i 90 condivisi -> restano 90 propri per l'80%: pool 90 -> 90 all'80%.
  // 30%: 180 indennizzabili - 30 - 90 = 60. Totale 180.
  const r = M.calcola(input({ dataNascita: '2025-03-01', dataPresunta: '2025-03-01', madre: { fineCongedo: '2025-06-01' }, letturaCCNL: 'aggiuntivo' }), P);
  assert.deepEqual(plain(r.parentale.madre.fasce), { p100: 30, p80: 90, p30: 60, p0: 0 });
});

test('12. Mesi già usati dall\'altro genitore: madre ha usato 180 giorni (30 al 100% + 60 all\'80% + 90 al 30%)', () => {
  // Padre: cap = min(210, 330 - 180) = 150 (arriverà a ≥ 90 gg, quindi tetto di coppia 330).
  // 100%: 30 - min(30, 180) = 0. Pool 80%: 90 - (60 + 30 assorbiti) = 0.
  // Condivisi: madre oltre i 90 propri = 90 -> condivisi esauriti. Indennizzabili padre = 90 propri al 30%. Restano 60 non retribuiti.
  const r = M.calcola(input({ dataNascita: '2025-03-01', madre: { fineCongedo: '2025-06-01', parentaleGiorni: 180, parentale80Giorni: 60 } }), P);
  assert.deepEqual(plain(r.parentale.padre.fasce), { p100: 0, p80: 0, p30: 90, p0: 60 });
  assert.equal(r.parentale.madre.totale, 0);
});

test('13. Tetto di coppia raggiunto: padre 200 giorni, madre 120 -> alla madre restano 10 giorni', () => {
  // Padre ≥ 90 gg -> tetto di coppia 330 (art. 32 c. 2). Madre: min(180 - 120, 330 - 320) = 10.
  // Padre: min(210 - 200, 330 - 320) = 10.
  const r = M.calcola(input({ dataNascita: '2023-05-01', madre: { fineCongedo: '2023-08-01', parentaleGiorni: 120 }, padre: { parentaleGiorni: 200 } }), P);
  assert.equal(r.parentale.madre.totale, 10);
  assert.equal(r.parentale.padre.totale, 10);
  // Senza i 3 mesi del padre il tetto resta 300: padre 60, madre 170 -> alla madre min(10, 300 - 230) = 10; con madre 120 e padre 60 -> min(60, 120) = 60.
  const r2 = M.calcola(input({ dataNascita: '2023-05-01', madre: { fineCongedo: '2023-08-01', parentaleGiorni: 120 }, padre: { parentaleGiorni: 60 } }), P);
  assert.equal(r2.parentale.madre.totale, 60);
});

test('14. Genitore solo (madre SSN): 11 mesi, 9 indennizzati', () => {
  // Nato 1/5/2025 -> 3 mesi all'80%. Cap 330. 100%: 30. 80%: 90 - 30 assorbiti = 60.
  // 30%: 270 - 30 - 60 = 180. Non retribuiti: 330 - 270 = 60. Il padre non ha diritti.
  const r = M.calcola(input({ dataNascita: '2025-05-01', genitoreSolo: 'madre', madre: { fineCongedo: '2025-08-01' } }), P);
  assert.deepEqual(plain(r.parentale.madre.fasce), { p100: 30, p80: 60, p30: 180, p0: 60 });
  assert.equal(r.parentale.padre.spetta, false);
  assert.equal(diritto(r, 'paternita'), undefined);
});

test('15. Cambio del limite di età da 12 a 14 anni il 1/1/2026 (L. 199/2025; messaggio INPS 251/2026)', () => {
  // Nato 1/6/2013. Il 15/12/2025 il limite è 12 anni: finestra finita il 31/5/2025 -> 0 giorni.
  // Il 10/1/2026 il limite è 14 anni: finestra fino al 31/5/2027 -> il padre (0 giorni usati) ha 210 giorni, nessuno all'80% (oltre i 6 anni).
  const prima = M.calcola(input({ dataNascita: '2013-06-01', oggi: '2025-12-15', madre: { fineCongedo: '2013-09-01' } }), P);
  assert.equal(prima.fineParentale, '2025-05-31');
  assert.equal(prima.parentale.padre.totale, 0);
  assert.equal(prima.parentale.padre.stato, 'scaduto');
  const dopo = M.calcola(input({ dataNascita: '2013-06-01', oggi: '2026-01-10', madre: { fineCongedo: '2013-09-01' } }), P);
  assert.equal(dopo.fineParentale, '2027-05-31');
  assert.equal(dopo.parentale.padre.totale, 210);
  assert.equal(dopo.parentale.padre.fasce.p80, 0);
  assert.equal(dopo.parentale.padre.fasce.p100, 30); // CCNL: i 30 giorni al 100% valgono oltre i 6 anni (parere ARAN)
});

test('16. Soglia dei 6 anni per l\'80%: ultimo giorno il giorno prima del 6° compleanno', () => {
  // Nato 1/2/2023 -> 1 mese all'80% (nato dal 2023). Il 31/1/2029 è ancora entro i 6 anni, il 1/2/2029 no.
  // "assorbe": pool 30 - 30 gg al 100% = 0 -> per vedere l'80% uso la lettura "aggiuntivo".
  const dentro = M.calcola(input({ dataNascita: '2023-02-01', oggi: '2029-01-31', letturaCCNL: 'aggiuntivo', madre: { fineCongedo: '2023-05-01' } }), P);
  assert.equal(dentro.regime.mesi80, 1);
  assert.equal(dentro.parentale.padre.fasce.p80, 30);
  const fuori = M.calcola(input({ dataNascita: '2023-02-01', oggi: '2029-02-01', letturaCCNL: 'aggiuntivo', madre: { fineCongedo: '2023-05-01' } }), P);
  assert.equal(fuori.parentale.padre.fasce.p80, 0);
});

test('17. Padre SSN con madre libera professionista: congedo pieno e riposi giornalieri al padre', () => {
  // Art. 32 c. 4: il congedo spetta anche se l'altro genitore non ne ha diritto -> padre 210 giorni.
  // Art. 40 lett. c: riposi al padre se la madre non è lavoratrice dipendente. Nessun congedo di maternità calcolato.
  const r = M.calcola(input({ dataNascita: '2026-06-01', oggi: '2026-11-25', madre: { tipo: 'libera_professione' } }), P);
  assert.equal(r.parentale.madre.spetta, false);
  assert.equal(r.parentale.padre.totale, 210);
  assert.equal(diritto(r, 'riposi').chi, 'padre');
  assert.equal(diritto(r, 'maternita'), undefined);
  // Fine maternità sconosciuta e madre non dipendente: nato nel 2026 -> 3 mesi all'80% comunque.
  assert.equal(r.regime.mesi80, 3);
});

test('18. Malattia del figlio: regime per data d\'uso (5 giorni fino a 8 anni nel 2025, 10 fino a 14 anni dal 2026)', () => {
  // Figlio nato 1/6/2017: il 1/6/2025 ha 8 anni -> regime 2025 (fino a 8 anni) già finito il 31/5/2025.
  const r2025 = M.calcola(input({ dataNascita: '2017-06-01', oggi: '2025-06-01', madre: { fineCongedo: '2017-09-01' } }), P);
  assert.equal(r2025.regime.malattia.giorni, 5);
  assert.equal(diritto(r2025, 'malattia-annua').stato, 'scaduto');
  // Il 1/6/2026 (regime 2026) ha 9 anni -> 10 giorni l'anno, attivo fino al 31/5/2031.
  const r2026 = M.calcola(input({ dataNascita: '2017-06-01', oggi: '2026-06-01', madre: { fineCongedo: '2017-09-01' } }), P);
  assert.equal(r2026.regime.malattia.giorni, 10);
  const mal = diritto(r2026, 'malattia-annua');
  assert.equal(mal.stato, 'attivo');
  assert.equal(mal.al, '2031-05-31');
});

test('19. Figlio non ancora nato: date stimate sulla data presunta, regime 3 mesi', () => {
  // Presunta 15/3/2027 -> maternità 15/1/2027 - 15/6/2027; riposi fino al 14/3/2028.
  const r = M.calcola(input({ dataPresunta: '2027-03-15', oggi: '2026-11-25' }), P);
  assert.ok(r.avvisi.length > 0);
  const m = diritto(r, 'maternita');
  assert.deepEqual([m.dal, m.al, m.stato], ['2027-01-15', '2027-06-15', 'futuro']);
  assert.equal(diritto(r, 'riposi').al, '2028-03-14');
  assert.equal(r.regime.mesi80, 3);
});

// ---------- Confronto a campione con gli esempi delle circolari INPS ----------

test('20. Circ. INPS 95/2025, esempio B: padre ha usato i suoi 3 mesi (2 all\'80%), alla madre resta 1 mese all\'80%', () => {
  // Nato 15/9/2024; madre (dipendente privata) in maternità solo dopo il parto fino al 15/2/2025 -> 3 mesi all'80%.
  // Padre: 1/10-31/12/2024 = 90 giorni, di cui 60 all'80% e 30 al 30%. INPS: «La madre ... può fruire dell'ulteriore mese ... all'80%».
  const r = M.calcola(input({ dataNascita: '2024-09-15', oggi: '2025-06-01', opzioneMaternita: 'solo_dopo',
    madre: { tipo: 'privato', fineCongedo: '2025-02-15' }, padre: { tipo: 'privato', parentaleGiorni: 90, parentale80Giorni: 60 } }), P);
  assert.equal(r.regime.mesi80, 3);
  assert.equal(r.parentale.madre.fasce.p80, 30);
  // INPS: il mese del padre nel 2025 (oltre i suoi 3 non trasferibili) è solo al 30%.
  assert.equal(r.parentale.padre.fasce.p80, 0);
});

test('21. Circ. INPS 95/2025, esempio C: padre in paternità alternativa e obbligatoria finita nel 2025 -> 3 mesi all\'80%', () => {
  // Nato 15/8/2024; ultimo giorno di paternità obbligatoria 13/1/2025 (dopo il 31/12/2024).
  const r = M.calcola(input({ dataNascita: '2024-08-15', oggi: '2025-03-01', genitoreSolo: 'padre',
    madre: { tipo: 'non_occupato' }, padre: { tipo: 'privato', fineCongedo: '2025-01-13' } }), P);
  assert.equal(r.regime.mesi80, 3);
  assert.equal(r.parentale.padre.fasce.p80, 90);
});

test('22. Circ. INPS 122/2022, esempio 1 (giorni usati prima del 13/8/2022): il totale coincide, la ripartizione no', () => {
  // Madre 6 mesi indennizzati, padre 1 mese e 13 giorni NON indennizzati prima della riforma.
  // INPS: al padre restano 3 mesi indennizzati + 17 giorni non indennizzati = 107 giorni.
  const r = M.calcola(input({ dataNascita: '2021-03-01', oggi: '2022-09-01', madre: { tipo: 'privato', fineCongedo: '2021-06-01', parentaleGiorni: 180 },
    padre: { tipo: 'privato', parentaleGiorni: 43 } }), P);
  assert.equal(r.parentale.padre.totale, 107);
  // Il motore presume che i giorni già usati abbiano consumato per primi quelli indennizzati: per il padre stima 47 giorni
  // al 30% invece di 90. È un limite dichiarato: per figli con congedi usati prima del 13/8/2022 la pagina mostra un avviso.
  assert.equal(r.parentale.padre.fasce.p30, 47);
  assert.ok(r.avvisi.some((a) => a.includes('13/8/2022')));
});

// ---------- Area 3: adozione, affidamento, disabilità ----------

test('23. Adozione nazionale di un bambino di quasi 7 anni: finestre dall\'ingresso, tetto dei 18 anni', () => {
  // Ingresso 1/4/2026, nato 1/5/2019. Art. 26 c. 2: maternità entro 5 mesi -> fino al 1/9/2026.
  // Art. 36 c. 2: parentale entro 14 anni dall'ingresso (31/3/2040) ma non oltre i 18 anni (30/4/2037) -> 30/4/2037.
  // 80% entro 6 anni dall'ingresso: 31/3/2032. Ingresso dal 2025 -> 3 mesi (circ. INPS 95/2025).
  // Riposi: primo anno dall'ingresso -> 31/3/2027 (art. 45). Notte: 3 anni dall'ingresso (31/3/2029), non oltre i 12 anni (30/4/2031) -> 31/3/2029.
  const r = M.calcola(input({ evento: 'adozione_nazionale', dataIngresso: '2026-04-01', dataNascita: '2019-05-01' }), P);
  const mat = diritto(r, 'maternita-adozione');
  assert.deepEqual([mat.dal, mat.al, mat.stato], ['2026-04-01', '2026-09-01', 'scaduto']);
  assert.equal(r.fineParentale, '2037-04-30');
  assert.equal(r.fineMaggiorata, '2032-03-31');
  assert.equal(r.regime.mesi80, 3);
  assert.equal(diritto(r, 'riposi').al, '2027-03-31');
  assert.equal(diritto(r, 'notte-esonero').al, '2029-03-31');
  assert.deepEqual(plain(r.parentale.padre.fasce), { p100: 30, p80: 60, p30: 90, p0: 30 });
  // Malattia: senza limite fino ai 6 anni (già passati); giorni annui dall'ingresso fino ai 14 anni (30/4/2033).
  assert.equal(diritto(r, 'malattia-libera').stato, 'scaduto');
  const mal = diritto(r, 'malattia-annua');
  assert.deepEqual([mal.dal, mal.al], ['2026-04-01', '2033-04-30']);
  assert.equal(diritto(r, 'paternita').al, '2026-09-01');
});

test('24. Adozione internazionale e affidamento: maternità prima dell\'ingresso; 3 mesi per l\'affidamento', () => {
  // Art. 26 c. 3: nell'adozione internazionale il congedo può iniziare all'estero, prima dell'ingresso -> nessuna data di inizio.
  const ai = M.calcola(input({ evento: 'adozione_internazionale', dataIngresso: '2026-10-01', dataNascita: '2023-01-15' }), P);
  const m = diritto(ai, 'maternita-adozione');
  assert.equal(m.dal, null);
  assert.equal(m.al, '2027-03-01');
  assert.equal(m.stato, 'attivo');
  // Art. 26 c. 6: affidamento 3 mesi entro 5 mesi.
  const af = M.calcola(input({ evento: 'affidamento', dataIngresso: '2026-10-01', dataNascita: '2023-01-15' }), P);
  assert.match(diritto(af, 'maternita-adozione').dettaglio, /^3 mesi/);
});

test('25. Figlio con disabilità grave: prolungamento fino a 3 anni compresi i congedi già usati', () => {
  // Nato 1/3/2025; madre ha usato 180 giorni, padre 30. Art. 33 c. 1: 3 anni = 36 mesi x 30 = 1080 giorni, meno 210 -> 870.
  // Finestra: 14 anni -> 28/2/2039. Due ore al giorno fino ai 3 anni -> 29/2/2028.
  const r = M.calcola(input({ dataNascita: '2025-03-01', disabilitaGrave: true,
    madre: { fineCongedo: '2025-06-01', parentaleGiorni: 180, parentale80Giorni: 60 }, padre: { parentaleGiorni: 30 } }), P);
  const pr = diritto(r, 'prolungamento');
  assert.match(pr.dettaglio, /restano 870 giorni/);
  assert.equal(pr.al, '2039-02-28');
  const ore = diritto(r, 'permesso-ore');
  assert.deepEqual([ore.al, ore.stato], ['2028-02-29', 'attivo']);
  assert.ok(diritto(r, 'permessi-104'));
  assert.ok(diritto(r, 'congedo-straordinario'));
  // Senza disabilità questi diritti non compaiono.
  const no = M.calcola(input({ dataNascita: '2025-03-01' }), P);
  assert.equal(diritto(no, 'prolungamento'), undefined);
});

test('26. Adozione di un figlio con disabilità: i permessi decorrono dall\'ingresso in famiglia', () => {
  // Art. 45 c. 2: l'art. 42 si applica all'adozione; i permessi non possono iniziare prima che il minore sia in famiglia.
  const r = M.calcola(input({ evento: 'adozione_nazionale', dataIngresso: '2026-04-01', dataNascita: '2019-05-01', disabilitaGrave: true }), P);
  assert.equal(diritto(r, 'permessi-104').dal, '2026-04-01');
  assert.equal(diritto(r, 'congedo-straordinario').dal, '2026-04-01');
  // Prolungamento: limite di età del bambino (art. 33 c. 1: 14 anni di vita) -> 30/4/2033; nessun giorno usato -> 1080.
  assert.match(diritto(r, 'prolungamento').dettaglio, /restano 1080 giorni/);
  assert.equal(diritto(r, 'prolungamento').al, '2033-04-30');
});

// ---------- Area 4: bonus ----------

test('27. Bonus nuovi nati: domanda entro 120 giorni, solo per eventi del 2026 (circ. INPS 45/2026)', () => {
  // Nato 16/7/2026 -> ultimo giorno 13/11/2026 (16/7 + 120 giorni). Oggi 25/11/2026 è scaduto.
  const r = M.calcola(input({ dataNascita: '2026-07-16' }), P);
  const b = diritto(r, 'bonus-nuovi-nati');
  assert.deepEqual([b.al, b.stato], ['2026-11-13', 'scaduto']);
  // Nato 1/11/2026 -> fino al 1/3/2027, attivo.
  const r2 = M.calcola(input({ dataNascita: '2026-11-01' }), P);
  assert.deepEqual([diritto(r2, 'bonus-nuovi-nati').al, diritto(r2, 'bonus-nuovi-nati').stato], ['2027-03-01', 'attivo']);
  // Nato nel 2025: la circolare 45/2026 riguarda gli eventi del 2026 -> nessuna voce.
  assert.equal(diritto(M.calcola(input({ dataNascita: '2025-12-31' }), P), 'bonus-nuovi-nati'), undefined);
});

test('28. Assegno unico +50% fino al primo compleanno (circ. INPS 7/2026)', () => {
  // Nato 1/3/2026 -> maggiorazione fino al 28/2/2027.
  const r = M.calcola(input({ dataNascita: '2026-03-01' }), P);
  assert.equal(diritto(r, 'assegno-unico-primo-anno').al, '2027-02-28');
  // Adozione di un bambino di 7 anni: nessuna maggiorazione (non ha meno di un anno).
  const a = M.calcola(input({ evento: 'adozione_nazionale', dataIngresso: '2026-04-01', dataNascita: '2019-05-01' }), P);
  assert.equal(diritto(a, 'assegno-unico-primo-anno'), undefined);
});

# wallacezone.github.io

Sito personale di Alessandro Barbieri, pubblicato con GitHub Pages: una raccolta di progetti ed esperimenti. Lo stile si chiama **Bento**: riquadri con bordo spesso e ombra piena, un colore per ogni gruppo, e l'azzurro dell'illustrazione per l'intestazione.

## Regole fisse

- Usa solo HTML e CSS statici: niente framework, npm o build, e JS solo se indispensabile. Il sito deve funzionare su GitHub Pages così com'è.
- GitHub Pages passa il sito a Jekyll. Le pagine **non** hanno front matter (`---`) e devono restare così, altrimenti Jekyll le elabora con Liquid. `_config.yml` serve solo a escludere i file di lavoro dalla pubblicazione. I file che iniziano con `_` (es. `_template.html`) non vengono pubblicati.
- Tutto lo stile sta in [`assets/style.css`](assets/style.css). Non aggiungere `<style>`, attributi `style=""` o classi nuove alle pagine. Se un componente manca, aggiungilo al CSS e documentalo qui.
- Non toccare foto, nome, sottotitolo e titoli delle pagine esistenti.
- I font sono self-hosted in `assets/fonts/` (licenze in [`assets/fonts/LICENZE.md`](assets/fonts/LICENZE.md)). Niente CDN di font e nessuna dipendenza esterna nuova.
- Accessibilità WCAG 2.2 AA: `lang="it"`, `alt` sulle immagini, contrasto del testo ≥ 4.5:1, intestazioni in ordine (h1 → h2 → h3), skip link come primo elemento del `body`. Ogni movimento si spegne con `prefers-reduced-motion`.
- Le 10 pagine storiche (Tailwind via CDN) non usano ancora il foglio di stile. Si possono migrare una alla volta: si toglie Tailwind e si rifà il markup con i componenti qui sotto.

## Token (`:root` in assets/style.css)

| Gruppo | Token | Uso |
|---|---|---|
| Colori | `--color-paper` | Sfondo della pagina |
| | `--color-surface` | Riquadri neutri, badge |
| | `--color-ink` | Testo (17.3:1 chiaro, 16.1:1 scuro) |
| | `--color-line`, `--color-shadow` | Bordi e ombra piena dei riquadri |
| | `--color-sky`, `--color-on-sky` | Riquadro del nome (12.6:1) |
| | `--color-invert`, `--color-on-invert` | Riquadro scuro dei gruppi, cerchio della freccia |
| Toni | `--tone-N`, `--on-tone-N`, `--tint-N` (N = 1…4) | Colore pieno del gruppo, testo sul pieno, fondo delle voci |
| Font | `--font-display` | Bricolage Grotesque: nome, titoli, numeri |
| | `--font-text` | Figtree: testo, badge, pulsanti |
| Scala | `--step--1` … `--step-4` | 13, 16→18, 19→23, 26→34, 48→99, 56→96 px (fluida con `clamp()`) |
| Spazi | `--space-3xs` … `--space-l` | Da 4 px a ~56 px, fluidi. `--space-xs` è lo spazio tra riquadri |
| Forme | `--border`, `--radius-tile`, `--radius-pill`, `--shadow-offset` | Bordo 2.5 px, raggio 26 px, ombra piena 5 px |
| Misure | `--measure` (34em), `--page-max`, `--tile-min` (17rem) | Larghezza di lettura; `--tile-min` decide quante colonne ha la griglia |

Toni attuali e contrasto del testo sul pieno:

| Tono | Gruppo | Pieno | Testo sul pieno |
|---|---|---|---|
| `tone-1` | Genitori e lavoro | arancio `#ff7a52` | inchiostro, 7.2:1 |
| `tone-2` | Investire | blu `#2f4bff` | bianco, 5.9:1 |
| `tone-3` | Salute e tavola | giallo `#ffd23f` | inchiostro, 12.8:1 |
| `tone-4` | Giochi e curiosità | menta `#35d08e` | inchiostro, 9.3:1 |

Il tema scuro si attiva da solo con `prefers-color-scheme: dark`: le tinte delle voci diventano scure, i bordi crema e l'ombra prende il colore del gruppo. I toni pieni e il loro testo restano uguali nei due temi.

**Nuovo tono:** aggiungi `--tone-5`, `--on-tone-5` e `--tint-5` in `:root`, e `--tint-5` scuro nel blocco `prefers-color-scheme: dark`. Poi aggiungi la riga `.tone-5 { … }` nella sezione "Toni" del CSS. Calcola il contrasto del testo sul pieno e del testo crema sulla tinta scura (≥ 4.5:1) e scrivilo nel commento e qui. Niente viola o lavanda.

## Componenti

| Classe | Dove | Cosa fa |
|---|---|---|
| `.page` | contenitore di tutto (`main` in homepage, `div` nelle pagine) | Centra e dà il margine esterno |
| `.bento` | `ul` (homepage) o lo stesso `div.page` (pagine) | Griglia di riquadri: le colonne nascono da `--tile-min` |
| `.tile` | ogni riquadro | Bordo, raggio, ombra piena, padding |
| `.hello` (`__photo`, `__name`, `__role`) | primo riquadro della homepage | Riquadro azzurro grande (2×2) con foto, nome e sottotitolo |
| `.group-nav` (`__title`, `__list`, `__link`) | secondo riquadro della homepage | Riquadro scuro con le pillole colorate dei gruppi |
| `.group` + `.tone-N` | `li` e `section` di un gruppo | Non disegna un riquadro (`display: contents`): porta il tono a tutti i riquadri del gruppo |
| `.group-label` (`__number`, `__title`, `__count`) | primo riquadro di un gruppo | Riquadro a colore pieno con numero, titolo h2, conteggio |
| `.group__list` | `ul` delle voci | Come `.group`: non crea un box |
| `.entry` (`__title`, `__link`, `__desc`, `__foot`) | `li.tile` | Voce: tutto il riquadro è cliccabile, si solleva al passaggio del mouse |
| `.arrow` | dentro `.entry__foot` | Cerchio con freccia, decorativo (`aria-hidden`) |
| `.badge` | dentro `.entry__foot` o nell'intestazione | Strumento AI: "Gemini AI", "Perplexity AI" |
| `.note` | riquadro largo | Nota o piè di pagina a tutta larghezza |
| `.page-header` (`__back`, `__group`, `__title`, `__lede`) + `.tone-N` | pagine interne | Riquadro d'apertura a tutta larghezza nel colore del gruppo |
| `.prose` | `main.tile` delle pagine interne | Testo lungo a larghezza di lettura |
| `.visually-hidden` | `span` | Testo solo per screen reader |
| `.skip-link` | primo `a` del `body` | "Vai all'indice / al contenuto", visibile solo con Tab |

## Aggiungere una pagina

1. Copia `_template.html` con un nome nuovo, minuscolo, con trattini o underscore (es. `mia-pagina.html`), alla radice del repository.
2. Sostituisci i testi tra `[parentesi quadre]`: titolo (uguale in `<title>` e `<h1>`), descrizione, gruppo, sommario e contenuto in `.prose`.
3. Sostituisci `tone-[N]` con il tono del gruppo (tabella sopra), per esempio `tone-4`.
4. Se la pagina è stata generata con uno strumento AI, lascia il badge con il nome dello strumento; altrimenti togli tutto il paragrafo del badge.
5. Aggiungi la voce in `index.html` (vedi sotto).

## Aggiungere una voce o un gruppo in index.html

**Voce:** copia un `<li class="tile entry">` esistente dentro il `ul.group__list` del gruppo giusto e cambia `href`, titolo e descrizione. La descrizione è una sola frase, presa dal contenuto reale della pagina (titolo, h1, primi paragrafi), senza aggettivi promozionali. Il nome dello strumento AI va nel badge e **mai** nel titolo. Poi aggiorna i due conteggi: `.group-label__count` ("3 pagine") e il numero nella pillola di `.group-nav`.

**Gruppo:** crea un gruppo solo se conterrà **almeno due voci**; una voce isolata va nel gruppo più vicino.
1. Copia un intero `<li class="group tone-N">…</li>` e incollalo prima del riquadro `.note`.
2. Scegli un tono libero (o creane uno nuovo, vedi Token) e cambialo nella classe `tone-N`.
3. Usa un `id` nuovo e breve per il riquadro `.group-label` (es. `viaggi`) e `viaggi-titolo` per l'h2, con lo stesso valore in `aria-labelledby`.
4. Metti il numero successivo in `.group-label__number` (05, 06…).
5. Aggiungi la pillola in `.group-nav__list`: `<li class="tone-N"><a class="group-nav__link" href="#viaggi">…</a></li>`.

Gruppi attuali: 01 Genitori e lavoro · 02 Investire · 03 Salute e tavola · 04 Giochi e curiosità.

## Verifica prima di pubblicare

- Nessuno scroll orizzontale a 375 px e a 1440 px (`document.documentElement.scrollWidth <= innerWidth`), in tema chiaro e scuro.
- Ogni `href` locale di `index.html` punta a un file esistente.
- HTML valido: `npx html-validate index.html`.
- Su GitHub Pages i cambiamenti compaiono dopo il push su `main` (circa 1 minuto).

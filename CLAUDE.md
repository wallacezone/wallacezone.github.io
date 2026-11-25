# wallacezone.github.io

Sito personale di Alessandro Barbieri, pubblicato con GitHub Pages: una raccolta di progetti ed esperimenti.

## Regole fisse

- Usa solo HTML e CSS statici: niente framework, npm o build, e JS solo se indispensabile. Il sito deve funzionare su GitHub Pages così com'è.
- GitHub Pages passa il sito a Jekyll. Le pagine **non** hanno front matter (`---`) e devono restare così, altrimenti Jekyll le elabora con Liquid. `_config.yml` serve solo a escludere i file di lavoro dalla pubblicazione. I file che iniziano con `_` (es. `_template.html`) non vengono pubblicati.
- Tutto lo stile sta in [`assets/style.css`](assets/style.css). Non aggiungere `<style>`, attributi `style=""` o classi nuove alle pagine. Se un componente manca, aggiungilo al CSS e documentalo qui.
- Non toccare foto, nome, sottotitolo e titoli delle pagine esistenti.
- Font solo di sistema o self-hosted in `assets/`: niente CDN di font e nessuna dipendenza esterna nuova.
- Accessibilità WCAG 2.2 AA: `lang="it"`, `alt` sulle immagini, contrasto del testo ≥ 4.5:1, intestazioni in ordine (h1 → h2 → h3), skip link come primo elemento del `body`.
- Le 10 pagine storiche (Tailwind via CDN) non usano ancora il foglio di stile. Si possono migrare una alla volta: si toglie Tailwind e si rifà il markup con i componenti qui sotto.

## Token (`:root` in assets/style.css)

| Gruppo | Token | Uso |
|---|---|---|
| Colori | `--color-paper` | Sfondo della pagina |
| | `--color-surface` | Riquadro chiaro, se mai servisse |
| | `--color-ink` | Testo principale (15.7:1 chiaro, 14.6:1 scuro) |
| | `--color-muted` | Descrizioni, etichette, badge (6.5:1 / 7.2:1) |
| | `--color-accent` | Link, numeri dei gruppi, focus (6.3:1 / 7.8:1) |
| | `--color-rule` | Solo filetti e bordi decorativi, **mai per il testo** |
| Font | `--font-serif` | Tutto il testo (old-style di sistema) |
| | `--font-sans` | Solo etichette, badge, piè di pagina |
| Scala | `--step--1` … `--step-3` | 13→14, 16→18, 19→22, 22→28, 36→64 px (fluida con `clamp()`) |
| Spazi | `--space-3xs` … `--space-xl` | Da 4 px a ~88 px, fluidi |
| Misure | `--measure` (68ch), `--page-max`, `--gutter` | Larghezza di lettura, contenitore, margini laterali |
| Forme | `--radius-s`, `--radius-pill`, `--rule-width` | Raggi e spessore dei filetti |

Il tema scuro si attiva da solo con `prefers-color-scheme: dark` e ridefinisce solo i colori. Un colore nuovo va aggiunto **in entrambi i temi**, con il contrasto calcolato e scritto nel commento accanto.

## Componenti

| Classe | Dove | Cosa fa |
|---|---|---|
| `.page` | `div` attorno a tutto | Contenitore centrato con margini fluidi |
| `.skip-link` | primo `a` del `body` | "Vai al contenuto", visibile solo con Tab |
| `.masthead` (`__photo`, `__name`, `__role`) | solo homepage | Foto, nome, sottotitolo |
| `.page-header` (`__back`, `__title`, `__lede`) | pagine interne | Ritorno all'indice, titolo h1, sommario |
| `.group` (`__head`, `__number`, `__title`, `__count`, `__list`) | `section` della homepage | Gruppo tematico: titolo a sinistra su PC, sopra su smartphone |
| `.entry` (`__title`, `__link`, `__desc`, `__meta`) | `li` dentro `.group__list` | Voce: titolo-link h3, descrizione di una riga, badge |
| `.badge` | dentro `.entry__meta` | Dato secondario discreto (es. "Gemini AI") |
| `.label` | testo breve | Maiuscoletto sans in grigio (nome del gruppo, conteggi) |
| `.prose` | `main` delle pagine interne | Testo lungo a larghezza di lettura, h2, elenchi |
| `.site-footer` | `footer` | Piè di pagina piccolo |
| `.visually-hidden` | `span` | Testo solo per screen reader |

## Aggiungere una pagina

1. Copia `_template.html` con un nome nuovo, minuscolo, con trattini o underscore (es. `mia-pagina.html`), alla radice del repository.
2. Sostituisci solo i testi tra `[parentesi quadre]`: titolo (uguale in `<title>` e `<h1>`), descrizione, gruppo, sommario e contenuto in `.prose`.
3. Se la pagina è stata generata con uno strumento AI, lascia il badge con il nome dello strumento. Altrimenti togli tutto il `<p class="entry__meta">`.
4. Aggiungi la voce in `index.html` nel gruppo giusto (vedi sotto).

## Aggiungere una voce o un gruppo in index.html

Voce: copia un `<li class="entry">` esistente nel gruppo giusto e cambia `href`, titolo e descrizione. La descrizione è una sola frase, presa dal contenuto reale della pagina (titolo, h1, primi paragrafi), senza aggettivi promozionali. Il nome dello strumento AI va nel badge e **mai** nel titolo. Poi aggiorna il conteggio in `.group__count` ("3 pagine").

Gruppo: copia una `<section class="group">` intera e:
- assegna il numero successivo in `.group__number` (05, 06…);
- usa un `id` nuovo (`g-nome`) e lo stesso valore in `aria-labelledby`;
- crea un gruppo solo se conterrà **almeno due voci**. Una voce isolata va nel gruppo più vicino.

Gruppi attuali: 01 Genitori e lavoro · 02 Investire · 03 Salute e tavola · 04 Giochi e curiosità.

## Verifica prima di pubblicare

- Nessuno scroll orizzontale a 375 px e a 1440 px (`document.documentElement.scrollWidth <= innerWidth`).
- Ogni `href` locale di `index.html` punta a un file esistente.
- HTML valido: `npx html-validate index.html`.
- Su GitHub Pages i cambiamenti compaiono dopo il push su `main` (circa 1 minuto).

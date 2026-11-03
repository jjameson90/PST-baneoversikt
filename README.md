# PST Baneoversikt

Kart over alle 2 133 kunstgressflater i Norge for PST Sportsanlegg. Det viser prioritet, score med forklaring, neste steg, beste kontakt, eier/klubb, signaler med kildelenker og eierens andre baner. Zoom inn på en bane for å se den i 3D med terreng og bygninger.

**Åpne kartet:** https://jjameson90.github.io/PST-baneoversikt/

Siden er én HTML-fil (`index.html`) og en datafil (`data/pst.json`). Den har ingen byggesteg eller server og trenger ingen installasjon.

## Oppdatere dataene
1. Rediger Excel-arbeidsdokumentet som vanlig.
2. Ha en klon av dette repoet som undermappe `pst-baneoversikt/` ved siden av Excel-filen og `pst_verktoy.py`, og kjør:
   ```
   python pst_verktoy.py
   ```
   Kommandoen regner ut alt på nytt og skriver `pst-baneoversikt/data/pst.json`.
3. Commit og push `data/pst.json`. GitHub Pages oppdaterer siden etter et minutt eller to.

Du kan også laste opp en ny `data/pst.json` direkte på github.com med «Add file → Upload files».

## Kartlag
- **Kart (OSM):** OpenFreeMap «Liberty».
- **Gråtone:** Kartverket WMTS `topograatone`.
- **Detaljkart:** Kartverket FKB WMS, fra zoom 14.
- **3D-terreng:** Mapterhorn, med `encoding: terrarium` og `tileSize: 512`.
- **3D-bygg:** enkle bygg fra OpenStreetMap som standard.
  - Detaljerte bygg fra Allemannsdata (3D Tiles med GLB) krever en liten proxy, fordi Allemannsdata ikke lar andre nettsider hente byggene direkte.
  - Proxyen ligger ferdig i `worker/allemannsdata-proxy.js` og kjøres gratis på Cloudflare. Oppsettet står øverst i fila.
  - Når adressen er lagt inn i `BYGG_PROXY` øverst i `index.html`, tegnes byggene med deck.gl `Tile3DLayer` (loaders.gl `Tiles3DLoader`) over MapLibre med `MapLibreOverlay` (`interleaved: false`), som ett stabilt lag med `maxRequests: 8`, `maximumScreenSpaceError: 1.5` og `maximumMemoryUsage: 128`.
  - Nettleseren cacher JSON og GLB i 14 dager (maks 400 MB) og bevarer `Response.url`.
- **Adressesøk:** Geonorge adresse-API.

Resten av kartdataene hentes direkte fra kildene.

Kildehenvisninger vises nederst i kartet. Vilkårene står under «Kilder og vilkår».

## I lista
- **NFF:** lilla «NFF»-merke på baner som står på NFF-lista, og lilla kant på prikken i kartet.
- **Eiere og Kommuner:** fanene viser hvem som har flest overmodne og modne baner i utvalget, med telefon til eier. Klikk for å se banene.

## Reise til og fra
Hver bane har en reiseboks.
- **Startpunkt:** skriv inn en adresse, bruk «Min posisjon» eller et lagret startpunkt («Lagre som base», f.eks. lageret).
- **Ruter:** kartet regner ut opptil tre ruter til anlegget og ruten tilbake, med kjøretid, kilometer og om ruta har ferje. Valgt rute tegnes i kartet, og du kan bytte rute i lista eller ved å klikke en stiplet linje.
- **Kjøretøy:** henger (+15 %) og lastebil (+25 %) er grove tillegg.
- **Google Maps:** lenken gir sanntidstrafikk.
- **Kilde:** OSRM-ruting på OpenStreetMap-data (FOSSGIS-serveren, med reserveserver). Kjøretiden er uten trafikk og ventetid på ferje.

## Synlighet
Repoet og siden er offentlige. `robots.txt` og `noindex` ber søkemotorer la være å indeksere siden, men alle som har lenken kan se innholdet. Kontaktinfo er offentlig informasjon fra Enhetsregisteret til B2B-bruk, så respekter reservasjoner.

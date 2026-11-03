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
- **Detaljerte 3D-bygg:** Allemannsdata, 3D Tiles med GLB, fra zoom 13.
  - Tegnes med deck.gl `Tile3DLayer`, som bruker loaders.gl `Tiles3DLoader`, over MapLibre med `MapLibreOverlay` (`interleaved: false`).
  - Det er ett stabilt lag som bare skjules og vises. Fliser velges etter utsnitt med `maxRequests: 8`, `maximumScreenSpaceError: 1.5`, `maximumMemoryUsage: 128` og `updateTransforms: false`.
  - JSON og GLB lagres i nettleserens Cache Storage i opptil 14 dager, med et tak på 400 MB. Svar fra cachen får tilbake sin opprinnelige `Response.url`.
  - deck.gl lastes først når laget er slått på.
- **Adressesøk:** Geonorge adresse-API.

Siden ligger på GitHub Pages og har derfor ingen egen proxy. Kartdata hentes direkte fra kildene. Hvis en kilde ikke tillater visning fra andre nettsider, sier kartlagspanelet fra. For 3D-bygg faller kartet da tilbake til enklere OSM-bygg.

Kildehenvisninger vises nederst i kartet. Vilkårene står under «Kilder og vilkår».

## Synlighet
Repoet og siden er offentlige. `robots.txt` og `noindex` ber søkemotorer la være å indeksere siden, men alle som har lenken kan se innholdet. Kontaktinfo er offentlig informasjon fra Enhetsregisteret til B2B-bruk, så respekter reservasjoner.

let tanaan = new Date("2026-06-29"); // ← MUUTA TÄTÄ TESTATESSA

let pyorimisAani = new Audio("kuvat/pyoritys.mp3");
let voittoAani = new Audio("kuvat/voitto.mp3");
pyorimisAani.loop = true;

let kesakalenteri = {
    aloitusPaiva: new Date("2026-05-18"),
    viikot: [
        { numero: 1, teksti: "Piknik Kaivopuistossa 🌿" },
        { numero: 2, teksti: "Ilmainen ulkoilmakonsertti 🎶" },
        { numero: 3, teksti: "Luontopolku Nuuksiossa 🌲" },
        { numero: 4, teksti: "Yhteinen liikuntahaaste 💪" },
        { numero: 5, teksti: "Kesäkahvila Helsingissä ☕" },
        { numero: 6, teksti: "Museopäivä opiskelijahintaan 🖼️" },
        { numero: 7, teksti: "Pyöräretki merenrantaa pitkin 🚲" },
        { numero: 8, teksti: "Ilmainen elokuvanäytös 🎬" },
        { numero: 9, teksti: "Puistotreffit ja lautapelit 🎲" },
        { numero: 10, teksti: "Auringonlaskuretki 🌅" },
        { numero: 11, teksti: "Kaupunkisuunnistus 🗺️" },
        { numero: 12, teksti: "Kirpputorikierros 🛍️" },
        { numero: 13, teksti: "TIKO-kesäpiknik 🎉" }
    ]
};

// BIGBOSS MODAALIN TOIMINNOT

function naytaViesti(teksti) {
    let modaali = document.getElementById("viestiModaali");
    let tekstikentta = document.getElementById("modaaliTeksti");
    
    if (modaali && tekstikentta) {
        tekstikentta.textContent = teksti;
        modaali.style.display = "block";
    } else {
        // Varatoiminto, jos modaalia ei löydy HTML:stä
        alert(teksti);
    }
}

// Tämä funktio kutsutaan HTML-napista (onclick="suljeModaali()")
function suljeModaali() {
    document.getElementById("viestiModaali").style.display = "none";
}

// ONKO VIIKKO AUKI
function viikkoOnAuki(indeksi) {
    let viikonPaiva = new Date(kesakalenteri.aloitusPaiva);
    viikonPaiva.setDate(viikonPaiva.getDate() + indeksi * 7);

    return tanaan >= viikonPaiva;
}

// NYKYINEN VIIKKO
function haeNykyinenViikko() {
    let paivat = Math.floor(
        (tanaan - kesakalenteri.aloitusPaiva) / (1000 * 60 * 60 * 24));

    let viikko = Math.floor(paivat / 7);

    if (viikko < 0) return 0;
    if (viikko >= kesakalenteri.viikot.length) {
        return kesakalenteri.viikot.length - 1;
    }

    return viikko;
}

// KALENTERIN LUONTI
function luoKalenteri() {
    let kalenteriElementti = document.getElementById("kalenteri");
    
    // Tyhjennetään kalenteri ensin siltä varalta, että funktiota kutsutaan useasti
    kalenteriElementti.innerHTML = "";

    for (let i = 0; i < kesakalenteri.viikot.length; i++) {
        let luukku = document.createElement("div");
        luukku.className = "luukku";

        let otsikko = document.createElement("h2");
        otsikko.textContent = "Viikko " + kesakalenteri.viikot[i].numero;
        luukku.appendChild(otsikko);

        if (viikkoOnAuki(i)) {
            luukku.onclick = function () {
                naytaViesti(kesakalenteri.viikot[i].teksti);
            };
        } else {
            luukku.classList.add("lukittu");
            luukku.onclick = function () {
                naytaViesti("Tämä viikko ei ole vielä alkanut. Malttia!");
            };
        }

        kalenteriElementti.appendChild(luukku);
    }
}

// SLOT-KONE
function pyoritaSlotJaPysahdy(kohdeViikko) {
    let luukut = document.getElementsByClassName("luukku");
    let viikkoja = luukut.length;
    let indeksi = 0;
    
    // Laske askeleet niin, että ne päätyvät tismalleen kohteeseen
    let askeliaYhteensa = (2 * viikkoja) + kohdeViikko;
    let nopeus = 80;

    pyorimisAani.currentTime = 0;
    pyorimisAani.play();

    function pyorita() {
        // 1. Poistetaan vanhat korostukset
        for (let i = 0; i < luukut.length; i++) {
            luukut[i].classList.remove("aktiivinen");
        }

        // 2. Korostetaan nykyinen indeksi
        luukut[indeksi].classList.add("aktiivinen");

        // 3. TARKISTUS: Jos askeleet loppuivat, pysähdytään TÄHÄN
        if (askeliaYhteensa === 0) {

            pyorimisAani.pause();
            voittoAani.play(); 

            if (viikkoOnAuki(indeksi)) {
                // Pieni viive modaaliin, jotta valo pysähtyy ensin
                setTimeout(() => {
                    naytaViesti(kesakalenteri.viikot[indeksi].teksti);
                }, 400);
            }
            return;
        }

        // 4. Vähennetään askeleet ja lasketaan seuraava indeksi
        askeliaYhteensa--;
        
        // Hidastusmekanismi lopussa
        if (askeliaYhteensa < 6) {
            nopeus += 150;
        }

        indeksi = (indeksi + 1) % viikkoja;
        setTimeout(pyorita, nopeus);
    }

    pyorita();
}

luoKalenteri();

// VIPU-NAPPI
document.getElementById("vipu").onclick = function () {
    pyoritaSlotJaPysahdy(haeNykyinenViikko());};
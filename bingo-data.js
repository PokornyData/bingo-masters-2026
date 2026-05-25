// Initial bingo data — pre-marked states from the source cards.
// State: 0 = pending (nerozhodnuto), 1 = won (získáno), 2 = lost (ztraceno)
// Cells are read row-by-row, left-to-right (4x4).

window.BINGO_PLAYERS = [
  {
    id: "poza",
    name: "Póža",
    character: "char-mustache-glasses",
    accent: "#7dd3fc", // sky blue
    cells: [
      { text: "VE VLÁDĚ DOJDE K VÝMĚNĚ MINIMÁLNĚ TŘÍ MINISTRŮ", state: 0 },
      { text: "RUSKO ZAÚTOČÍ NA JEDNU ZE ZEMÍ EU", state: 0 },
      { text: "PROCHÁZKA VYHRAJE TITULOVÝ ZÁPAS TKO NEBO KO VE TŘETÍM KOLE", state: 0 },
      { text: "BABIŠ NAZVE MOTORISTY SOBĚ „MOTORKAMI\" (PŘÍPADNĚ VÝRAZEM „MOTORKE\")", state: 0 },

      { text: "SPARTA POSTOUPÍ DO FINÁLE KONFERENČNÍ LIGY", state: 2 },
      { text: "V USA DOJDE K OZBROJENÉMU STŘETU MEZI ICE A CIVILISTY", state: 0 },
      { text: "MANDALORIAN & GROGU BUDE TŘI TÝDNY PO PREMIÉŘE NA ČSFD V MODRÝCH ČÍSLECH", state: 0 },
      { text: "SPIDERMAN: BRAND NEW DAY BUDE MÍT DVA TÝDNY PO PREMIÉŘE NA ČSFD PŘES 80 %", state: 0 },

      { text: "DONALD TRUMP ODSTOUPÍ Z FUNKCE KVŮLI EPSTEIN FILES", state: 0 },
      { text: "TRUMP NEBO AMERICKÁ VLÁDA POTVRDÍ NEBO S VELKOU PRAVDĚPODOBNOSTÍ UZNÁ MIMOZEMSKÝ KONTAKT", state: 0 },
      { text: "ČESKÁ HOKEJOVÁ REPREZENTACE BUDE V SEMIFINÁLE ZOH 26", state: 2 },
      { text: "ČEŠI SE DOSTANOU NA MS VE FOTBALE A POSTOUPÍ ZE SKUPINY", state: 0 },

      { text: "SEAN PENN ZÍSKÁ OSCARA ZA „JEDNA BITVA ZA DRUHOU\"", state: 1 },
      { text: "GTA VI BUDE ZNOVU ODLOŽENO", state: 0 },
      { text: "ZEMŘE VLADIMÍR PUTIN", state: 0 },
      { text: "V ÚTERÝ 4. SRPNA DOPOLEDNE BUDE V PŘÍBRAMI PRŠET", state: 0 },
    ],
  },
  {
    id: "poky",
    name: "Poky",
    character: "char-beanie-cards",
    accent: "#86efac", // green
    cells: [
      { text: "ORBÁN BUDE NA KONCI ROKU STÁLE PREMIÉREM", state: 2 },
      { text: "ANO BUDE MÍT NA KONCI ROKU V ÚSTÍ PRIMÁTORA", state: 0 },
      { text: "OSCAR ZA NEJLEPŠÍ FILM ZÍSKÁ „JEDNA BITVA ZA DRUHOU\"", state: 1 },
      { text: "ČR ZÍSKÁ NA ZOH CELKEM 3 MEDAILE", state: 2 },

      { text: "ČR SKONČÍ NA MS V HOKEJI ČTVRTÁ", state: 0 },
      { text: "NBA VYHRAJÍ OKLAHOMA CITY THUNDER", state: 0 },
      { text: "GTA 6 LETOS VYJDE", state: 0 },
      { text: "BITCOIN HITNE DALŠÍ HISTORICKÉ MAXIMUM", state: 0 },

      { text: "NA KONCI ROKU BUDE V PRAZE VLÁDNOUT ODS A ANO", state: 0 },
      { text: "HODNOTA AKCIÍ NVIDIE SE ZA ROK 2026 ZVEDNE MINIMÁLNĚ O 25 %", state: 0 },
      { text: "RŮST HDP ČR BUDE VÍCE NEŽ 2,2 %", state: 0 },
      { text: "DEMOKRATÉ VYHRAJÍ VOLBY DO KONGRESU USA", state: 0 },

      { text: "SPACEX BUDE UVEDEN NA AKCIOVÝ TRH", state: 0 },
      { text: "STÁT NEVYKOUPÍ ČEZ OD MINORITÁŘŮ", state: 0 },
      { text: "NEDOJDE K ODKUPU GRÓNSKA", state: 0 },
      { text: "HAVEL: HRÁTKY S ČERTEM ZÍSKÁ ALESPOŇ 1 MURIEL", state: 2 },
    ],
  },
  {
    id: "albi",
    name: "Albi",
    character: "char-dreads",
    accent: "#fca5a5", // soft red
    cells: [
      { text: "BOHDALKA RIP", state: 0 },
      { text: "DUNE P. 3 VÍC NEŽ 88 % NA ČSFD (31. 12.)", state: 0 },
      { text: "DEMOKRATICKÁ STRANA ZÍSKÁ VĚTŠINU V SENÁTU I SNĚMOVNĚ REP.", state: 0 },
      { text: "NEDOJDE KE ZMĚNĚ REŽIMU VE VENEZUELE (NEBUDOU USPOŘÁDÁNY SVOBODNÉ VOLBY)", state: 0 },

      { text: "NEDOJDE KE ZMĚNĚ REŽIMU V ÍRÁNU (NEBUDOU SVOBODNÉ VOLBY)", state: 0 },
      { text: "ČR ZÍSKÁ ZLATO NA ZOH 2026", state: 1 },
      { text: "ČR DO 3. MÍSTA NA MS V HOKEJI", state: 0 },
      { text: "ČR SE KVALIFIKUJE NA MS VE FOTBALE", state: 1 },

      { text: "SPARTA DOJDE MINIMÁLNĚ DO SEMIFINÁLE V KONFERENČNÍ LIZE", state: 2 },
      { text: "SAM ALTMAN NEBUDE CEO OPENAI NA KONCI ROKU 2026", state: 0 },
      { text: "PROCHÁZKA VYHRAJE VŠECHNY SVÉ ZÁPASY V UFC V ROCE 2026", state: 2 },
      { text: "FIDESZ NESESTAVÍ VLÁDU V MAĎARSKU PO VOLBÁCH NA JAŘE (WILDCARD: ORBÁN DO KONCE ROKU OBVINĚN Z KORUPCE A MUSÍ UTÉCT Z MAĎARSKA)", state: 0 },

      { text: "PADNE TEPLOTNÍ REKORD NA ÚZEMÍ ČR", state: 1 },
      { text: "BTC ZA VÍC NEŽ 120K", state: 0 },
      { text: "JOE ROGAN PROJEVÍ SEBEREFLEXI A POSTAVÍ SE KRITICKY KE SVÉ PODPOŘE TRUMPA", state: 1 },
      { text: "OBJEV MIKROBIÁLNÍHO ŽIVOTA MIMO ZEMI", state: 0 },
    ],
  },
  {
    id: "dejv",
    name: "Dejv",
    character: "char-beard-carrier",
    accent: "#fcd34d", // amber
    cells: [
      { text: "LITVÍNOV PŮJDE DO BARÁŽE, ALE UDRŽÍ SE V EXTRALIZE", state: 1 },
      { text: "TRUMP VOJENSKY NENAPADNE GRÓNSKO", state: 0 },
      { text: "PROCHÁZKA VS. CHIMAEV NESKONČÍ NA BODY", state: 0 },
      { text: "TONDA SE ROZEJDE S NATKOU", state: 1 },

      { text: "ZEMŘE JIŘINA BOHDALOVÁ", state: 0 },
      { text: "ZEMŘE MILOŠ ZEMAN", state: 0 },
      { text: "GTA 6 NEVYJDE V ROCE 2026", state: 0 },
      { text: "ICE ZABIJE MIN. 10 LIDÍ", state: 0 },

      { text: "FILIP TUREK BUDE MÍT DOPRAVNÍ NEHODU, O KTERÉ SE BUDE VEŘEJNĚ PSÁT (NE NUTNĚ JAKO ŘIDIČ)", state: 0 },
      { text: "STŘÍBRNÁ MEDAILE Z MS V HOKEJI MUŽŮ", state: 0 },
      { text: "WILL FLEURY SE STANE PRVNÍM ŠAMPIONEM TŘÍ VAHOVÝCH KATEGORIÍ V OKTAGONU", state: 0 },
      { text: "V LIDLU SE NAJDE BALÍČEK KOKSU (V BANÁNECH NEBO KDEKOLIV JINDE)", state: 0 },

      { text: "KARLOS VÉMOLA BUDE ODSOUZEN MIN. NA 6 LET", state: 0 },
      { text: "NA DONALDA TRUMPA BUDE SPÁCHÁN ATENTÁT", state: 1 },
      { text: "TIMOTHÉE CHALAMET DOSTANE OSCARA ZA FILM „VELKÝ MARTY\"", state: 2 },
      { text: "KAMPAŇ ZOMBICIDE: DEAD MEN TALES VYBERE MAX 3,5 MILIONU DOLARŮ", state: 2 },
    ],
  },
];

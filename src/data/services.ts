const BASE_URL = import.meta.env.BASE_URL

export interface Service {
    id: string
    title: string
    price: string
    shortDescription: string
    fullDescription: string
    features: string[]
    image: string
    delay: number
}

export const services: Service[] = [
    {
        id: 'manager-tabelle-orari',
        title: 'Manager Tabelle Orari',
        price: '€2.500,00',
        shortDescription:
            'Sistema intelligente per la gestione automatizzata dei turni e degli orari del personale.',
        fullDescription:
            'Manager Tabelle Orari è la soluzione definitiva per ottimizzare la pianificazione del personale. Utilizza algoritmi avanzati di AI per creare turni equilibrati, gestire ferie e permessi, e garantire la copertura ottimale in ogni momento. Integrazione completa con i sistemi di rilevazione presenze e payroll.',
        features: [
            'Pianificazione automatica turni con AI',
            'Gestione ferie, permessi e malattie',
            'Dashboard real-time sulla copertura',
            'Notifiche automatiche al personale',
            'Export per buste paga',
            'App mobile per dipendenti',
        ],
        image: `${BASE_URL}imgs/manager-tabelle-orari.webp`,
        delay: 0.1,
    },
    {
        id: 'gestionale-completo',
        title: 'Gestionale Completo',
        price: '€18.000,00',
        shortDescription:
            'Suite gestionale enterprise con moduli integrati per ogni aspetto della tua azienda.',
        fullDescription:
            'Il Gestionale Completo è una piattaforma enterprise all-in-one che copre ogni aspetto operativo della tua azienda. Dalla contabilità alla gestione magazzino, dalle risorse umane al CRM, tutto integrato in un unico ecosistema intelligente. Personalizzabile e scalabile per crescere con la tua attività.',
        features: [
            'Modulo contabilità e fatturazione elettronica',
            'Gestione magazzino e inventario',
            'CRM avanzato con automazioni',
            'Business Intelligence e reporting',
            'Gestione documentale',
            'Integrazione con e-commerce',
            'API per integrazioni custom',
        ],
        image: `${BASE_URL}imgs/gestionale-completo.webp`,
        delay: 0.2,
    },
    {
        id: 'gestionale-ecommerce',
        title: 'Gestionale E-commerce',
        price: '€9.600,00',
        shortDescription:
            'Piattaforma integrata per gestire il tuo negozio online con intelligenza artificiale.',
        fullDescription:
            'Gestionale E-commerce connette il tuo shop online con la gestione operativa quotidiana. Sincronizzazione automatica ordini, gestione inventario multi-canale, analisi predittive delle vendite e automazione del customer service. Compatibile con Shopify, WooCommerce, Magento e altre piattaforme.',
        features: [
            'Sincronizzazione multi-canale',
            'Gestione ordini automatizzata',
            'Inventario real-time',
            'Analisi predittive vendite',
            'Automazione email marketing',
            'Gestione resi e rimborsi',
        ],
        image: `${BASE_URL}imgs/gestionale-ecommerce.webp`,
        delay: 0.3,
    },
    {
        id: 'ionoleggio',
        title: 'ioNoleggio',
        price: '€7.500,00',
        shortDescription:
            'La soluzione completa per chi gestisce attività di noleggio veicoli e attrezzature.',
        fullDescription:
            'ioNoleggio è il gestionale specializzato per attività di noleggio. Che tu noleggi auto, biciclette, attrezzature sportive o macchinari industriali, ioNoleggio ti offre tutti gli strumenti per gestire prenotazioni, contratti, manutenzioni e fatturazione. Sistema di booking online integrato per i tuoi clienti.',
        features: [
            'Calendario prenotazioni interattivo',
            'Gestione flotta e disponibilità',
            'Contratti digitali con firma elettronica',
            'Tracciamento manutenzioni',
            'Sistema di booking online',
            'Fatturazione automatica',
            'App per check-in/check-out',
        ],
        image: `${BASE_URL}imgs/ionoleggio.webp`,
        delay: 0.4,
    },
    {
        id: 'miapizzeria',
        title: 'miaPizzeria',
        price: '€5.200,00',
        shortDescription:
            'Gestionale dedicato alle pizzerie con ordini, consegne e gestione cucina integrati.',
        fullDescription:
            'miaPizzeria è il gestionale pensato specificamente per pizzerie e ristoranti. Gestisci ordini al banco, al tavolo e delivery da un\'unica interfaccia. Sistema di comande digitali per la cucina, gestione rider e tracking consegne, menu digitale e integrazione con le principali piattaforme di food delivery.',
        features: [
            'POS touch-screen ottimizzato',
            'Gestione comande cucina digitale',
            'Ordini online e app dedicata',
            'Integrazione Glovo, Deliveroo, JustEat',
            'Gestione rider e tracking GPS',
            'Menu digitale con QR code',
            'Fidelity card e promozioni',
        ],
        image: `${BASE_URL}imgs/miapizzeria.webp`,
        delay: 0.5,
    },
    {
        id: 'sito-web-standard',
        title: 'Sito Web Standard',
        price: '€3.500,00',
        shortDescription:
            'Sito web professionale ottimizzato SEO e responsive, con form contatti e database integrato.',
        fullDescription:
            'Realizziamo il tuo sito web chiavi in mano: ottimizzato SEO per posizionarti sui motori di ricerca, responsive su desktop, tablet e mobile, completo di form contatti collegato a un database centralizzato per raccogliere e gestire le richieste dei tuoi clienti. Dominio, hosting, certificato SSL e analytics inclusi nella consegna.',
        features: [
            'Design responsive (desktop, tablet, mobile)',
            'Ottimizzazione SEO on-page',
            'Form contatti con protezione anti-spam',
            'Database contatti integrato',
            'Dominio, hosting e certificato SSL',
            'Google Analytics e Search Console',
            'Pagine standard: Home, Chi siamo, Servizi, Contatti',
        ],
        image: `${BASE_URL}imgs/sito-web-standard.webp`,
        delay: 0.6,
    },
    {
        id: 'documentazione-sicurezza-cantiere',
        title: 'Documentazione Sicurezza Cantiere',
        price: '€4.500,00',
        shortDescription:
            'Compilazione automatica delle schede di sicurezza con dati pescati da fonti diverse in base alla casistica.',
        fullDescription:
            'Sistema intelligente per la generazione automatica della documentazione di sicurezza cantiere (POS, PSC, DUVRI, valutazioni rischi). Aggrega i dati dalle fonti corrette in base al tipo di lavorazione, alla normativa applicabile e alla specificità del cantiere, riducendo drasticamente tempi e errori di compilazione manuale.',
        features: [
            'Compilazione automatica delle schede di sicurezza',
            'Aggregazione dati da fonti multiple',
            'Conformità con D.Lgs. 81/08',
            'Template POS, PSC, DUVRI pronti',
            'Archivio digitale della documentazione',
            'Aggiornamento automatico delle normative',
            'Export PDF pronti per la firma',
        ],
        image: `${BASE_URL}imgs/documentazione-sicurezza-cantiere.webp`,
        delay: 0.7,
    },
]

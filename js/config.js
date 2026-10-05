/* ============================================================
   EDIT THIS FILE to change content. Everything on the page reads from here.
   ============================================================ */
window.WEDDING = {
  bride: "Ekta",
  groom: "Gourav",
  monogram: "E & G",
  // Wedding countdown target (first event, IST)
  countdownTarget: "2026-11-23T11:00:00+05:30",
  year: 2026,
  month: 10,            // 0-based -> 10 = November
  days: [23, 24],       // highlighted dates on the calendar
  venue: {
    title: "Rudraksh Garden Resort",
    lines: ["Kumedi, Indore", "Madhya Pradesh 453555"],
    map: "https://www.google.com/maps/dir/22.7555182,75.8622013/Rudraksh+Garden+Resort,+QVQ5%2BR7,+Kumedi,+Indore,+Madhya+Pradesh+453555/@22.7721126,75.8424345,14z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x396303006da50e8f:0x110ae87d243943f5!2m2!1d75.8586407!2d22.7895978?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D"
  },
  events: [
    { day: 23, name: "The Golden Hour",           time: "11:00 AM", theme: "Pink Color",         icon: "sun"    },
    { day: 23, name: "The Glitz & Glam Night",    time: "7:00 PM",  theme: "Cocktail Attire",    icon: "coupe"  },
    { day: 24, name: "Sacrad Horizons",           time: "11:00 AM", theme: "Traditional Royal",  icon: "temple" },
    { day: 24, name: "Happily Ever After Hours",  time: "7:00 PM",  theme: "Free Style",         icon: "table"  }
  ],
  // ---- Optional integrations (static site => fill these in if you want them) ----
  // RSVP: paste a Formspree / Getform / Basin endpoint, e.g. "https://formspree.io/f/xxxxxxx"
  rsvpEndpoint: "",
  // Or a WhatsApp number with country code (digits only) to receive RSVPs as a pre-filled message, e.g. "919876543210"
  rsvpWhatsApp: "",
  // Wishes: optional endpoint to also receive wishes (same kind of form endpoint)
  wishEndpoint: "",
  // Background music file (put your own mp3 at assets/music.mp3). If missing, a soft synthesized melody plays.
  // YouTube song (plays through a hidden official YouTube player after "Tap to open")
  youtubeId: "",      // leave empty to use assets/music.mp3
  fallbackMelody: false, // true = play the soft built-in melody if the YouTube song cannot load
  youtubeStart: 0,   // start at N seconds, e.g. 25
  music: "assets/music.mp3"
};

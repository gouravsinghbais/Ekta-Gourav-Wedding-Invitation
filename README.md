# Ekta & Gourav — Wedding Invitation (static site)

Pure HTML/CSS/JS. No build step. Deploy by dragging this folder into Vercel (or `vercel --prod`).

## Before deploying
1. Copy your couple photo to `assets/couple_photo.png` (it appears inside the arch in the hero; if missing, a watercolor gazebo illustration is shown instead).
2. Optional: add `assets/music.mp3` (otherwise a soft synthesized melody plays after "Tap to open").
3. Optional: in `js/config.js` set `rsvpEndpoint` (Formspree/Getform URL) or `rsvpWhatsApp` to actually receive RSVPs. Without either, RSVPs are only stored in the guest's own browser.
4. All text (dates, events, venue, map link) lives in `js/config.js`.

Test locally: `python3 -m http.server` then open http://localhost:8000

## Music
The invitation plays `assets/music.mp3` after the guest taps the envelope (set in `js/config.js`).
To change the song, replace that file with another mp3 (keep the same name).

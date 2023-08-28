interface GameStrings {
  creditText: string;
  GOSSIP: string;
  BORING: string;
  SAVE_CANCEL: string;
  MAIL_CANCEL: string;
  habits: string[];
  features: string[];
  phrases: string[];
  colors: string[];
  races: string[];
  builds: string[];
  heroHasDied: string;
  Names: string[];
  signs: string[];
  interests: string[];
}

const gameStrings: GameStrings = {
  creditText:
    "\tDragon Court(tm) v1.2\n\tCopyright 1997-2000 Fred's Friends, Inc.\n\tHTTP://www.FFIends.com\n\n\t\tCode+Design: Fred Haslam\n\t\tMore Code: Elden Bishop\n\t\tMore Design: Lawrence Wegner\n\t\tArtwork: Ted Galaday\n\n\tMay the Farce be with you...",
  GOSSIP:
    "\tWhile sipping your brew you exchange lies and gossip with the locals.\n",
  BORING: "\n\tNoone seems interested in you...\n",
  SAVE_CANCEL: "Error while trying to save hero.\n---Action Canceled\n",
  MAIL_CANCEL: "Error while trying to send mail.\n---Action Canceled\n",
  habits: [
    "he bites his nails",
    "he sharpens his blade",
    "his left eye twitches spasmodically",
    "he picks at his armpits",
    "he chirps like a chipmuck",
    "he hums the royal anthem",
    "he fiddles with is belt buckle",
  ],
  features: [
    "a wine colored birthmark",
    "a hairy mole on cheek",
    "pointy ears",
    "overly developed thighs",
    "a lazy eye",
    "a beauty mark on cheek",
    "a cleft chin",
    "one ear missing",
    "a scar on one cheek",
    "a spider tattoo",
    "a unicorn tattoo",
  ],
  phrases: [
    "It's Clobberin' Time!",
    "Tally Ho!",
    "Have at Fiend!",
    "What time's da bar open?",
    "Hey babe, what's your sign?",
  ],
  colors: [
    "White",
    "Black",
    "Grey",
    "Beige",
    "Brown",
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Indigo",
    "Violet",
  ],
  races: [
    "Human",
    "Goblin",
    "Shide",
    "Elf",
    "Orc",
    "Dwarf",
    "GYPSY",
    "Gnome",
    "Troll",
    "Halfling",
  ],
  builds: [
    "Slender",
    "Stocky",
    "Average",
    "Dumpy",
    "Fat",
    "Thin",
    "Skeletal",
    "Muscular",
    "STRONG",
  ],
  heroHasDied:
    "Your hero has died today.\nReturn tomorrow for further quests.\n",
  Names: [
    "Amberdrake",
    "Bellifont",
    "Carroway",
    "Delacourt",
    "Evans",
    "Ferris",
    "Golan",
    "Hardawake",
    "Insult",
    "Jasper",
    "Killingfeld",
    "Lambert",
    "MacDougal",
    "Norbert",
    "Oswald",
    "Pembroke",
    "Quail",
    "Richards",
    "Sandoval",
    "Trevor",
    "Umbert",
    "Van Hogan",
    "Walters",
    "Xavier",
    "Yolanda",
    "Zelda",
  ],
  signs: [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ],
  interests: [
    "$He$ is an avid collector of butterflies.",
    "$He$ owns a stable of fine stallions.",
    "This noble is famous for $his$ wine collection.",
    "This noble is an old war hero with many decorations.",
    "This $man$ is rumored to secretly be the queens lover.",
    "This $man$ has a discerning eye for gemstones.",
    "$He$ has been drinking heavily.",
    "$He$ is rumored to have been an assasin.",
  ],
};

export default gameStrings;

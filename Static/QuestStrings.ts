interface QuestStrings {
  riddle: string[];
  answer: string[];
  guess: string[];
  seduces: string[];
  controls: string[];
  controlled: (string | null)[];
}

const questStrings: QuestStrings = {
  riddle: [
    "A drum that beats untouched, but halts when touched.",
    "What walks on four legs in the morning, two legs in the afternoon and three legs in the evening?",
    "Why did the gryphon cross the road?",
    "Why can't centaurs dance?",
    "There's something in my pocket, but there is nothing in my pocket, whats in my pocket?",
    "It goes through an apple, It points out the way, It fits in a bow, Then a target, to stay.",
    "What can run but never walks, has a mouth but never talks, has a bed but never sleeps?",
    "What is it which belongs to you, but others use it more than you do?",
    "What is it that a dog does lifting a leg, a man does standing up, and a woman does  sitting down?",
    "What occurs once in a minute, twice in a moment and never in an hour?",
    "Give it food and it will live, give it water and it will die.",
    "The more you take, the more you leave behind.",
    "I went into the woods and got it.  I sat down to seek it. I brought it home because I could not find it.",
  ],
  answer: [
    "A heart.",
    "Man",
    "To eat the puny mortal?",
    "They have two left feet.",
    "There's a hole in your pocket.",
    "An arrow",
    "A river",
    "My name.",
    "Shake hands.",
    "The letter 'M'",
    "Fire",
    "Footsteps",
    "A splinter.",
  ],
  guess: [
    "Uh... Reaganomics?",
    "Oatmeal!",
    "A power drill....",
    "Fine china.",
    "Lipo-suction?",
    "Green marbles, no - red ones!",
    "The Elephant Man?",
    "Was it Elvis?",
    "Fire ants!",
    "Thailand.",
    "Spitting?",
    "Fred's Friends, Inc. --right?",
    "Uhhh.... Uhhh.... Uh-oh...",
    "I used to know that one...",
    "Could you repeat that?",
    "I think I hear my mother calling.",
    "Beetlegoose! Beetlegoose!, Beetlegoose!",
    "A bottle nosed dolphin.",
    "An indian head penny.",
    "My sword in your gullet!",
  ],
  seduces: [
    "You share an intimite candlelight dinner for two.",
    "You take turns giving each other backrubs.",
    "You both hop into a hot, soapy bathtub!",
    "You exchange chaste kisses, giggling like teenagers.",
    "It writes you a love letter, in some foreign tongue.",
    "It humps your leg like a horny cocker spaniel.",
    "It belly dances for you, without asking for a tip.",
    "It sings you a romantic ballad in a high squeaky voice.",
  ],
  controls: [
    "leave it thinking it is a chicken.  Cluck, cluck.",
    "force its head to explode just like 'Scanners'",
    "send it on a road trip to Moscow for Vodka.",
    "tattoo \"I'm with stupid\" on its chest.",
    "take it to dinner and stick it with the bill.",
    "direct it to leap of the nearest cliff.",
    "order it to go chase Fenton Magus.",
    "send it out collecting flowers for its mother.",
  ],
  controlled: [
    null,
    "makes you stand on your head for an hour.",
    "sends you on a quest for posies.",
    "slaps you around like a red-headed stepchild.",
    "leaves you contemplating your own navel.",
    "forces you to suscribe to the Watch Tower.",
    "forces you to wear your clothes backwards.",
    "makes you sew name-tags in your underwear.",
  ],
};

export default questStrings;

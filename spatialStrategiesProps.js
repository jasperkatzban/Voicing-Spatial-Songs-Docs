const DEFAULT_PROMPT_POINT_RADIUS = .03;
const DEFAULT_PROMPT_HOVER_RADIUS = .06;
const DEFAULT_PROMPT_EXPANDED_RADIUS = .15;
const DEFAULT_PROMPT_PATH_SCALE = .0;
const DEFAULT_PROMPT_PATH_SPEED = .0003; //3
const DEFAULT_PROMPT_PATH_OFFSET = () => Math.random() * Math.PI * 2;

// TODO: handle scaling in object implementation
const R_SCALE = 2;
const R1 = .05 * R_SCALE;
const R2 = .087 * R_SCALE;
const R3 = .1 * R_SCALE;
const R4 = .133 * R_SCALE;
const R5 = .15 * R_SCALE;
const R6 = .174 * R_SCALE;
const R7 = .188 * R_SCALE; // TODO: adjust


// Option of Radial Arrangement
const promptItemTexts = ["Will you incorporate height into your compositions and take advantage of the vertical dimension?",
    "Simplicity? Multiplicity?",
    "Should the sound move, or should the audience move?",
    "How can you use spatial sound to reflect cultural, social, or emotional narratives?",
    "Do you want to use speakers as points in space in your composition or do you want the sum of all the speakers to represent one unified virtual space?",
    "Do you want to recreate the real world, or craft something otherworldly?",
    "Should every listener in the space experience the same, or do you embrace varied perspectives?",
    "Evoke physical sensations, such as dizziness, weightlessness, or tension",
    "Create a spatial interaction between real-world acoustic sounds and technologically mediated sounds",
    "Experiment with spatial memory",
    "Organize sounds in patterns or geometries, such as spirals, grids, or orbits",
    "Create spaces where multiple sound layers coexist but are only perceptible from specific listener positions",
    "Make a musical mobile",
    "Think of a thing, now think of this thing as a word, now think of this word as a sound, now think of this sound as a sound in space, now think of this sound-space as one you trust, now trust your own capacity for spatial imagination",
    "Set up a system to let go of control over the spatialization of sound",
    "Challenge the audience’s expectations of how a sound behaves in space",
    "Deconstruct traditional notions of foreground and background",
    "Redefine the roles of instruments or voices",
    "Compose sections that encompass varying levels of listening attention and listening modes",
    "Design how the listener should place themselves in the room - Is free movement a part of the piece? Does the room have a sweet spot? Does your composition incorporate directionality?",
    "How does sound localization impact the listener’s engagement with a composition?",
    "Create an illusion of sonic elements existing beyond the physical boundaries of the performance space.",
    "In most cases loudspeakers can’t project a 3D image in front of them. Can you?",
    "How does spatial sound challenge our experience of sound in time and space?",
    "How does spatial sound rely on memory and intuition?",
    'How does our anticipation of "what comes next" change?',
    "Explore the contrast between spatially diffused textures and sharply localized sonic events",
    "How can spatial sound explore the perception of time and causality?",
    "Let the space play with you: Experiment with how the natural acoustic character of a space can shape your work. The venue isn’t just a container — it’s a collaborator. Could you find a space where the reverb is already rich and resonant? How does the space itself become part of your spatialization?",
    "Find your sonic kin. Connect with others working in the field. Share your processes, ideas, doubts, and dreams. You might discover common ground — or fertile friction. Perhaps it’s the beginning of a new collaboration.",
    "Play the room: How can you place your speakers to make the space itself resonate and vibrate? Don’t be afraid to break the rules — sometimes the best results come when the speakers don’t face the audience at all.",
    "Explore speaker personalities. Different types of speakers have different sonic textures. How do their voices blend or clash? How can you compose with the colors of their sound, like instruments in an ensemble?",
    "What if the speakers moved? Think of them not just as objects, but as performers. What new sonic possibilities emerge when the speakers themselves are set in motion?",
    "Forget the rules. Clear your mind of convention. Just place the speakers. Send sound through them. Listen. Let the process surprise you.",
    "Whenever you start working, allow yourself one hour of artistic speed and freedom before you judge.",
    "Let the acoustics of the space improvise with your piece — how much will you allow the room to shape your composition?",
    "Think of spatial sound as choreography — how do your sounds move, collide, embrace, or avoid each other?",
    "Try to play with contrast and go from spatial to mono or stereo and back within the same song in a live show.",
    "Less is more: Try to work minimalistic with only a few things in the mix being immersive and the rest not moving around so much and in that way enhance the effect.",
    "How would you create sound sculptures?",
    "Can you show the immobile (a tree without wind for instance) through sound?",
    "Why would one give up on the idea of reproducibility and create a unique setup every single time?",
    "What if you were not the center? What if there were no center at all?",
    "Experiment with movement without space.",
    "Experiment with space without movement.",
    "Could you work separately with the space(s), the position(s) and the movement(s) within your spatial compositions?",
    "Think of 100 loudspeakers each holding bits of a single voice, then of a single loudspeaker holding 100 voices.",
    "What if loudspeakers were themselves moving?",
    "Imagine an instrument / interface / controller with which you can control sound spatially. What would that look and sound like?",
    "Make a piece of spatial music that doesn't prioritise “regular” musical parameters, pitch, rhythm, melody, harmony, form — but rather work with spatial parameters; envelopment, movement, spatial modulation, reverberation, echoes",
    "Does it really need to be spatial?",
    "Work with voices in space, as if they were physical bodies in a room and at some point, defy gravity.",
    "Think of spatial sound as a new colour in your compositional palette — how would you use red, if you had never seen it before?"
]

const descriptionText =
    `These cards have emerged through a collective exploration of spatial sound.\n
    Music creators from various fields that contributed to the anthology: Multi - Voicing Spatial Songs — How do we work with sound in space? were asked to submit prompts to this deck of spatial strategies.\n
    Each artist provided a unique perspective, resulting in a diverse pool of approaches to spatial composition, listening, and thinking.\n
    Inspired by Brian Eno and Peter Schmidt's Oblique Strategies, which help composers overcome creative blocks, our deck invites reflection and exploration rather than offering direct solutions.\n
    The prompts are designed to move beyond the “stereo-centric”, to encourage a deeper engagement with the possibilities of sound in space.`
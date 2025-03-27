const DEFAULT_PROMPT_X = window.innerWidth / 2;
const DEFAULT_PROMPT_Y = window.innerHeight / 2;
const DEFAULT_PROMPT_POINT_RADIUS = 50;
const DEFAULT_PROMPT_SOUND_RADIUS = 100;
const DEFAULT_PROMPT_PATH_SCALE = 20;
const DEFAULT_PROMPT_PATH_SPEED = .0003;
const DEFAULT_PROMPT_PATH_OFFSET = 0;

const R1 = 150;
const R2 = 260;
const R3 = 300;
const R4 = 320;

// Option of Radial Arrangement
const promptItems = [
    {
        key: 1,
        title: 'Deconstruct traditional notions of foreground and background',
        style: itemStyles.Center,
        soundURL: 'sounds/test-tone-1.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X,
        y: DEFAULT_PROMPT_Y,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 2,
        title: 'Redefine the roles of instruments or voices',
        style: itemStyles.Inner,
        soundURL: 'sounds/test-tone-2.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 0 / 3) * R1,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 0 / 3) * R1,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 3,
        title: 'Make a musical mobile',
        style: itemStyles.Inner,
        soundURL: 'sounds/test-tone-3.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 1 / 3) * R1,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 1 / 3) * R1,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 4,
        title: 'Will your work focus on traditional instrumentation, or will you branch out into new sonic materials and textures?',
        style: itemStyles.Inner,
        soundURL: 'sounds/test-tone-4.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 2 / 3) * R1,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 2 / 3) * R1,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 5,
        title: 'Set up a system to let go of control over the spatialization of sound ',
        style: itemStyles.Inner,
        soundURL: 'sounds/test-tone-2.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 3 / 3) * R1,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 3 / 3) * R1,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 6,
        title: 'Challenge the audience’s expectations of how a sound behaves in space ',
        style: itemStyles.Inner,
        soundURL: 'sounds/test-tone-3.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 4 / 3) * R1,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 4 / 3) * R1,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 7,
        title: 'Evoke physical sensations, such as dizziness, weightlessness, or tension',
        style: itemStyles.Inner,
        soundURL: 'sounds/test-tone-4.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 5 / 3) * R1,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 5 / 3) * R1,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 8,
        title: 'Create a spatial interaction between with real-world acoustic sounds and technological mediated sounds',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-5.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 1 / 6) * R2,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 1 / 6) * R2,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 9,
        title: 'Experiment with spatial memory',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 3 / 6) * R2,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 3 / 6) * R2,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 10,
        title: 'Organize sounds in patterns or geometries, such as spirals, grids, or orbits',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-7.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 5 / 6) * R2,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 5 / 6) * R2,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 11,
        title: 'Create spaces where multiple sound layers coexist but are only perceptible from specific listener positions',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-5.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 7 / 6) * R2,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 7 / 6) * R2,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 12,
        title: 'Play with timing – will sound movements sync with rhythm and tempo, or operate independently?',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-7.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 9 / 6) * R2,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 9 / 6) * R2,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 13,
        title: 'How can you use spatial sound to reflect cultural, social, or emotional narratives?',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 11 / 6) * R2,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 11 / 6) * R2,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 14,
        title: 'Should the sound move, or should the audience move?',
        style: itemStyles.Outer,
        soundURL: 'sounds/test-tone-8.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 1 / 3) * R3,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 1 / 3) * R3,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 15,
        title: 'Do you want to recreate the real world, or craft something otherworldly?',
        style: itemStyles.Outest,
        soundURL: 'sounds/test-tone-9.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 2 / 3) * R3,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 2 / 3) * R3,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 16,
        title: 'Do you want to use speakers as points in space in your composition or do you want the sum of all the speakers to represent one unified virtual space? ',
        style: itemStyles.Outest,
        soundURL: 'sounds/test-tone-10.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 4 / 3) * R3,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 4 / 3) * R3,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 17,
        title: 'Should every listener in the space experience the same, or do you embrace varied perspectives?',
        style: itemStyles.Outest,
        soundURL: 'sounds/test-tone-9.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI * 5 / 3) * R3,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI * 5 / 3) * R3,
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 18,
        title: 'Will you incorporate height into your compositions and take advantage of the vertical dimension?',
        style: itemStyles.Outest,
        soundURL: 'sounds/test-tone-10.mp3',
        imageUrl: 'images/test.png',
        x: DEFAULT_PROMPT_X + Math.sin(Math.PI) * R4,
        y: DEFAULT_PROMPT_Y + Math.cos(Math.PI) * R4,
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
]

// Option of paths passing through center
/*
const promptItems = [
    {
        key: 1,
        title: 'Deconstruct traditional notions of foreground and background',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 2,
        title: 'Redefine the roles of instruments or voices',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 3,
        title: 'Make a musical mobile',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 4,
        title: 'Will your work focus on traditional instrumentation, or will you branch out into new sonic materials and textures?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 5,
        title: 'Set up a system to let go of control over the spatialization of sound ',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 6,
        title: 'Challenge the audience’s expectations of how a sound behaves in space ',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 7,
        title: 'Evoke physical sensations, such as dizziness, weightlessness, or tension',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 8,
        title: 'Create a spatial interaction between with real-world acoustic sounds and technological mediated sounds',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 9,
        title: 'Experiment with spatial memory',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 10,
        title: 'Organize sounds in patterns or geometries, such as spIrals, grids, or orbits',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 11,
        title: 'Create spaces where multiple sound layers coexist but are only perceptible from specific listener positions',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 12,
        title: 'Play with timing – will sound movements sync with rhythm and tempo, or operate independently?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 13,
        title: 'How can you use spatial sound to reflect cultural, social, or emotional narratives?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 14,
        title: 'Should the sound move, or should the audience move?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 15,
        title: 'Do you want to recreate the real world, or craft something otherworldly?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 16,
        title: 'Do you want to use speakers as points in space in your composition or do you want the sum of all the speakers to represent one unified virtual space? ',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 17,
        title: 'Should every listener in the space experience the same, or do you embrace varied perspectives?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseLeft,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 18,
        title: 'Will you incorporate height into your compositions and take advantage of the vertical dimension?',
        style: itemStyles.Default,
        soundURL: 'sounds/test-tone-6.mp3',
        imageUrl: 'images/test.png',
        path: paths.roseRight,
        pathOffset: Math.random() * Math.PI * 3
    },
]
    */
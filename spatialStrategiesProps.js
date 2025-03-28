const DEFAULT_PROMPT_POINT_RADIUS = .07;
const DEFAULT_PROMPT_HOVER_RADIUS = .14;
const DEFAULT_PROMPT_PATH_SCALE = .04;
const DEFAULT_PROMPT_PATH_SPEED = .0003; //3
const DEFAULT_PROMPT_PATH_OFFSET = 0;

const R1 = .2;
const R2 = .35;
const R3 = .4;
const R4 = .405;

// Option of Radial Arrangement
const promptItems = [
    {
        key: 1,
        title: 'Deconstruct traditional notions of foreground and background',
        credit: 'SØSTR',
        style: itemStyles.Center,
        imageURL: 'images/test.png',
        x: 0,
        y: 0,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 2,
        title: 'Redefine the roles of instruments or voices',
        credit: 'SØSTR',
        style: itemStyles.Inner,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 0 / 3) * R1,
        y: Math.cos(Math.PI * 0 / 3) * R1,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 3,
        title: 'Make a musical mobile',
        credit: 'SØSTR',
        style: itemStyles.Inner,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 1 / 3) * R1,
        y: Math.cos(Math.PI * 1 / 3) * R1,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 4,
        title: 'Will your work focus on traditional instrumentation, or will you branch out into new sonic materials and textures?',
        credit: 'SØSTR',
        style: itemStyles.Inner,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 2 / 3) * R1,
        y: Math.cos(Math.PI * 2 / 3) * R1,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 5,
        title: 'Set up a system to let go of control over the spatialization of sound ',
        credit: 'SØSTR',
        style: itemStyles.Inner,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 3 / 3) * R1,
        y: Math.cos(Math.PI * 3 / 3) * R1,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 6,
        title: 'Challenge the audience’s expectations of how a sound behaves in space ',
        credit: 'SØSTR',
        style: itemStyles.Inner,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 4 / 3) * R1,
        y: Math.cos(Math.PI * 4 / 3) * R1,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 7,
        title: 'Evoke physical sensations, such as dizziness, weightlessness, or tension',
        credit: 'SØSTR',
        style: itemStyles.Inner,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 5 / 3) * R1,
        y: Math.cos(Math.PI * 5 / 3) * R1,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 8,
        title: 'Create a spatial interaction between with real-world acoustic sounds and technological mediated sounds',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 1 / 6) * R2,
        y: Math.cos(Math.PI * 1 / 6) * R2,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 9,
        title: 'Experiment with spatial memory',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 3 / 6) * R2,
        y: Math.cos(Math.PI * 3 / 6) * R2,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 10,
        title: 'Organize sounds in patterns or geometries, such as spirals, grids, or orbits',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 5 / 6) * R2,
        y: Math.cos(Math.PI * 5 / 6) * R2,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 11,
        title: 'Create spaces where multiple sound layers coexist but are only perceptible from specific listener positions',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 7 / 6) * R2,
        y: Math.cos(Math.PI * 7 / 6) * R2,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 12,
        title: 'Play with timing – will sound movements sync with rhythm and tempo, or operate independently?',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 9 / 6) * R2,
        y: Math.cos(Math.PI * 9 / 6) * R2,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 13,
        title: 'How can you use spatial sound to reflect cultural, social, or emotional narratives?',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 11 / 6) * R2,
        y: Math.cos(Math.PI * 11 / 6) * R2,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 14,
        title: 'Should the sound move, or should the audience move?',
        credit: 'SØSTR',
        style: itemStyles.Outer,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 1 / 3) * R3,
        y: Math.cos(Math.PI * 1 / 3) * R3,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 15,
        title: 'Do you want to recreate the real world, or craft something otherworldly?',
        credit: 'SØSTR',
        style: itemStyles.Outest,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 2 / 3) * R3,
        y: Math.cos(Math.PI * 2 / 3) * R3,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 16,
        title: 'Do you want to use speakers as points in space in your composition or do you want the sum of all the speakers to represent one unified virtual space? ',
        credit: 'SØSTR',
        style: itemStyles.Outest,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 4 / 3) * R3,
        y: Math.cos(Math.PI * 4 / 3) * R3,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 17,
        title: 'Should every listener in the space experience the same, or do you embrace varied perspectives?',
        credit: 'SØSTR',
        style: itemStyles.Outest,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI * 5 / 3) * R3,
        y: Math.cos(Math.PI * 5 / 3) * R3,
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 18,
        title: 'Will you incorporate height into your compositions and take advantage of the vertical dimension?',
        credit: 'SØSTR',
        style: itemStyles.Outest,
        imageURL: 'images/test.png',
        x: Math.sin(Math.PI) * R4,
        y: Math.cos(Math.PI) * R4,
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
]

// Option of PATHS passing through center
/*
const promptItems = [
    {
        key: 1,
        title: 'Deconstruct traditional notions of foreground and background',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 2,
        title: 'Redefine the roles of instruments or voices',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 3,
        title: 'Make a musical mobile',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 4,
        title: 'Will your work focus on traditional instrumentation, or will you branch out into new sonic materials and textures?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 5,
        title: 'Set up a system to let go of control over the spatialization of sound ',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3

    },
    {
        key: 6,
        title: 'Challenge the audience’s expectations of how a sound behaves in space ',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 7,
        title: 'Evoke physical sensations, such as dizziness, weightlessness, or tension',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 8,
        title: 'Create a spatial interaction between with real-world acoustic sounds and technological mediated sounds',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 9,
        title: 'Experiment with spatial memory',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 10,
        title: 'Organize sounds in patterns or geometries, such as spIrals, grids, or orbits',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 11,
        title: 'Create spaces where multiple sound layers coexist but are only perceptible from specific listener positions',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 12,
        title: 'Play with timing – will sound movements sync with rhythm and tempo, or operate independently?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 13,
        title: 'How can you use spatial sound to reflect cultural, social, or emotional narratives?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 14,
        title: 'Should the sound move, or should the audience move?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 15,
        title: 'Do you want to recreate the real world, or craft something otherworldly?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 16,
        title: 'Do you want to use speakers as points in space in your composition or do you want the sum of all the speakers to represent one unified virtual space? ',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 17,
        title: 'Should every listener in the space experience the same, or do you embrace varied perspectives?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_LEFT,
        pathOffset: Math.random() * Math.PI * 3
    },
    {
        key: 18,
        title: 'Will you incorporate height into your compositions and take advantage of the vertical dimension?',
        credit: 'SØSTR',
        style: itemStyles.Default,
        imageURL: 'images/test.png',
        path: PATHS.ROSE_RIGHT,
        pathOffset: Math.random() * Math.PI * 3
    },
]
    */
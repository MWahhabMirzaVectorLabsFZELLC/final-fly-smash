import { v4 as uuidv4 } from 'uuid';

export const generateElements = (setElements) => {
    const elementType = Math.random();
    const startY = -5;
    const minX = 0;
    const maxX = 90;
    const randomX = Math.random() * (maxX - minX) + minX;

    const mediumSize = 2;
    const flySize = 1; // Reduce size of fly

    if (elementType < 0.9) {
        const randomSize = Math.floor(Math.random() * 3) + 1;
        setElements((prevElements) => [
            ...prevElements,
            {
                id: uuidv4(), // Use UUID for unique key
                x: `${randomX}vw`,
                y: `${startY}vh`,
                pointValue: randomSize,
                size: randomSize,
                type: "apple",
            },
        ]);
    } else if (elementType < 0.97) {
        setElements((prevElements) => [
            ...prevElements,
            {
                id: uuidv4(), // Use UUID for unique key
                x: `${randomX}vw`,
                y: `${startY}vh`,
                pointValue: -5,
                size: mediumSize,
                type: "bomb",
            },
        ]);
    } else {
        setElements((prevElements) => [
            ...prevElements,
            {
                id: uuidv4(), // Use UUID for unique key
                x: `${randomX}vw`,
                y: `${startY}vh`,
                pointValue: 0,
                size: flySize, // Reduced size for fly
                type: "fly",
            },
        ]);
    }
};

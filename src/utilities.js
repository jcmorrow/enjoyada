const COLORS = ["blue", "green", "orange", "purple", "red", "white", "yellow"];
const randomIndex = coll => Math.floor(Math.random() * coll.length);

const randomColor = () => randomIndex(COLORS);

const differentByOne = (a, b) => Math.abs(a - b) === 1;

export { differentByOne, randomColor };

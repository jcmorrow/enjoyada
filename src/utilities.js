const COLORS = ["blue", "green", "orange", "purple", "red", "white", "yellow"];
const randomIndex = coll => Math.floor(Math.random() * coll.length);
const incrementColor = color => {
  if (color === COLORS.length - 1) {
    return 0;
  } else {
    return color + 1;
  }
};

export { COLORS, incrementColor, randomIndex };

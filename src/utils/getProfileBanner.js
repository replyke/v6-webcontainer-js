// Dynamic colorful profile banner generator using user ID as seed
export function generateProfileBanner(userId) {
  // Simple hash function to create a seed from userId
  const hash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const seed = hash(userId);

  // Seeded random number generator
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate multiple random values from the seed
  const random1 = seededRandom(seed);
  const random2 = seededRandom(seed * 2);
  const random3 = seededRandom(seed * 3);
  const random4 = seededRandom(seed * 4);
  const random5 = seededRandom(seed * 5);
  const random6 = seededRandom(seed * 6);
  const random7 = seededRandom(seed * 7);

  // Vibrant color palettes
  const colorPalettes = [
    // Electric neon
    { colors: ["#ff0080", "#7928ca", "#0070f3", "#00dfd8"], name: "neon" },
    // Tropical paradise
    { colors: ["#ff6b35", "#f7931e", "#ffcd3c", "#c5d86d"], name: "tropical" },
    // Cyber punk
    { colors: ["#ff007f", "#bf00ff", "#8000ff", "#4000ff"], name: "cyberpunk" },
    // Rainbow bright
    { colors: ["#ff4757", "#ff6b35", "#feca57", "#48ca48"], name: "rainbow" },
    // Ocean electric
    {
      colors: ["#00d4aa", "#01a3a4", "#2e86ab", "#a23b72"],
      name: "electric-ocean",
    },
    // Sunset explosion
    {
      colors: ["#ff9500", "#ff5722", "#e91e63", "#9c27b0"],
      name: "sunset-burst",
    },
    // Mint chocolate
    { colors: ["#16a085", "#27ae60", "#2ecc71", "#58d68d"], name: "mint" },
    // Fire coral
    { colors: ["#ff5722", "#ff7043", "#ff8a65", "#ffab91"], name: "coral" },
    // Purple galaxy
    { colors: ["#6a0dad", "#9d4edd", "#c77dff", "#e0aaff"], name: "galaxy" },
    // Citrus burst
    { colors: ["#ff6b35", "#ff8e53", "#ff9f43", "#feca57"], name: "citrus" },
  ];

  const selectedPalette =
    colorPalettes[Math.floor(random1 * colorPalettes.length)];

  // Truly interesting pattern types
  const patterns = [
    // Geometric triangles
    {
      type: "geometric-triangles",
      style: (
        "linear-gradient(135deg, " + selectedPalette.colors[0] + " 0%, " + selectedPalette.colors[1] + " 100%)," +
        "repeating-linear-gradient(45deg, transparent, transparent 20px, " + selectedPalette.colors[2] + "40 20px, " + selectedPalette.colors[2] + "40 40px)," +
        "repeating-linear-gradient(-45deg, transparent, transparent 25px, " + selectedPalette.colors[3] + "30 25px, " + selectedPalette.colors[3] + "30 50px)"
      ).replace(/\s+/g, " "),
    },
    // Organic blob shapes
    {
      type: "organic-blobs",
      style: (
        "radial-gradient(ellipse 80% 50% at " + (Math.floor(random2 * 40) + 20) + "% " +
        (Math.floor(random3 * 40) + 30) +
        "%, " + selectedPalette.colors[0] + " 0%, transparent 50%)," +
        "radial-gradient(ellipse 60% 70% at " + (Math.floor(random4 * 40) + 40) + "% " +
        (Math.floor(random5 * 30) + 20) +
        "%, " + selectedPalette.colors[1] + " 0%, transparent 50%)," +
        "radial-gradient(ellipse 90% 40% at " + (Math.floor(random6 * 30) + 60) + "% " +
        (Math.floor(random7 * 50) + 40) +
        "%, " + selectedPalette.colors[2] + " 0%, transparent 50%)," +
        "linear-gradient(135deg, " + selectedPalette.colors[3] + " 0%, " +
        selectedPalette.colors[0] +
        " 100%)"
      ).replace(/\s+/g, " "),
    },
    // Polka dot extravaganza
    {
      type: "polka-dots",
      style: (
        "radial-gradient(circle at 20% 20%, " + selectedPalette.colors[0] + " 15%, transparent 16%)," +
        "radial-gradient(circle at 60% 40%, " + selectedPalette.colors[1] + " 12%, transparent 13%)," +
        "radial-gradient(circle at 80% 70%, " + selectedPalette.colors[2] + " 10%, transparent 11%)," +
        "radial-gradient(circle at 30% 80%, " + selectedPalette.colors[3] + " 8%, transparent 9%)," +
        "radial-gradient(circle at 90% 10%, " + selectedPalette.colors[0] + " 6%, transparent 7%)," +
        "linear-gradient(45deg, " + selectedPalette.colors[2] + "20 0%, " + selectedPalette.colors[1] + "30 100%)"
      ).replace(/\s+/g, " "),
    },
    // Diagonal stripes party
    {
      type: "diagonal-party",
      style: (
        "repeating-linear-gradient(30deg, " + selectedPalette.colors[0] + " 0px, " + selectedPalette.colors[0] + " 15px, " + selectedPalette.colors[1] + " 15px, " + selectedPalette.colors[1] + " 30px)," +
        "repeating-linear-gradient(120deg, transparent 0px, transparent 10px, " + selectedPalette.colors[2] + "60 10px, " + selectedPalette.colors[2] + "60 20px)," +
        "linear-gradient(60deg, " + selectedPalette.colors[3] + "40 0%, " + selectedPalette.colors[0] + "40 100%)"
      ).replace(/\s+/g, " "),
    },
    // Hexagon honeycomb
    {
      type: "hexagon-honeycomb",
      style: (
        "radial-gradient(circle at 25% 25%, " + selectedPalette.colors[0] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 75% 25%, " + selectedPalette.colors[1] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 50% 50%, " + selectedPalette.colors[2] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 25% 75%, " + selectedPalette.colors[3] + " 20%, transparent 21%)," +
        "radial-gradient(circle at 75% 75%, " + selectedPalette.colors[0] + " 20%, transparent 21%)," +
        "linear-gradient(135deg, " + selectedPalette.colors[1] + "30 0%, " + selectedPalette.colors[2] + "30 100%)"
      ).replace(/\s+/g, " "),
    },
    // Color blocks mosaic
    {
      type: "color-blocks",
      style: (
        "linear-gradient(to right, " + selectedPalette.colors[0] + " 0%, " + selectedPalette.colors[0] + " 33%, " + selectedPalette.colors[1] + " 33%, " + selectedPalette.colors[1] + " 66%, " + selectedPalette.colors[2] + " 66%, " + selectedPalette.colors[2] + " 100%)," +
        "linear-gradient(90deg, transparent 0%, transparent 25%, " + selectedPalette.colors[3] + "70 25%, " + selectedPalette.colors[3] + "70 75%, transparent 75%, transparent 100%)"
      ).replace(/\s+/g, " "),
    },
    // Wavy ribbons
    {
      type: "wavy-ribbons",
      style: (
        "repeating-linear-gradient(" + Math.floor(random2 * 360) + "deg, " +
        selectedPalette.colors[0] +
        " 0px, " + selectedPalette.colors[1] + " 25px, " +
        selectedPalette.colors[2] +
        " 50px, " + selectedPalette.colors[3] + " 75px, " +
        selectedPalette.colors[0] +
        " 100px)," +
        "radial-gradient(ellipse at center, transparent 30%, " +
          selectedPalette.colors[1] +
        "40 70%)"
      ).replace(/\s+/g, " "),
    },
    // Starburst explosion
    {
      type: "starburst",
      style: (
        "conic-gradient(from " + Math.floor(random3 * 360) + "deg, " +
        selectedPalette.colors[0] +
        " 0deg, " + selectedPalette.colors[1] + " 90deg, " +
        selectedPalette.colors[2] +
        " 180deg, " + selectedPalette.colors[3] + " 270deg, " +
        selectedPalette.colors[0] +
        " 360deg)," +
        "radial-gradient(circle at 50% 50%, transparent 30%, " +
          selectedPalette.colors[0] +
        "20 70%)"
      ).replace(/\s+/g, " "),
    },
  ];

  const selectedPattern = patterns[Math.floor(random2 * patterns.length)];

  return {
    backgroundImage: selectedPattern.style,
    patternType: selectedPattern.type,
    palette: selectedPalette.name,
  };
}

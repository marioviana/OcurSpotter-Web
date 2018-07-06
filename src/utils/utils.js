function colorType(type) {
  let color = "grey";
  switch (type) {
    case "Animals":
      color = "blue";
      break;
    case "Roads and Signs":
      color = "orange";
      break;
    case "Lightning and Energy":
      color = "green";
      break;
    case "Gardens and Environment":
      color = "purple";
      break;
    case "Forest":
      color = "pink";
      break;
    case "Cleansing and conservation":
      color = "brown";
      break;
    case "Pavement and Sidewalks":
      color = "olive";
      break;
    case "Waters and Sewers":
      color = "red";
      break;
    case "Garbage collection":
      color = "yellow";
      break;
    case "Vehicles":
      color = "teal";
      break;
    case "Suggestion":
      color = "violet";
      break;
    default:
      color = "grey";
      break;
  }
  return color;
};

export default colorType;

export const filterOutput = (output) => {
  const start = output.indexOf("[");
  const end = output.lastIndexOf("]") + 1;

  const arrayString = output.slice(start, end);

  const parsedArray = JSON.parse(arrayString);
  return parsedArray;
};

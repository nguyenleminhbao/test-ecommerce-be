export const getRandomArray = (arr: string[]) => {
  const numElements = 4;
  // Handle invalid input
  if (numElements > arr.length) {
    throw new Error(
      'Number of elements to pick cannot be greater than array length',
    );
  }

  // Create a copy to avoid modifying the original
  const copy = arr.slice();

  // Use a Set for efficient duplicate removal
  const resultSet = new Set();

  // Loop until we have the desired number of unique random elements
  while (resultSet.size < numElements) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    resultSet.add(copy[randomIndex]);
  }

  // Convert the Set back to an array
  return Array.from(resultSet);
};

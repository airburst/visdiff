export const chunk = (arr, batchSize = 5) =>
  arr.length
    ? [arr.slice(0, batchSize), ...chunk(arr.slice(batchSize), batchSize)]
    : [];

export const runBatch = async (items = [], action, params) => {
  const batches = chunk(items);
  let run = 1;

  for (const batch of batches) {
    const actionPromises = batch.map((url) => action({ url, ...params }));

    await Promise.all(actionPromises);
    console.log(`Run ${run++} complete`);
  }
};

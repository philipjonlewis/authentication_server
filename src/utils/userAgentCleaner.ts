const userAgentCleaner = async (x: any) => {
  for (const y in x) {
    if (x.hasOwnProperty(y) && x[y] === false) {
      delete x[y];
    }
  }
  return await x;
};

export { userAgentCleaner };

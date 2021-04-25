const get = async (url) => {
  const res = await fetch(url);

  return res.json();
};

export { get };

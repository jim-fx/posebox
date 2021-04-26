const get = async (url) => {
  const res = await fetch(url);

  return res.json();
};

const post = async (url, body) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

export { get, post };

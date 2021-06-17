const get = async (url) => {
  console.log("[API-get] " + url);

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

const put = async (url, body) => {
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

export { get, post, put };

const cache = {
  projects: {},
  work_experiences: {},
};

export const fetchData = (username, type) => {
  let endpoint = 'work_experiences';
  if (type === 'portfolio') endpoint = 'projects';
  if (cache[endpoint][username]) return Promise.resolve(cache[endpoint][username]);

  return fetch(`https://api.codersrank.io/v2/users/${username}/${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      cache[endpoint][username] = data.projects || data.work_experiences || [];
      return data.projects || data.work_experiences || [];
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.error(err);
      return Promise.reject(err);
    });
};

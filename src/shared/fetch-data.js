const cache = {
  projects: {},
  work_experiences: {},
};

export const fetchData = (username, type) => {
  let endpoint = 'work_experiences';
  if (type === 'portfolio') endpoint = 'projects';
  if (cache[endpoint][username]) return Promise.resolve(cache[endpoint][username]);
  if (type === 'technologies') {
    return Promise.all([
      fetchData(username, 'portfolio'),
      fetchData(username, 'workexperience'),
    ])
      .then(([projects, work_experiences]) => {
        projects.forEach((item) => {
          // eslint-disable-next-line
          item._type = 'portfolio';
        });
        work_experiences.forEach((item) => {
          // eslint-disable-next-line
          item._type = 'workexperience';
        });
        return [...projects, ...work_experiences];
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error(err);
        return Promise.reject(err);
      });
  }

  return fetch(`https://api.codersrank.io/v2/users/${username}/${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let projects = [];
      let workExperiences = [];
      if (typeof data.projects !== 'undefined') {
        projects = data.projects.filter((e) => {
          return e.start_date !== '0001-01';
        });
      }
      if (typeof data.work_experiences !== 'undefined') {
        workExperiences = data.work_experiences.filter((e) => {
          return e.start_date !== '0001-01';
        });
      }
      cache[endpoint][username] = projects || workExperiences || [];
      return projects || workExperiences || [];
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.error(err);
      return Promise.reject(err);
    });
};

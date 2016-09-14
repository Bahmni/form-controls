import 'whatwg-fetch';

export const httpInterceptor = {
  get: (url) =>
    fetch(url, { credentials: 'same-origin', Accept: 'application/json' })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }),
};

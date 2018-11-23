import { configure } from '@storybook/react';

const req = require.context('../stories', true, /^.*Story\.js$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);

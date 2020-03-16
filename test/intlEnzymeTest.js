import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
const Adapter = require('enzyme-adapter-react-15');
const enzyme = require('enzyme');
enzyme.configure({ adapter: new Adapter() });
const { shallow, mount } = enzyme;

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
const messages = { TEST_KEY: 'test value', HTML_DESC_KEY: 'test value <h1>Heading goes here</h1>' }; // en.json

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

/**
 * Export these methods.
 */
export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node), { context: { intl } });
}

export function mountWithIntl(node) {
  return mount(nodeWithIntlProp(node), {
    context: { intl },
    childContextTypes: { intl: intlShape },
  });
}

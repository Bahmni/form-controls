import React from 'react';
import { IntlProvider, createIntl } from 'react-intl';
const Adapter = require('enzyme-adapter-react-16');
const enzyme = require('enzyme');
enzyme.configure({ adapter: new Adapter() });
const { shallow, mount } = enzyme;

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
const messages = { TEST_KEY: 'test value', HTML_DESC_KEY: 'test value <h1>Heading goes here</h1>' }; // en.json

// Create the IntlProvider to retrieve context for wrapping around.
// const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const intl = createIntl({ locale: 'en', messages });

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

const defaultLocale = 'en';
const locale = defaultLocale;

export function mountWithIntl(node) {
  return mount(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages,
    },
    context: { intl },
  });
}

export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node), {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
      messages,
    },
    context: { intl },
  });
}

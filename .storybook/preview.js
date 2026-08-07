import React from 'react';
import { IntlProvider } from 'react-intl';
// Carbon component styles for the Bahmni Design System controls. Imported
// before styles.scss so the legacy form-builder rules still cascade last.
import '@bahmni/design-system/styles';
import '../styles/styles.scss';

export default {
  decorators: [
    (Story) => (
      <IntlProvider locale="en" messages={{}} onError={() => {}}>
        <Story />
      </IntlProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Introduction",
          "Atomic Controls",
          ["Bahmni Design System", "Legacy Components"],
          "Complex Controls",
          ["Bahmni Design System", "Legacy Components"],
          "Orchestrator",
          "Example Forms",
        ],
      },
    },
  },
};


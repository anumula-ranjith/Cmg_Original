// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const foundKeys = Object.create(null);

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Validate all e2e-test have a single JIRAKEY meta tag',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      missing: "Missing JIRAKEY meta tag (e.g.: test.meta('JIRAKEY', 'ECM-00000'))",
      multiple: 'Multiple JIRAKEY meta tags not allowed on a single test',
      duplicate: "Non-unique JIRAKEY meta tag '{{ jirakey }}'",
    },
  },

  create(context) {
    let key;

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------
    return {
      Identifier: function (node) {
        // Ignore non-e2e-spec files
        if (context.getFilename().indexOf('e2e-spec') === -1) {
          return;
        }

        // Ignore non-test nodes
        if (node.name !== 'test') {
          return;
        }

        // Get nodes with JIRAKEY
        const jiraKeys = context
          .getAncestors()
          .filter(n => n.type === 'CallExpression')
          .filter(n => n.arguments[0].value === 'JIRAKEY');

        // Check JIRAKEY count
        switch (jiraKeys.length) {
          case 0: // No JIRAKEY found
            /* Required workaround until ECM-25838 - Support for testing in INT in implemented:
                'No JIRAKEY found' disabled to allow tests to exist without a JIRAKEY as part of the Playwright migration.
                We cannot have the same JIRAKEY in both Test Cafe and Playwright. Typically, we delete the Test Cafe test when ported.
                However, there are scenarios where we need both the Test Cafe and Playwright version to exist so that the Test Cafe version continue to run in INT.
                In this scenario, we simply add the JIRAKEY to the Playwright test (for Xray reporting), and remove it from the Test Cafe version (to avoid xray reporting issues)
                Once support for running Playwright in INT is supported, we can fully remove the Test Cafe versions of tests that have been ported and re-enable this rule.
            */
            // context.report({ node, messageId: 'missing' });
            return;
          case 1: // Expected amount
            key = jiraKeys[0].arguments[1].value;
            break;
          default:
            // More than one found
            context.report({ node, messageId: 'multiple' });
            return;
        }

        // Check if duplicate
        if (foundKeys[key]) {
          context.report({ node, messageId: 'duplicate', data: { jirakey: key } });
        } else {
          foundKeys[key] = key;
        }
      },
    };
  },
};

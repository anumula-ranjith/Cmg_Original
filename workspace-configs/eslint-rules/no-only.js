//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Disallow use of `.only` calls',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: "'.only' not allowed - remove before commit!",
    },
  },

  create(context) {
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

        // Get nodes with 'only'
        const onlyIdentifiers = context
          .getAncestors()
          .filter(n => n.type === 'MemberExpression')
          .filter(n => n.property.name === 'only');

        // Output error if 'only' found
        if (onlyIdentifiers.length > 0) {
          context.report({ node, messageId: 'unexpected' });
        }
      },
    };
  },
};

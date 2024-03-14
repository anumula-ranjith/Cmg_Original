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
      description: 'Require skip reason via a meta tag',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: "'.skip' missing matching .meta('SKIP_REASON, '...')'",
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
        const skipIdentifiers = context
          .getAncestors()
          .filter(n => n.type === 'MemberExpression')
          .filter(n => n.property.name === 'skip');

        const skipReason = context
          .getAncestors()
          .filter(n => n.type === 'CallExpression')
          .filter(n => n.arguments[0].value === 'SKIP_REASON');

        // Output error if 'only' found
        if (skipIdentifiers.length > 0 && skipReason.length <= 0) {
          context.report({ node, messageId: 'unexpected' });
        }
      },
    };
  },
};

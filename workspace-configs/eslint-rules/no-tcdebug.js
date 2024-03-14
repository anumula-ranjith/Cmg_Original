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
      description: 'Disallow use of `tc.debug()` calls',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: 'tc.debug() not allowed - remove before commit!',
    },
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    function nodeIsCalledByTc(node) {
      return node.type === 'Identifier' && node.name === 'tc';
    }

    function isTcDebug(node) {
      return node.type === 'Identifier' && node.name === 'debug';
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      MemberExpression: function (node) {
        if (nodeIsCalledByTc(node.object) && isTcDebug(node.property)) {
          context.report({ node, messageId: 'unexpected' });
        }
      },
    };
  },
};

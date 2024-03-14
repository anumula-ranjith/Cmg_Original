/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
// eslint-disable-next-line @nx/enforce-module-boundaries
import 'core-js/stable';
import 'regenerator-runtime/runtime';

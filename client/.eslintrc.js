module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-underscore-dangle': 'off',
    'func-names': 'off',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'max-len': 'off',
    'react/jsx-props-no-spreading': 'off'
  },
  'globals': {
    "fetch": false
  }
}
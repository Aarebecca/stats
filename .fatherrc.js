export default {
  esm: {
    overrides: {
      'src/server': {
        platform: 'node',
      },
    },
    output: 'dist',
  },
};

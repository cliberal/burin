require('yargs')
  .command('$0', 'the default command', yargs => {}, argv => require('./create')(argv))
  .option('template', {
    alias: 't',
    default: 'react',
  })
  .option('yes', {
    alias: 'y',
    default: false,
  }).argv

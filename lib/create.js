const nunjucks = require('nunjucks')
const pkgDir = require('pkg-dir')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const globby = require('globby')
const path = require('path')

// get project root dir
const ROOT_DIR = pkgDir.sync()

function getTemplatePath(rootDir) {
  let entries = globby
    .sync('.burin/**/*.njk', { cwd: rootDir, dot: true, gitignore: true })
    .map(item => path.join(rootDir, item))
  return entries
}

function getTargetPath(target, sourceFile, moduleName, burinDir) {
  const templateFileRelativePath = sourceFile
    .replace(`${burinDir}/template/`, '')
    .replace('MODULE_NAME', moduleName)
    .replace('.njk', '')

  return path.join(ROOT_DIR, target, templateFileRelativePath)
}

async function createModule(argv) {
  const moduleName = argv._[0]
  const burinDir = path.join(ROOT_DIR, '.burin')
  if (!fs.pathExistsSync(burinDir)) {
    console.log(chalk.red('Please make .burin directory!'))
    process.exit(1)
  }

  // define context of nunjucks template
  const CONTEXT = {
    ...require(path.join(burinDir, './context.js')),
    MODULE_NAME: moduleName,
    MODULE_NAME_CAMEL: moduleName.substring(0, 1).toLowerCase() + moduleName.substring(1),
  }

  const templateFiles = getTemplatePath(ROOT_DIR)

  // prompt enter the target parent dir
  const { target } = await inquirer.prompt([
    {
      name: 'target',
      type: 'input',
      message: 'Enter the source directory of your project',
      default: 'src',
    },
  ])

  if (target) {
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templateFiles, { autoescape: false }))

    templateFiles.forEach(file => {
      env.render(file, CONTEXT, (err, res) => {
        const targetfile = getTargetPath(target, file, moduleName, burinDir)
        fs.outputFile(targetfile, res).then(() => {
          console.log(chalk.cyan(`generated: ${targetfile}`))
        })
      })
    })
  }
}

module.exports = (...args) => {
  createModule(...args).catch(err => {
    console.log(chalk.red(err))
    process.exit(1)
  })
}

const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a page',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'page name please',
    validate: notEmpty('name')
  }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/pages/${name}/index.js`,
      templateFile: 'plop-templates/page/index-js.hbs',
      data: {
        name: name
      }
    }, {
      type: 'add',
      path: `src/pages/${name}/index.scss`,
      templateFile: 'plop-templates/page/index-scss.hbs',
      data: {
        name: name
      }
    }, {
      type: 'add',
      path: `src/pages/${name}/index.html`,
      templateFile: 'plop-templates/page/index-html.hbs',
      data: {
        name: name
      }
    }]
    return actions
  }
}

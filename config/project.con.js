const projectName = require('./projects')

const config = {
    'tms': { title: '采食家平台', subSystem: 'tms', pro: 'shujun/tms-server', tokenName: 'tms' },
}

const configObj = config[projectName.name];
configObj.projectName = projectName.name;
module.exports = configObj
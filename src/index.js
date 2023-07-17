/**
 * statistic repo
 */

const { execSync } = require('child_process');
const core = require('@actions/core');
const https = require('https');
const fs = require('fs');

const repo = process.env.GITHUB_REPOSITORY;

/**
 * get today and last week in format YYYY-MM-DD
 */
function getRange() {
  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const format = (date) => date.toISOString().split('T')[0];
  return [format(lastWeek), format(today)];
}

const range = getRange();

/**
 * execute command in shell
 */
function exec(command) {
  return execSync(command).toString();
}

/**
 * request github api
 */
async function request(search) {
  const url = `https://api.github.com/search/${search}`;
  const headers = {
    'User-Agent': 'request',
    Authorization: `Bearer ${core.getInput('GITHUB_TOKEN')}`,
  };
  // make post request
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', reject);
  });
}

/**
 * get commit count in range
 */
function getCommitCount() {
  const [since, until] = range;
  const command = `git rev-list --count --since=${since} --before=${until} HEAD`;
  const result = exec(command);
  // format
  return parseInt(result.replace('\n', ''));
}

/**
 * get open issue count in range
 */
async function getOpenIssueCount() {
  const [since, until] = range;
  const open_issues = await request(
    `issues?q=repo:${repo}+is:issue+is:open+created:${since}..${until}`
  );
  return open_issues.total_count;
}

/**
 * get closed issue count in range
 */
async function getClosedIssueCount() {
  const [since, until] = range;
  const closed_issues = await request(
    `issues?q=repo:${repo}+is:issue+is:closed+created:${since}..${until}`
  );
  return closed_issues.total_count;
}

/**
 * get open pr count in range
 */
async function getOpenPRCount() {
  const [since, until] = range;
  const open_prs = await request(
    `issues?q=repo:${repo}+is:pr+is:open+created:${since}..${until}`
  );
  return open_prs.total_count;
}

/**
 * get closed pr count in range
 */
async function getClosedPRCount() {
  const [since, until] = range;
  const closed_prs = await request(
    `issues?q=repo:${repo}+is:pr+is:closed+created:${since}..${until}`
  );
  return closed_prs.total_count;
}

/**
 * get added line count in range
 */
async function getAddedLineCount() {
  const [since, until] = range;
  const command = `git log --since=${since} --before=${until} --pretty=tformat: --numstat | awk '{ add += $1 } END { print add }' -`;
  const result = exec(command);
  return parseInt(result.replace('\n', ''));
}

/**
 * get deleted line count in range
 */
async function getDeletedLineCount() {
  const [since, until] = range;
  const command = `git log --since=${since} --before=${until} --pretty=tformat: --numstat | awk '{ del += $2 } END { print del }' -`;
  const result = exec(command);
  return parseInt(result.replace('\n', ''));
}

/**
 * get contributors' id in range
 */
async function getContributorIds() {
  const [since, until] = range;
  const result = await request(
    `commits?q=repo:${repo}+author-date:${since}..${until}`
  );
  const contributors = Array.from(
    new Set(result.items.map((item) => item.author.login))
  );
  return contributors.join(',') + ` (${contributors.length})`;
}

const Metric = [
  getCommitCount,
  getOpenIssueCount,
  getClosedIssueCount,
  getOpenPRCount,
  getClosedPRCount,
  getAddedLineCount,
  getDeletedLineCount,
  getContributorIds,
];

async function stats(metric = Metric, range = getRange()) {
  const data = await Promise.all(metric.map((fn) => fn()));
  const [
    commit_count,
    open_issue_count,
    closed_issue_count,
    open_pr_count,
    closed_pr_count,
    added_line_count,
    deleted_line_count,
    contributor_count,
  ] = data;
  const [start_date, end_date] = range;
  const result = {
    repo,
    start_date,
    end_date,
    commit_count,
    open_issue_count,
    closed_issue_count,
    open_pr_count,
    closed_pr_count,
    added_line_count,
    deleted_line_count,
    contributor_count,
  };
  return result;
}

const nameMap = {
  repo: '仓库',
  metric: '指标',
  value: '详情',
  start_date: '开始日期',
  end_date: '结束日期',
  commit_count: '提交数',
  total_issue_count: '总 Issue 数',
  open_issue_count: '新增 Issue',
  closed_issue_count: '关闭 Issue',
  total_pr_count: '总 PR 数',
  open_pr_count: '新增 PR',
  closed_pr_count: '关闭 PR',
  added_line_count: '新增行数',
  deleted_line_count: '删除行数',
  total_line_count: '总行数',
  contributor_count: '贡献者数',
};

function exportResultToMarkdown(rp) {
  const header = `| ${nameMap.metric} | ${nameMap.value} |\n| --- | --- |\n`;
  const content = Object.entries(rp)
    .map(([key, value]) => {
      return `| ${nameMap[key]} | ${value} |`;
    })
    .join('\n');
  return header + content;
}

function isBranchExist(branch) {
  try {
    execSync(`git rev-parse --verify "${branch}"`, {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function submit(md) {
  console.log(md);
  try {
    // 获取保存到仓库的标志位
    const saveToRepo = core.getInput('SAVE_TO_REPO');
    if (saveToRepo === 'true') {
      // 获取分支名称或使用默认值
      const branchName = core.getInput('REPORT_BRANCH');

      // 配置 Git 用户信息
      exec('git config --global user.name "GitHub Actions"');
      exec('git config --global user.email "actions@github.com"');

      // 判断分支是否存在，不存在则创建
      if (!isBranchExist(branchName)) {
        exec(`git checkout --orphan "${branchName}"`);
        exec('git rm -rf .');
        exec('git commit --allow-empty -m "Create empty branch"');
      } else {
        exec(`git checkout "${branchName}"`);
      }

      const file = range[1];
      // 生成 Markdown 表格文件
      fs.writeFileSync(`${file}.md`, md);

      // 提交 Markdown 表格文件
      exec(`git add ${file}.md`);
      exec(`git commit -m "chore: Weekly stats (${file})."`);
      exec(`git push origin "${branchName}"`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function run() {
  const rp = await stats();
  const content = exportResultToMarkdown(rp);
  submit(content);
}

run();

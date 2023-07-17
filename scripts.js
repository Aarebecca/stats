/**
 * statistic repo
 */

const { execSync } = require('child_process');
const https = require('https');

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
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
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
function getCommitCount(range) {
  const [since, until] = range;
  const command = `git rev-list --count --since=${since} --before=${until} HEAD`;
  const result = exec(command);
  // format
  return parseInt(result.replace('\n', ''));
}

const { OWNER, REPO } = process.env;

/**
 * get open issue count in range
 */
async function getOpenIssueCount(range) {
  const [since, until] = range;
  const open_issues = await request(
    `issues?q=repo:${OWNER}/${REPO}+is:issue+is:open+created:${since}..${until}`
  );
  return open_issues.total_count;
}

/**
 * get closed issue count in range
 */
async function getClosedIssueCount(range) {
  const [since, until] = range;
  const closed_issues = await request(
    `issues?q=repo:${OWNER}/${REPO}+is:issue+is:closed+created:${since}..${until}`
  );
  return closed_issues.total_count;
}

/**
 * get open pr count in range
 */
async function getOpenPRCount(range) {
  const [since, until] = range;
  const open_prs = await request(
    `issues?q=repo:${OWNER}/${REPO}+is:pr+is:open+created:${since}..${until}`
  );
  return open_prs.total_count;
}

/**
 * get closed pr count in range
 */
async function getClosedPRCount(range) {
  const [since, until] = range;
  const closed_prs = await request(
    `issues?q=repo:${OWNER}/${REPO}+is:pr+is:closed+created:${since}..${until}`
  );
  return closed_prs.total_count;
}

/**
 * get added line count in range
 */
async function getAddedLineCount(range) {
  const [since, until] = range;
  const command = `git log --since=${since} --before=${until} --pretty=tformat: --numstat | awk '{ add += $1 } END { print add }' -`;
  const result = exec(command);
  return parseInt(result.replace('\n', ''));
}

/**
 * get deleted line count in range
 */
async function getDeletedLineCount(range) {
  const [since, until] = range;
  const command = `git log --since=${since} --before=${until} --pretty=tformat: --numstat | awk '{ del += $2 } END { print del }' -`;
  const result = exec(command);
  return parseInt(result.replace('\n', ''));
}

/**
 * get contributors' id in range
 */
async function getContributorIds(range) {
  const [since, until] = range;
  const result = await request(
    `commits?q=repo:${OWNER}/${REPO}+author-date:${since}..${until}`
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
  const data = await Promise.all(metric.map((fn) => fn(range)));
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
    owner: OWNER,
    repo: REPO,
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
  owner: '所有者',
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

async function run() {
  const rp = await stats();
  const content = exportResultToMarkdown(rp);
  console.log(content);
}

run();

/**
 * statistic repo
 */

const memorize = require('lodash.memoize');
const { execSync } = require('child_process');
const core = require('@actions/core');
const https = require('https');
const fs = require('fs');

const { MANUAL } = process.env;

function getConfig() {
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
  const token = fs.readFileSync('./TOKEN', 'utf-8');
  config.token = token;
  return config;
}

const config = getConfig();

function dateFormat(date) {
  return date.toISOString().split('T')[0];
}

function getRanges(startDate, endDate) {
  const result = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  // 定位到本月第一个周一
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  while (currentDate <= lastDate) {
    const start = new Date(currentDate); // 复制当前日期对象作为范围的起始日期
    let end;

    // 定位到本周五
    while (currentDate.getDay() !== 5) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate <= lastDate) {
        end = new Date(currentDate); // 复制当前日期对象作为范围的结束日期
      }
    }

    if (end) {
      result.push([dateFormat(start), dateFormat(end)]);
    }

    // 移动到下个月的第一个周一
    currentDate.setDate(currentDate.getDate() + 3);

    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const output = [];

  for (let i = 0; i < result.length; i++) {
    // 如果截止日期在今天之后，那么就不统计
    if (new Date(result[i][1]) > new Date()) {
      break;
    }
    output.push(result[i]);
  }

  return output;
}

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

let status = 'idle';
const requestQueue = [];
const limit = 100;

const interval = setInterval(() => {
  if (status === 'idle' && requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      status = 'running';
      task().then(() => {
        status = 'idle';
      });
    }
  }
  if (requestQueue.length === 0) {
    clearInterval(interval);
  }
}, limit);

/**
 * requestMemo github api
 */
async function request(search) {
  const url = `https://api.github.com/search/${search}`;
  const headers = {
    'User-Agent': 'requestMemo',
    Authorization: `Bearer ${core.getInput('GITHUB_TOKEN') || config.token}`,
  };
  // make post requestMemo
  const promise = new Promise((resolve, reject) => {
    const callback = () =>
      new Promise((rsv) => {
        https
          .get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              console.log(url);
              resolve(JSON.parse(data));
              rsv();
            });
          })
          .on('error', reject);
      });

    requestQueue.push(callback);
  });

  return promise;
}

const requestMemo = memorize(request, (...args) => JSON.stringify(args));

/**
 * get commit count in range
 */
async function getCommitCount(range, repo) {
  const [since, until] = range;
  const result = await requestMemo(
    `commits?q=repo:${repo}+author-date:${since}..${until}`
  );
  return result.total_count;
}

/**
 * get open issue count in range
 */
async function getOpenIssueCount(range, repo) {
  const [since, until] = range;
  const open_issues = await requestMemo(
    `issues?q=repo:${repo}+is:issue+is:open+created:${since}..${until}`
  );
  return {
    count: open_issues.total_count,
    issues: open_issues.items,
  };
}

/**
 * get closed issue count in range
 */
async function getClosedIssueCount(range, repo) {
  const [since, until] = range;
  const closed_issues = await requestMemo(
    `issues?q=repo:${repo}+is:issue+is:closed+created:${since}..${until}`
  );
  return {
    count: closed_issues.total_count,
    issues: closed_issues.items,
  };
}

/**
 * get open pr count in range
 */
async function getOpenPRCount(range, repo) {
  const [since, until] = range;
  const open_prs = await requestMemo(
    `issues?q=repo:${repo}+is:pr+is:open+created:${since}..${until}`
  );
  return {
    count: open_prs.total_count,
    prs: open_prs.items,
  };
}

/**
 * get closed pr count in range
 */
async function getClosedPRCount(range, repo) {
  const [since, until] = range;
  const closed_prs = await requestMemo(
    `issues?q=repo:${repo}+is:pr+is:closed+created:${since}..${until}`
  );
  return {
    count: closed_prs.total_count,
    prs: closed_prs.items,
  };
}

/**
 * get added line count in range
 */
async function getAddedLineCount(range, repo) {
  if (MANUAL) return;
  const [since, until] = range;
  const command = `git log --since=${since} --before=${until} --pretty=tformat: --numstat | awk '{ add += $1 } END { print add }' -`;
  const result = exec(command);
  return parseInt(result.replace('\n', ''));
}

/**
 * get deleted line count in range
 */
async function getDeletedLineCount(range, repo) {
  if (MANUAL) return;
  const [since, until] = range;
  const command = `git log --since=${since} --before=${until} --pretty=tformat: --numstat | awk '{ del += $2 } END { print del }' -`;
  const result = exec(command);
  return parseInt(result.replace('\n', ''));
}

/**
 * get contributors' id in range
 */
async function getContributorIds(range, repo) {
  const [since, until] = range;
  const result = await requestMemo(
    `commits?q=repo:${repo}+author-date:${since}..${until}`
  );
  try {
    const contributors = Array.from(
      new Set(result.items.map((item) => item?.author?.login))
    ).filter(Boolean);
    return contributors;
  } catch {
    console.log(result);
    return ['error: ' + result.message];
  }
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

async function stats(metric = Metric, range, repo) {
  const data = await Promise.all(metric.map((fn) => fn(range, repo)));
  const [
    commit_count,
    { count: open_issue_count, issues: open_issues },
    { count: closed_issue_count, issues: closed_issues },
    { count: open_pr_count, prs: open_prs },
    { count: closed_pr_count, prs: closed_prs },
    added_line_count,
    deleted_line_count,
    contributors,
  ] = data;
  return {
    commit_count,
    open_issue_count,
    open_issues,
    closed_issue_count,
    closed_issues,
    open_pr_count,
    open_prs,
    closed_pr_count,
    closed_prs,
    added_line_count,
    deleted_line_count,
    contributors,
  };
}

function exportResultToMarkdown(rp, range, repo) {
  const {
    commit_count = '-',
    open_issue_count = '-',
    open_issues = [],
    closed_issue_count = '-',
    closed_issues = [],
    open_pr_count = '-',
    open_prs = [],
    closed_pr_count = '-',
    closed_prs = [],
    added_line_count = '-',
    deleted_line_count = '-',
    contributors = [],
  } = rp;
  const header = `| 指标 | 详情 |\n| --- | --- |\n`;
  const content = `|时间| \`${range[0]}\`-\`${range[1]}\` |
|仓库|\`${repo}\`|
|Commit 数|\`${commit_count}\`|
|Issue|新增: \`${open_issue_count}\` 关闭: \`${closed_issue_count}\`|
|PR|新增: \`${open_pr_count}\` 关闭: \`${closed_pr_count}\`|
|代码数|新增: \`${added_line_count}\` 删除: \`${deleted_line_count}\`|
|参与人|共\`${contributors.length}\`人|\n`;

  const detail = `### 新增 Issue

${open_issues
  .map((issue) => `- [${issue.title} #${issue.number}](${issue.html_url})`)
  .join('\n')}

### 关闭 Issue (共 ${closed_issues.length} 个)

${closed_issues
  .map((issue) => `- [${issue.title} #${issue.number}](${issue.html_url})`)
  .join('\n')}

### 新增 PR (共 ${open_prs.length} 个)

${open_prs
  .map((pr) => `- [${pr.title} #${pr.number}](${pr.html_url})`)
  .join('\n')}

### 关闭 PR (共 ${closed_prs.length} 个)

${closed_prs
  .map((pr) => `- [${pr.title} #${pr.number}](${pr.html_url})`)
  .join('\n')}

### 贡献者 (共 ${contributors.length} 人)

${contributors.map((contributor) => `- ${contributor}`).join('\n')}

`;

  return header + content + detail;
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
        exec(`git pull origin "${branchName}"`);
      }

      const file = range[1];
      // 生成 Markdown 表格文件
      fs.writeFileSync(`${file}.md`, md);

      // 提交 Markdown 表格文件
      exec(`git add ${file}.md`);
      exec(`git commit -m "chore: Weekly stats (${file})."`);
      exec(`git push origin "${branchName}" --force`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function run(range = getRange(), repo = process.env.GITHUB_REPOSITORY) {
  const rp = await stats(Metric, range, repo);
  const content = exportResultToMarkdown(rp, range, repo);
  !MANUAL && submit(content);
  return content;
}

if (MANUAL) {
  const ranges = getRanges(...config.range);
  config.repos.forEach(async (repo) => {
    const contents = (
      await Promise.all(ranges.map((range) => run(range, repo)))
    )
      .map((c, i) => `# ${ranges[i].join('->')}\n\n${c}`)
      .join('\n\n');
    fs.writeFileSync(
      `./reports/${repo.split('/')[1]}(${config.range.join('->')}).md`,
      contents
    );
    console.log('done');
  });
} else {
  run();
}

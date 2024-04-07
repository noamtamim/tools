const converter = new showdown.Converter();
const tagToSemverPattern = /^.*?(\d+)\.(\d+)\.(\d+).*?$/;

function tagToNumber(tag) {
  // Regular expression to match semantic versioning pattern
  const match = tag.match(tagToSemverPattern);

  if (match) {
    // Extract components from the matched groups
    const major = parseInt(match[1]);
    const minor = parseInt(match[2]);
    const patch = parseInt(match[3]);
    return major * 1000000 + minor * 1000 + patch;
  } else {
    // Return null if no match found
    return null;
  }
}

function collectReleaseNotes(repo, { renderMarkdown, page, fromTagNumber, toTagNumber }) {
  const div = document.getElementById('rel-notes');
  fetch(`https://api.github.com/repos/${repo}/releases?page=${page}`)
    .then(response => response.json())
    .then(releases => {
      if (releases.length) {
        // div.innerHTML += `<h1>Page ${page}</h1>`;
        for (const release of releases) {
          const tagKey = tagToNumber(release.tag_name);
          if (release.tag_name.includes('-') || tagKey < fromTagNumber || tagKey > toTagNumber) {
            continue;
          }

          div.innerHTML += '<hr>';
          div.innerHTML += `<h2><a href="${release.html_url}">${release.tag_name}</a></h2>`;
          const html = renderMarkdown
            ? converter.makeHtml(release.body)
            : `<pre>${release.body}</pre>`;
          div.innerHTML += html;
        }

        setTimeout(() => {
          collectReleaseNotes(repo, { renderMarkdown, page: page + 1, fromTagNumber, toTagNumber });
        }, 200);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function start() {
  const fromTag = document.getElementById('from-tag').value;
  const toTag = document.getElementById('to-tag').value;

  const fromTagNumber = fromTag ? tagToNumber(fromTag) : 0;
  const toTagNumber = toTag ? tagToNumber(toTag) : Number.MAX_SAFE_INTEGER;

  document.getElementById('rel-notes').innerHTML = '';
  const repoPath = document.getElementById('repo-path').value;
  const renderMarkdown = document.getElementById('markdown').checked;
  collectReleaseNotes(repoPath, {
    renderMarkdown,
    page: 1,
    fromTagNumber,
    toTagNumber,
  });
}

document.getElementById('select-all').addEventListener('click', () => {
  const relNotesDiv = document.getElementById('rel-notes');
  const range = document.createRange();
  range.selectNodeContents(relNotesDiv);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
});

document.getElementById('repo-path').addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    start();
  }
});

document.getElementById('start').addEventListener('click', start);

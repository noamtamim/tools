const converter = new showdown.Converter();
const tagToSemverPattern = /^.*?(\d+)\.(\d+)\.(\d+).*?$/;

function gebi(id) {
  return document.getElementById(id);
}

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
  const div = gebi('rel-notes');
  fetch(`https://api.github.com/repos/${repo}/releases?page=${page}`)
    .then(response => response.json())
    .then(releases => {
      gebi('select-all').disabled = false;
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
  const fromTag = gebi('from-tag').value;
  const toTag = gebi('to-tag').value;

  const fromTagNumber = fromTag ? tagToNumber(fromTag) : 0;
  const toTagNumber = toTag ? tagToNumber(toTag) : Number.MAX_SAFE_INTEGER;

  gebi('rel-notes').innerHTML = '';
  const repoPath = gebi('repo-path').value.replace(/^https\:\/\/github.com\//,'');
  const renderMarkdown = gebi('markdown').checked;

  collectReleaseNotes(repoPath, {
    renderMarkdown,
    page: 1,
    fromTagNumber,
    toTagNumber,
  });
}

gebi('select-all').addEventListener('click', () => {
  const relNotesDiv = gebi('rel-notes');
  const range = document.createRange();
  range.selectNodeContents(relNotesDiv);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
});

gebi('repo-path').addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    start();
  }
});

gebi('start').addEventListener('click', start);

const wikiLinkRegex = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;

function caselessCompare(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function extractLinks(content) {
  return [
    ...(content.match(wikiLinkRegex) || []).map(
      (link) =>
        link
          .slice(2, -2)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
          .split("#")[0]
    ),
    ...(content.match(internalLinkRegex) || []).map(
      (link) =>
        link
          .slice(6, -1)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
          .split("#")[0]
    ),
  ];
}

async function getGraph(data) {
  let nodes = {};
  let links = [];
  let stemURLs = {};
  let homeAlias = "/";

  const notes = data.collections.note || [];

  for (let idx = 0; idx < notes.length; idx++) {
    const v = notes[idx];

    const fpath = v.filePathStem.replace("/notes/", "");
    const parts = fpath.split("/");
    const group = parts.length >= 3 ? parts[parts.length - 2] : "none";

    // 비동기적으로 content 읽기
    const content = await v.template.read();

    nodes[v.url] = {
      id: idx,
      title: v.data.title || v.fileSlug,
      url: v.url,
      group,
      home:
        v.data["dg-home"] ||
        (v.data.tags && v.data.tags.indexOf("gardenEntry") > -1) ||
        false,
      outBound: extractLinks(content),
      neighbors: new Set(),
      backLinks: new Set(),
      noteIcon: v.data.noteIcon || process.env.NOTE_ICON_DEFAULT,
      hide: v.data.hideInGraph || false,
    };
    stemURLs[fpath] = v.url;

    if (
      v.data["dg-home"] ||
      (v.data.tags && v.data.tags.indexOf("gardenEntry") > -1)
    ) {
      homeAlias = v.url;
    }
  }

  // 연결 처리
  for (const node of Object.values(nodes)) {
    const outBound = new Set();

    node.outBound.forEach((olink) => {
      const link = (stemURLs[olink] || olink).split("#")[0];
      outBound.add(link);
    });

    node.outBound = Array.from(outBound);

    node.outBound.forEach((link) => {
      const targetNode = nodes[link];
      if (targetNode) {
        targetNode.neighbors.add(node.url);
        targetNode.backLinks.add(node.url);
        node.neighbors.add(targetNode.url);
        links.push({ source: node.id, target: targetNode.id });
      }
    });
  }

  // neighbors, backLinks 정리
  Object.keys(nodes).forEach((k) => {
    nodes[k].neighbors = Array.from(nodes[k].neighbors);
    nodes[k].backLinks = Array.from(nodes[k].backLinks);
    nodes[k].size = nodes[k].neighbors.length;
  });

  return {
    homeAlias,
    nodes,
    links,
  };
}

exports.wikiLinkRegex = wikiLinkRegex;
exports.internalLinkRegex = internalLinkRegex;
exports.extractLinks = extractLinks;
exports.getGraph = getGraph;

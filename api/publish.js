export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { token, user, repo, file, content, sha } = req.body;

    if (!token || !user || !repo || !file || !content || !sha) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const response = await fetch(
      `https://api.github.com/repos/${user}/${repo}/contents/${file}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update bookmarks – ${new Date().toLocaleString()}`,
          content,
          sha,
        }),
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}

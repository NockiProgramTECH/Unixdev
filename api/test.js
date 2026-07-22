module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    ok: true,
    env_key_exists: !!process.env.CHARRIOW_API_KEY,
    env_key_length: process.env.CHARRIOW_API_KEY ? process.env.CHARRIOW_API_KEY.length : 0,
    node_version: process.version,
  });
};

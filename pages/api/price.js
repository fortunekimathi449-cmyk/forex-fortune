export default async function handler(req, res) {
  try {
    const symbol = req.query.symbol || "EUR/USD";

    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${process.env.TWELVEDATA_API_KEY}&outputsize=50`;

    const data = await fetch(url).then(r => r.json());

    if (data.status === "error") {
      return res.status(400).json({ error: data.message });
    }

    const candles = data.values
      .reverse()
      .map(c => ({
        time: new Date(c.datetime).getTime() / 1000,
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
      }));

    res.status(200).json({ symbol, candles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

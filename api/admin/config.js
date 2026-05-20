const { requireAdmin } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const auth = requireAdmin(req);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  res.json({
    payment_methods: {
      paypal: { email: 'Vijayaraghavan1960@gmail.com' },
      iban: { number: 'OM760270342000439520018', bank: 'Bankmuscat' },
      stripe: { publishable_key: 'pk_test_51T9gQs1y89aWCXv8LllBLMy6S7O4w6VyCvQyGmtFrtuqp793IKPSJxKuySKAgfkCScCWrURXHn73R1l8FEPk08ai00iYur4Vfz' },
      whatsapp: { number: '968-99061298' }
    },
    pricing: {
      monthly: { price: 50, currency: 'USD', duration: '1 month' },
      lifetime: { price: 199, currency: 'USD', duration: 'forever' }
    }
  });
};

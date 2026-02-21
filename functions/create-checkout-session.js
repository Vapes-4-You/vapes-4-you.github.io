const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  try {
    const { line_items } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items.map(item => ({
        price_data: item.price_data,
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: 'https://your-netlify-site.netlify.app/success.html',
      cancel_url: 'https://your-netlify-site.netlify.app/shop.html',
    });

    return { statusCode: 200, body: JSON.stringify({ id: session.id }) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

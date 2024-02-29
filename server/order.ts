import { analytics, app } from './cart';

app.get('/order', (req, res) => {
  analytics.track({
    userId: req.body.userId,
    event: 'Get order',
    properties: { orderId: '123456' }
  })
   res.sendStatus(201)
});

app.post('/createorder', (req, res) => {
    analytics.track({
      userId: req.body.userId,
      event: 'Create order',
      properties: { orderId: '99482', numOfProducts: '5' }
    })
     res.sendStatus(201)
  });

app.post('/deleteorder', (req, res) => {
    analytics.track({
      userId: req.body.userId,
      event: 'Delete order',
      properties: { orderId: '93843' }
    })
     res.sendStatus(201)
  });
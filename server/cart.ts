import { Analytics }  from '@segment/analytics-node';
import express from 'express';

export const analytics = new Analytics({ writeKey: 'MY_WRITE_KEY' })
export const app: express.Application = express();

app.post('/cart', (req, res) => {
  analytics.track({
    userId: req.body.userId,
    event: 'Add to cart',
    properties: { productId: '123456', quantity: '5' }
  })
   res.sendStatus(201)
});

app.post('/savecart', (req, res) => {
    analytics.track({
      userId: req.body.userId,
      event: 'Save for later',
      properties: { productId: '99482' }
    })
     res.sendStatus(201)
  });

app.post('/deletecart', (req, res) => {
    analytics.track({
      userId: req.body.userId,
      event: 'Delete from cart',
      properties: { numOfProducts: req.body.numOfProducts }
    })
     res.sendStatus(201)
  });
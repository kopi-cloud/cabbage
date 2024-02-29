import { analytics, app } from './cart';

app.get('/user', (req, res) => {
  analytics.track({
    userId: req.body.userId,
    event: 'Get user',
    properties: { userId: '123456' }
  })
   res.sendStatus(201)
});

app.post('/edituser', (req, res) => {
    analytics.track({
      userId: req.body.userId,
      event: 'Edit user',
      properties: { userId: '99482' }
    })
     res.sendStatus(201)
  });

app.post('/createuser', (req, res) => {
    analytics.track({
      userId: req.body.userId,
      event: 'Create user',
      properties: { userId: '923383' }
    })
     res.sendStatus(201)
  });
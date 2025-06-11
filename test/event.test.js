const request = require('supertest');
const app = require('../app');

let server;
let token;

describe('Event Planner API', () => {
  const testUser = {
    id: 'tu123',
    email: 'user@test.com',
    password: 'password123',
  };

  const testEvent = {
    name: 'Test Event',
    description: 'This is a test event',
    date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    category: 'Meetings',
    reminder: {
      enabled: true,
      minutesBefore: 30,
    },
  };

  beforeAll(async () => {
    // Start the server (you can use any available port, e.g., 0 for ephemeral)
    server = app.listen(0, () => console.log("Test server running"));

    // Register and login
    await request(server)
      .post('/api/auth/register')
      .send(testUser);

    const res = await request(server)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    token = res.body.token;
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should create an event', async () => {
    const res = await request(server)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(testEvent);

    expect(res.statusCode).toBe(201);
    expect(res.body.event).toHaveProperty('name', 'Test Event');
    expect(res.body.event).toHaveProperty('category', 'Meetings');
  });

  it('should get events for user', async () => {
    const res = await request(server)
      .get('/api/events')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('userId', testUser.id);
  });

  it('should filter events by category', async () => {
    const res = await request(server)
      .get('/api/events?category=Meetings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].category).toBe('Meetings');
  });
});

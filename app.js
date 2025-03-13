const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { events, users } = require('./data/store');
app.use(express.json());

app.get('/', (req, res) => res.send('Event Planner API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
const PORT = 3000;

setInterval(() => {
    const now = new Date();
  
    events.forEach(event => {
      if (event.reminder && event.reminder.enabled) {
        const eventTime = new Date(event.date);
        const reminderTime = new Date(eventTime.getTime() - event.reminder.minutesBefore * 60000);
        if (Math.abs(reminderTime - now) < 60000) {
            const user = users.find(u => u.id === event.userId);
            console.log(`Reminder for ${user?.email || user?.id}: "${event.name}"`);            
        }
      }
    });
  }, 60000);
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
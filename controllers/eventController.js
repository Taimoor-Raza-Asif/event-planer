const { events } = require('../data/store');

exports.createEvent = (req, res) => {
  const { name, description, date, category, reminder } = req.body;
  const event = {
    id: Date.now().toString(),
    userId: req.user.id,
    name,
    description,
    date: new Date(date),
    category,
    reminder,
  };
  events.push(event);
  res.status(201).json({ message: 'Event created', event });
};

exports.getEvents = (req, res) => {
  const userEvents = events.filter(e => e.userId === req.user.id);
  const { sortBy } = req.query;

  if (sortBy === 'date') {
    userEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'category') {
    userEvents.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'reminder') {
    userEvents.sort((a, b) => (b.reminder?.enabled ? 1 : -1));
  }

  res.json(userEvents);
};

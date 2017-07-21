/*jshint esversion: 6 */
const PORT = process.env.PORT || 8000;
const server = require('./server');

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
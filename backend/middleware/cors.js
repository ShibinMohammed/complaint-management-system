import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };
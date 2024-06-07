export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 3001,
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
});

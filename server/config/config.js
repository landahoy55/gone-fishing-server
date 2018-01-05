//set up environment variables - so we can test on a diff db
var env = process.env.NODE_ENV || 'development';
console.log('Environment *****', env);

if (env === 'development') {
    process.env.PORT = 3001;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/GoneFishing'
} else if (env === 'test') {
    process.env.PORT = 3001;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/GoneFishingTest'
}

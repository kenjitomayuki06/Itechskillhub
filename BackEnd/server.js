import app from './app.js'; // Note the .js extension!
const port = 5000;

app.listen(port, () => {
    console.log(`Example App Listening on Port ${port}`);
});

// Start the sever last
app.listen(5000, () => { console.log("Server is running on port 5000") });
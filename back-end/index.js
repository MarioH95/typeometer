const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1' },
    {id: 2, name: 'course2' },
    {id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('it be like that sometimes');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id was not found');
    res.send(course);
});

//PORT
//process.env.PORT
const port = 5000;
app.listen(port, () => console.log(`istening on port ${port}...`))
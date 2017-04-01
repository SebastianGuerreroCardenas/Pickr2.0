module.exports = (localApp, db) => {
    // Retrieve all tutorials is in src/router/routes/cycle.js

    // Add students to tutorials
	localApp.post('/api/tutorials/:tutorial_id/students/:id', (req, res) =>{

	});

    // Delete students from tutorial 
    localApp.delete('/api/tutorials/:tutorial_id/students/:id', (req, res) =>{
        const tutorial_id = req.params.tutorial_id;
        const student_id = req.params.id.slice(0,-5);
        db.student_tutorial.destroy({
            where: {
                tutorialId: tutorial_id,
                studentId: student_id 
            }
        }).then(() =>{
            res.json({'data': 'deleted student from tutorial'});
        }).catch(function(errors) {
            console.log(errors);
        });
    }); 

    // Get students for a specific tutorial
    localApp.get('/api/tutorials/:tutorial_id/students.json', (req, res) =>{
        // console.log(req.params);
        const tutorialId = req.params.tutorial_id;

        // Find all studentId for selected tutorial 
        db.student.findAll({
            include: [
            {
                model: db.tutorial,
                    where: {
                        id: tutorialId
                    }
                }
            ]
        }).then((student) => {
            // console.log("student=", student);

            var responseJSON = student.map((student) => {
                return {
                        student_id: student.student_id,
                        full_name: student.full_name,
                        first_name: student.first_name,
                        last_name: student.last_name,
                        grade_level: student.grade_level,
                        id: student.id
                }
            });
            // console.log(responseJSON);
            res.json(responseJSON);
        });
    });

    // TODO: Locked tutorial 

    // TODO: Locked student 

    // Tutorial details - tutorialDetailController.js and tutorial/view/detail.html
    localApp.get('/api/cycles/:cycle_id/tutorials/:tutorial_id.json', (req, res) => {
        const cycleId = req.params.cycle_id;
        const tutorialId = req.params.tutorial_id;

        db.tutorial.findOne({
            where: {
                id: tutorialId
            }
        }).then((tutorial) => {
            // console.log("got the tutorial ", tutorial.id);
            var responseJSON = {
                id: tutorial.id,
                name: tutorial.name,
                teacher_name: tutorial.teacher_name,
                room_number: tutorial.room_number,
                max_students: tutorial.max_students
            }
            res.json(responseJSON);
        });
    });

    // Add tutorials
    localApp.post('/api/cycles/:cycle_id/tutorials.json', (req, res) => {
        console.log("cycle id for adding tutorials ", req.params.cycle_id);
        db.tutorial.create({
            name: req.body.name,
            teacher_name: req.body.teacher_name,
            room_number: req.body.room_number,
            max_students: req.body.max_students,
            cycleId: req.params.cycle_id
        }).then((tutorial) => {
            // console.log("got new tutorial", tutorial);
            res.json(tutorial);
        }).catch(function(errors) {
            console.log(errors);
        });
    });


    // Editting tutorials
    localApp.put('/api/cycles/tutorials/:id.json', (req, res) => {
        // console.log("req.params.id.slice(1,-5) ", req.params.id.slice(0,-5));
        // console.log("req.body ", req.body);
        const reqid = req.body.id;
        db.tutorial.findOne({
            where: {
                id: reqid
            }
        }).then((tutorial) => {
                // console.log(tutorial)
                if (tutorial) {
                    tutorial.update(req.body).then((tutorialUpdate) => {
                        //update the tutorial and then only return that tutorial
                        if (tutorialUpdate) {
                            res.json(tutorialUpdate);
                        }
                    })
                    .catch(function (error){
                    res.status(500).json(error);
                    });
                }
        });
    });

    //deletes a tutorial CHECK THE ROUTE 
    localApp.delete('/api/cycles/tutorials.json', (req, res) => {
        
    });

}
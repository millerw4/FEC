require("dotenv").config();
const express = require('express');
const db = require('./qadb.js');

const PORT = process.env.DB_SERVER_PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  console.log('serving: ', req.method, req.path, req.query);
  next();
})

app.get('/qa/questions', (req, res) => {
  const { product_id, page, count } = req.query;
  db.getQuestions(product_id, page, count)
    .then(questions => {
      res.status(200).send(questions);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.put("/qa/questions/:question_id/helpful", (req, res) => {
  db.updateQuestionHelpful(req.params.question_id)
    .then(response => {
      res.status(204).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.put("/qa/questions/:question_id/report", (req, res) => {
  db.updateQuestionReported(req.params.question_id)
    .then(response => {
      res.status(204).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  db.updateAnswerHelpful(req.params.answer_id)
    .then(response => {
      res.status(204).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.put("/qa/answers/:answer_id/report", (req, res) => {
  db.updateAnswerReported(req.params.answer_id)
    .then(response => {
      res.status(204).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.post("/qa/questions", (req, res) => {
  console.log('question body:\n', req.body);
  db.submitQuestion(req.body)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.post("/qa/questions/:question_id/answers", (req, res) => {
  console.log('question body:\n', req.body);
  db.submitAnswer(req.body)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.listen(PORT, () => console.log(`Server is listening at http://localhost:${PORT}`));
process.env.NODE_ENV = 'production';
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const controller = require("./controller.js");

const PORT = process.env.PORT || 3000;
const app = express();

//********************** Middleware ****************************/

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use((req, res, next) => {
  console.log('serving: ', req.method, req.path, req.query);
  next();
})

//********************** Product and Styles ****************************/

app.get(
  ["/products", "/products/:id", "/products/:id/:related"],
  (req, res) => controller.getProducts(req, res)
);
app.get('/styles', (req, res) => controller.getStyles(req, res));

//**********************Question and Answers ****************************/

app.get("/qa/questions", (req, res) => controller.getQuestions(req, res));
app.put("/qa/questions/:question_id/helpful", (req, res) => controller.updateQuestionHelpful(req, res));
app.put("/qa/questions/:question_id/report", (req, res) => controller.updateQuestionReport(req, res));
app.put("/qa/answers/:answer_id/helpful", (req, res) => controller.updateAnswerHelpful(req, res));
app.put("/qa/answers/:answer_id/report", (req, res) => controller.updateAnswerReport(req, res));
app.post("/qa/questions/:question_id/answers", (req, res) => controller.submitAnswer(req, res));
app.post("/qa/questions", (req, res) => controller.submitQuestion(req, res));

//********************** Ratings and Reviews ****************************/

app.get("/reviews/", (req, res) => controller.getReviews(req, res));
app.get("/reviews/meta", (req, res) => controller.getReviewsMeta(req, res));
app.put(`/review/:review_id/helpful`, (req, res) => controller.updateReviewHelpful(req, res));
app.post("/reviews", (req, res) => controller.postForm(req, res));

//********************** Interactions ****************************/

app.post('/interactions', controller.postInteraction)

app.get('/null', (req, res) => {
  // console.log('get null req: ', req.sessionStore)
  // console.log('GET /null req: WHY IS THIS HERE?')
  res.sendStatus(200)
})

app.listen(PORT, () => console.log(`Server is listening at http://localhost:${PORT}`));
const axios = require ('axios');
const config = require('../config/myConfig.js');
const TOKEN = process.env.API_KEY || config.token;
const API = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/`;
const SDC_API = 'http://localhost:3001/';

//********************** Products and Styles ****************************/

const getProducts = (params, callback) => {
  const route = API + `products/${params.id + (params.related === '' ? '' : ('/' + params.related))} `;
  axios.get(route, {headers: {Authorization: TOKEN}})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const getStyles = (id, callback) => {
  let headers = { Authorization: `${TOKEN}` };
  return axios.get(`${API}products/${id}/styles`, { headers: headers })
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};

//**********************Question and Answers ****************************/

const getQuestions = (params, callback) => {
  const route = API + `qa/questions`;
  // const route = `${SDC_API}qa/questions`;
  axios.get(route, {headers: {Authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => {console.log('here');callback(err)});
};
const updateQuestionHelpful = (params, callback) => {
  const route = API + `qa/questions/${params.question_id}/helpful`;
  axios.put(route, null, {headers: {authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const updateQuestionReport = (params, callback) => {
  const route = API + `qa/questions/${params.question_id}/report`;
  axios.put(route, null, {headers: {authorization: TOKEN}, params: params})
    .then((res) => callback(null, console.log(res.data)))
    .catch((err) => callback(console.log(err)));
};
const updateAnswerHelpful = (params, callback) => {
  const route = API + `qa/answers/${params.answer_id}/helpful`;
  axios.put(route, null, {headers: {authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const updateAnswerReport = (params, callback) => {
  const route = API + `qa/answers/${params.answer_id}/report`;
  axios.put(route, null, {headers: {authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const submitAnswer = (body, callback) => {
  const route = API + `qa/questions/${body.question_id}/answers`
  console.log('question body:\n', body);
  axios.post(route, body, {headers: {authorization: TOKEN}})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const submitQuestion = (body, callback) => {
  const route = API + `qa/questions`
  console.log('question body:\n', body);
  axios.post(route, body, {headers: {authorization: TOKEN}})
    .then((res) => callback(null, console.log(res.data)))
    .catch((err) => callback(console.log('error in api'), err));
};

//********************** Ratings and Reviews ****************************/

const getReviews = (params, callback) => {
  const route = API + `reviews/`;
  axios.get(route, {headers: {Authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const updateReviewHelpful = (params, callback) => {
  const route = API + `reviews/${params.review_id}/helpful`;
  axios.put(route, null, {headers: {Authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const getReviewsMeta = (params, callback) => {
  const route = API + `reviews/meta`;
  axios.get(route, {headers: {Authorization: TOKEN}, params: params})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};
const postForm = (params, callback) => {
  const route = API + `reviews/`;
  axios.post(route, params, {headers: {Authorization: TOKEN}})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};

//********************** Interaction Tracking ****************************/

const postInteraction = (params, callback) => {
  const route = API + `interactions/`;
  console.log(params);
  axios.post(route, params, {headers: {Authorization: TOKEN}})
    .then((res) => callback(null, res.data))
    .catch((err) => callback(err));
};

module.exports = {
  //products
  getProducts,
  getStyles,
  //qna
  getQuestions,
  updateQuestionHelpful,
  updateQuestionReport,
  updateAnswerHelpful,
  updateAnswerReport,
  submitAnswer,
  submitQuestion,
  //review
  getReviews,
  updateReviewHelpful,
  getReviewsMeta,
  postForm,
  //interaction
  postInteraction
};
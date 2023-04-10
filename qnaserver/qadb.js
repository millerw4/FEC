const postgres = require('postgres');
const fs = require('fs');
const csv = require('csv-parser');

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
});

module.exports.getQuestions = async function(product_id, page = 0, count = 5) {
  const questions = await sql`
    select *
      from questions
      where product_id=${product_id}
      order by id
      limit ${count}
      offset ${page}
    `;
  await Promise.all(questions.map(question => sql`
    select *
      from answers
      where question_id=${question.id}
    `))
    .then(results => questions.forEach((question, index) => question.answers = results[index]));
  return questions;
};
module.exports.updateQuestionHelpful = async function(id) {
  const helpful = await sql`
    select helpful
      from questions
      where id=${id}
    `;
  return await sql`
    update questions
      set helpful=${helpful[0].helpful + 1}
      where id=${id}
    `;
};
module.exports.updateQuestionReported = async function(id) {
  return await sql`
    update questions
      set reported=${1}
      where id=${id}
    `;
};
module.exports.updateAnswerHelpful = async function(id) {
  const helpful = await sql`
    select helpful
      from answers
      where id=${id}
    `;
  return await sql`
    update answers
      set helpful=${helpful[0].helpful + 1}
      where id=${id}
    `;
};
module.exports.updateAnswerHelpful = async function(id) {
  return await sql`
    update answers
      set reported=${1}
      where id=${id}
    `;
};
module.exports.submitQuestion = async function(question) {
  const q = {
    product_id: question.product_id,
    body: question.body,
    date_written: parseInt(Date.now()),
    asker_name: question.name,
    asker_email: question.email,
  };
  console.log('q: ', q);
  return await sql`insert into questions ${ sql(q) }`;
};
module.exports.submitAnswer = async function(answer) {
  const a = {
    question_id: answer.question_id,
    body: answer.body,
    date_written: parseInt(Date.now()),
    answerer_name: answer.name,
    answerer_email: answer.email
  };
  const answer_id = await sql`
    insert into answers ${ sql(a) }
      returning answers.id
    `;
  const id = answer_id[0].id;
  console.log('created answer at id: ', answer_id);
  return Promise.all(answer.photos.map(photo => {
    const p = {
      answer_id: id,
      url: photo
    };
    return sql`insert into photos ${ sql(p) }`;
  }));
};

// check next incremental index (should be -1?)
// SELECT setval('answers_id_seq',(SELECT MAX(id)FROM answers)+1);

// reset the incrementer to next index
// SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions)+1);


// .query(`SELECT setval('answers_id_seq',(SELECT MAX(id)FROM answers)+1)`)

// sql`
//     insert questions
//       set
//         product_id=${question.product_id},
//         body=${question.body},
//         date_written=${question.date_written},
//         asker_name=${question.name},
//         asker_email=${question.email},
//         reported=${0},
//         helpful=${0}
//     `;

//TODO: modularize ETL and add meaningful Transform layer with STREAMS

// const { Readable, Writable, Transform, pipeline } = require('stream');
// const miniQFile = './qnaserver/rawdata/questions_mini.csv';
// const results = [];
// const chunkSize = 5;
// const csvStream = fs.createReadStream(miniQFile)
// const formatStream = new Transform({
//   transform(chunk, encoding, callback) {
//     console.log('in transform');
//     console.log(chunk);
//     callback();
//   },
// });
// const doItYourself = (data) => {
//   console.log('data in DIY', data)
//   if (results <= chunkSize) {
//     //add to results
//     results.push(data);
//   } else {
//     //query batch of results
//     console.log('else block')
//     sql`insert into questions ${ sql(results) }`
//   }
//   return Promise.resolve(data);
// }
// const logger = (data) => {
//   console.log('data in logger', data)
//   return Promise.all([Promise.resolve(data)])
// }
// async function loadTableCSV(table) {
//   // const query = await sql`insert into users ${ sql(users, 'name', 'age') }`.writable();
//   return await pipeline(
//     csvStream,
//     csv,
//     // doItYourself,
//     formatStream,
//     // query,
//     (err) => {
//       if (err) {
//         console.error('Pipeline failed', err);
//       } else {
//         console.log('Pipeline succeeded');
//       }
//     }
//   );
// }
// loadTableCSV('questions')
  // .then(data => console.log('all done', data))


  // const query = await sql`copy questions from stdin csv header`.writable();
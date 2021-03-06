'use strict';
// REVIEW: Check out all of our new arrow function syntax!

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = 'postgres://ccross:12345@localhost:5432/kilovolt';
const client = new pg.Client(conString);
client.connect();
client.on('error', err => {
  console.error(err);
});

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('./public'));

app.get('/new-article', (request, response) => response.sendFile('new.html', {root: './public'}));
app.get('/admin', (request, response) => response.sendFile('admin.html', {root: './public'}));
app.get('/articles', (request, response) => {
  let SQL = `
    SELECT * FROM articles
    INNER JOIN authors
      ON articles.author_id=authors.author_id;
  `;
  client.query( SQL )
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.post('/articles', (request, response) => {
  let SQL = 'INSERT INTO authors(author, author_url) VALUES($1, $2) ON CONFLICT DO NOTHING';
  let values = [request.body.author, request.body.author_url];
  client.query( SQL, values,
    function(err) {
      if (err) console.error(err)
      queryTwo()
    }
  )

  function queryTwo() {
    let SQL = `SELECT author_id FROM authors WHERE author=$1`;
    let values = [request.body.author];
    client.query( SQL, values,
      function(err, result) {
        if (err) console.error(err)
        queryThree(result.rows[0].author_id)
      }
    )
  }

  function queryThree(author_id) {
    let SQL = `
      INSERT INTO articles(author_id, title, category, published_on, body)
      VALUES ($1, $2, $3, $4, $5);
    `;
    let values = [
      author_id,
      request.body.title,
      request.body.category,
      request.body.published_on,
      request.body.body
    ];

    client.query( SQL, values,
      function(err) {
        if (err) console.error(err);
        response.send('insert complete');
      }
    );
  }
});

app.put('/articles/:id', (request, response) => {
  let SQL = `
    UPDATE authors
    SET author=$1, author_url=$2
    WHERE author_id=$3
  `;
  let values = [request.body.author, request.body.author_url, request.body.author_id];
  client.query( SQL, values )
    .then(() => {
      let SQL = `
        UPDATE articles
        SET author_id=$1, title=$2, category=$3, published_on=$4, body=$5
        WHERE article_id=$6
      `;
      let values = [
        request.body.author_id,
        request.body.title,
        request.body.category,
        request.body.published_on,
        request.body.body,
        request.params.id
      ];
      client.query( SQL, values );
    })
    .then(() => response.send('Update complete'))
    .catch(console.error);
});

app.delete('/articles/:id', (request, response) => {
  let SQL = `DELETE FROM articles WHERE article_id=$1;`;
  let values = [request.params.id];
  client.query( SQL, values )
    .then(() => response.send('Delete complete'))
    .catch(console.error);
});

app.delete('/articles', (request, response) => {
  let SQL = 'DELETE FROM articles';
  client.query( SQL )
    .then(() => response.send('Delete complete'))
    .catch(console.error);
});

loadDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));


//////// ** DATABASE LOADERS ** ////////
////////////////////////////////////////
function loadAuthors() {
  fs.readFile('./public/data/hackerIpsum.json', 'utf8', (err, fd) => {
    JSON.parse(fd).forEach(ele => {
      let SQL = 'INSERT INTO authors(author, author_url) VALUES($1, $2) ON CONFLICT DO NOTHING';
      let values = [ele.author, ele.author_url];
      client.query( SQL, values )
        .catch(console.error);
    })
  })
}

function loadArticles() {
  let SQL = 'SELECT COUNT(*) FROM articles';
  client.query( SQL )
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('./public/data/hackerIpsum.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            let SQL = `
              INSERT INTO articles(author_id, title, category, published_on, body)
              SELECT author_id, $1, $2, $3, $4
              FROM authors
              WHERE author=$5;
            `;
            let values = [ele.title, ele.category, ele.published_on, ele.body, ele.author];
            client.query( SQL, values )
              .catch(console.error);
          })
        })
      }
    })
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    authors (
      author_id SERIAL PRIMARY KEY,
      author VARCHAR(255) UNIQUE NOT NULL,
      author_url VARCHAR (255)
    );`
  )
    .then(loadAuthors)
    .catch(console.error);

  client.query(`
    CREATE TABLE IF NOT EXISTS
    articles (
      article_id SERIAL PRIMARY KEY,
      author_id INTEGER NOT NULL REFERENCES authors(author_id),
      title VARCHAR(255) NOT NULL,
      category VARCHAR(20),
      published_on DATE,
      body TEXT NOT NULL
    );`
  )
    .then(loadArticles)
    .catch(console.error);
}

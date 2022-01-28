const express = require('express')
const app = express()
const mysql = require('mysql2');
const path = require('path')
const bodyParser = require('body-parser')

// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))

//mysqlとの接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tvad1980',
  database: 'express_db'
});

// Get all users
app.get('/api/v1/users', (req, res) => {
  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    res.json(result)
  });
})

// Get a user
app.get('/api/v1/users/:id', (req, res) => {
  const id = req.params.id

  connection.query(`SELECT * FROM users WHERE id = ${id}`, function (err, result, fields) {
    if (err) throw err;
    if (!row) {
      res.status(404).send({error: "Not Found!"})
    } else {
      res.status(200).json(result)
    }
  });
})

// Search users matching keyword
app.get('/api/v1/search', (req, res) => {
  const keyword = req.query.q

  connection.query(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows)
  })
})

// Create a new user
app.post('/api/v1/users', async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error: "ユーザー名が指定されていません。"})
  } else {
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

    try {
      connection.query(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,function(err, result, fields){
        if (err) throw err;
      });
      res.status(201).send({message: "新規ユーザーを作成しました。"})
    } catch (e) {
      res.status(500).send({error: e})
    }
  }
})

// Update user data
app.put('/api/v1/users/:id', async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error: "ユーザー名が指定されていません。"})
  } else {
    const id = req.params.id
    con.query(`UPDATE users SET ? WHERE id = ${id}`,req.body,function (err, result, fields) {
      if (err) throw err;
    });
  }
})

// Delete user data
app.delete('/api/v1/users/:id', async (req, res) => {
  const id = req.params.id
	con.query("DELETE FROM users WHERE id = ?",[id],function(err,result,fields){
		if (err) throw err;
	})
})

const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port: " + port)
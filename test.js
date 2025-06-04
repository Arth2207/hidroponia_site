// test.js
import pool from './conections/database.js'

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err)
  } else {
    console.log('Conectado com sucesso! Horário atual:', res.rows[0])
  }

  pool.end()
})

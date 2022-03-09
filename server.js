const mongoose = require('mongoose')

const app = require('./app')
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
useNewUrlParser: true,
useCreateIndex: true,
useFindAndModify: false,
useUnifiedTopology: true
}).then(con => {
  // console.log(con.connections)
  console.log('DB connection successful')
})

const port = process.env.PORT || 3000;

app.listen( port, () => {
  console.log(`App is running on port ${port}....` )
});

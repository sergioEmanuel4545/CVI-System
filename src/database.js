
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/CVIDB',{
    useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

.then(db => console.log('Db is connected'))
.catch(err => console.error(err));
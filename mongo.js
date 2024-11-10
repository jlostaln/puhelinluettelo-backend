const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstacke:${password}@cluster0.1ehczvq.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//console.log(process.argv.length)

// Loogiikka joka riippuu komentorivin argumenttien määrästä: 5 = salasana, nimi ja numero annettu, 3 = pelkkä salasana
if (process.argv.length === 5) {
  newName = process.argv[3]
  newNumber = process.argv[4]

  const person = new Person ({
    name: newName,
    number: newNumber,
  })

  person.save().then(result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  }) 

} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
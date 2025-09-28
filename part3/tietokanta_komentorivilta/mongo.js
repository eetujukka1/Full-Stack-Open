const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give a password')
} else {
    const password = process.argv[2]
    const url = `mongodb+srv://fullstackeetu:${password}@cluster0.cmju9ny.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`
    
    mongoose.set('strictQuery', false)
    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })
    
    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length < 4) {
        Person.find({}).then(people => {
            console.log('Phonebook:')
            people.forEach(person => {
                console.log(`${person["name"]} ${person["number"]}`)
            })
            mongoose.connection.close()
        })
    } else {
        const name = process.argv[3]
        const number = process.argv[4]
        
        const person = new Person({
            name: name,
            number: number
        })

        person.save().then(result => {
            console.log(`Added ${name} ${number} to phonebook`)
            mongoose.connection.close()
        })
    }
}
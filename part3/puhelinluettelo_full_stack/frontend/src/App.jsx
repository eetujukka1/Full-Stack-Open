import { useEffect, useState } from 'react'
import AddPanel from './components/AddPanel'
import FilterPanel from './components/FilterPanel'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [messageValue, setMessageValue] = useState(null)

  useEffect(() => {
    personService
    .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const personsToShow = filter.length === 0
    ? persons
    : persons.filter(person => person["name"].toLowerCase().includes(filter.toLowerCase()))

  const notify = ( message, success ) => {
    console.log(message, success)
    setMessageValue(
      success
    )
    setMessage(
      message
    )
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (newName == "") {
      notify(`Name cannot be empty.`, false)
    }
    else if (persons.find((element) => element["name"] === newName)) {
      if (confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        const oldPerson = persons.find(person => person["name"] === newName)
        personService
        .update(oldPerson["id"], personObject)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id !== oldPerson["id"] ? person : updatedPerson))
          notify(`Updated ${updatedPerson["name"]}`, true)
        })
        .catch(error => {
          notify(`Couldn't update information for ${oldPerson["name"]} as it doesn't exist`, false)
        })
      }
    } else {
      personService
      .create(personObject)
      .then(newPerson=> {
        setPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')
        notify(`Added ${personObject["name"]}`, true)
      })
      .catch(error => {
        notify(`Couldn't add ${newName}, please try again later`, false)
      })
    }
  }

  const removePerson = (id) => {
    personService
    .remove(id)
    .then(() => {
      const newPersons = persons.filter(person => person.id !== id)
      setPersons(newPersons)
      notify(`Removed ${persons.find(person => person.id === id)["name"]}`, true)
    })
    .catch(error => {
      notify(`${persons.find(person => person.id === id)["name"]} couldn't be removed, please try again later`, false)
    })
  }

  const handlePersonChange = (event) => setNewName(event.target.value)
  
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilter = (event) => setFilter(event.target.value)

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} value={messageValue}/>
      <FilterPanel onChange={handleFilter}/>
      <h2>Add new</h2>
      <AddPanel
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Persons</h2>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/>
    </div>
  )

}

export default App
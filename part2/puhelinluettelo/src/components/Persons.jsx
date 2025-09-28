import Person from "./Person"

const Persons = ({personsToShow, removePerson}) => {
  return (
  <>
    {personsToShow.map(person => 
      <Person person={person} key={person["name"]} removePerson={() => {removePerson(person["id"])}}/>
    )}
  </>
  )
}

export default Persons
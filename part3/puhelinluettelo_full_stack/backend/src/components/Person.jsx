const Person = ({person, removePerson}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={removePerson}>Remove</button>
    </div>
  )
}

export default Person
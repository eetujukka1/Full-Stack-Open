const AddPanel = ({handlePersonChange, handleNumberChange, addPerson, newName, newNumber}) => {
  return (
    <>
      <form>
        <div>
          name: 
          <input 
            value={newName} 
            onChange={handlePersonChange}
          />
        </div>
        <div>
          number: 
          <input 
            value={newNumber} 
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit" onClick={addPerson}>Add</button>
        </div>
      </form>
    </>
  )
}

export default AddPanel
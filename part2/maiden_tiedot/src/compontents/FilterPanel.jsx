import Countries from "./Countries"

const FilterPanel = ({countries, onChange, handleShow}) => {
  return (
    <div>
      <input onChange={onChange}></input>
      {countries.length === 1 ? null : <Countries countries={countries} handleShow={handleShow}/>}
    </div>
  )
}

export default FilterPanel
import { useEffect, useState } from 'react'
import FilterPanel from './compontents/FilterPanel'
import countryService from './services/country'
import Information from './compontents/Information'

const App = () => {
  const [filter, setFilter] = useState("")
  const [countries, setCountries] = useState([])
  const [visibleCountry, setVisibleCountry] = useState(null)

  useEffect(() => {
    countryService
    .getAll()
    .then(initialCountries => {
      setCountries(initialCountries)
    })
  }, [])

  const countriesToShow = filter.length === 0
    ? countries
    : countries.filter(country => country["name"]["common"].toLowerCase().includes(filter.toLowerCase()))

  const handleShow = (value) => {
    setVisibleCountry(countries.find(country => country["name"]["common"].toLowerCase().includes(value.toLowerCase())))
  }

  const handleFilter = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
    if (
      countries.filter(country => country["name"]["common"].toLowerCase().includes(newFilter.toLowerCase())).length === 1) {
      setVisibleCountry(countries.find(country => country["name"]["common"].toLowerCase().includes(newFilter.toLowerCase())))
    } else {
      setVisibleCountry(null)
    }
  }

  return (
    <div>
      <FilterPanel countries={countriesToShow} onChange={handleFilter} handleShow={handleShow}/>
      <Information country={visibleCountry}/>
    </div>
  )
}

export default App

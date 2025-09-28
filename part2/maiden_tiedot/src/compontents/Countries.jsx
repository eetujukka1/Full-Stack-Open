import Country from "./Country"

const Countries = ({countries, handleShow}) => {

    if (countries.length > 10) {
        return(
            <>
                <div>Too many matches, specify another query</div>
            </>
        )
    }
    if (countries.length <= 0) {
        return(
            <>
                <div>No matches found, try another query</div>
            </>
        )
    }
    return (
    <>
        {countries.map(country => 
            <Country key={country["name"]["common"]} name={country["name"]["common"]} onClick={() => {handleShow(country["name"]["common"])}}/>
        )}
    </>
  )
}

export default Countries
import { useEffect } from "react"
import Weather from "./Weather"

const Information = ({country}) => {
    
    if (!country) {
        return null
    }

    return (
        <>
            <h2>{country["name"]["common"]}</h2>
            <div>Capital: {country["capital"]}</div>
            <div>Area: {country["area"]}</div>
            
            <h1>Languages</h1>
            <ul>
                {Object.values(country["languages"]).map((language, index) => (
                    <li key={index}>{language}</li>
                ))}
            </ul>
            <img className="flag" src={country["flags"]["svg"]} />
            <Weather country={country}/>
        </>
    )
}

export default Information
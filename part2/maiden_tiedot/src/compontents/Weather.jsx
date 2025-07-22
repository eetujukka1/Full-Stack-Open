import { useEffect, useState } from "react"
import weatherService from "../services/weather"

const Weather = ({ country }) => {
    const [temperature, setTemperature] = useState(null)
    const [wind, setWind] = useState(null)
    const [icon, setIcon] = useState(null)

    useEffect(() => {
        weatherService
        .getWeather( country["latlng"][0], country["latlng"][1] )
        .then(data => {
            setIcon(`https://openweathermap.org/img/wn/${data["current"]["weather"][0]["icon"]}@2x.png`)
            setTemperature(data["current"]["temp"])
            setWind(data["current"]["wind_speed"])
        })  
    })

    if (temperature === null) {
        return (
            <div>
                Loading...
            </div>
        )
    } else {
        return (
            <>
                <h3>Weather in {country["capital"]}</h3>
                <div>Temperature {temperature} Celsius</div>
                <img src={icon}/>
                <div>Wind {wind} </div>
            </>
    )
    }
}

export default Weather
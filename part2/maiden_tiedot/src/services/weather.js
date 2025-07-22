import axios from "axios";
const baseUrl = "http://api.openweathermap.org"
const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

const getWeather = ( lat, lng ) => {
    const request = axios.get(`${baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`)
    return request.then(response => response.data)
}

export default { getWeather }
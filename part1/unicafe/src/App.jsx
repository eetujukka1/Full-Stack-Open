import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value, unit}) => <tr><td>{text}</td><td>{value} {unit}</td></tr>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [percentage, setPercentage] = useState(0)

  const handleGood = () => {
    const newGood = good + 1
    const newTotal = total + 1
    const newPercentage = newGood / newTotal * 100
    const newAverage = (newGood * 1 + neutral * 0 + bad * -1) / newTotal
    setGood(newGood)
    setTotal(newTotal)
    setPercentage(newPercentage)
    setAverage(newAverage)
  }

  const handleNeutral = () => {
    const newNeutral = neutral + 1
    const newTotal = total + 1
    const newPercentage = good / newTotal * 100
    const newAverage = (good * 1 + newNeutral * 0 + bad * -1) / newTotal
    setNeutral(newNeutral)
    setTotal(newTotal)
    setPercentage(newPercentage)
    setAverage(newAverage)
  }

  const handleBad = () => {
    const newBad = bad + 1
    const newTotal = total + 1
    const newPercentage = good / newTotal * 100
    const newAverage = (good * 1 + neutral * 0 + newBad * -1) / newTotal
    setBad(newBad)
    setTotal(newTotal)
    setPercentage(newPercentage)
    setAverage(newAverage)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGood} text="Good"/>
      <Button onClick={handleNeutral} text="Neutral"/>
      <Button onClick={handleBad} text="Bad"/>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} percentage={percentage}/>
    </div>
  )
}

const Statistics = ({good, neutral, bad, total, average, percentage}) => {
  if (total <= 0) {
    return (
      <>
        <h1>Statistics</h1>
        <div>No feedback given</div>
      </>
    )
  }
  
  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good}/>
          <StatisticLine text="Neutral" value={neutral}/>
          <StatisticLine text="Bad" value={bad}/>
          <StatisticLine text="Total" value={total}/>
          <StatisticLine text="Average" value={average}/>
          <StatisticLine text="Positive: " value={percentage} unit="%"/>
        </tbody>
      </table>
    </>
  )
}

export default App
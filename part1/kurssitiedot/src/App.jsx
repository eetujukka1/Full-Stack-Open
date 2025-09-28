import { useState } from 'react'

const sum = (parts) => {
  let total = 0
  parts.forEach(part => {
    total = total + part.exercises
  });
  return total
}

const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <>{parts.map(value => <Part key={value.name} part={value}/>)}</>
  )
}

const Total = (props) => <p>Number of exercises {sum(props.parts)}</p>

const Part = (props) => <p>{props.part.name} {props.part.exercises}</p>

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10
      },
      {
        name: "Using props to pass data",
        exercises: 7
      },
      {
        name: "State of a component",
        exercises: 14
      },
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App

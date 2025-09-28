const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({course}) => <h2>{course}</h2>

const Content = ({parts}) => <>{parts.map(value => <Part key={value.id} part={value}/>)}</>

const Total = ({parts}) => <p><b>Number of exercises: {parts.reduce((sum, part) => sum + part["exercises"], 0)}</b></p>

const Part = (props) => <p>{props.part.name} {props.part.exercises}</p>

export default Course
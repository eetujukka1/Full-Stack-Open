import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const VoteCounter = ({votes}) => <div>{votes} votes</div>

const Anecdote = ({anecdote, text, votes}) => {
  return (
    <>
      <h1>{text}</h1>
      <div>{anecdote}</div>
      <VoteCounter votes={votes}/>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  const [mostVoted, setMostVoted] = useState(0)

  const handleNext = () => {
    const newSelected = Math.floor(Math.random() * anecdotes.length)
    setSelected(newSelected)
  }

  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    const mostVotes = newVotes.indexOf(Math.max(...newVotes))
    setMostVoted(mostVotes)
  }

  return (
    <>
      <Anecdote anecdote={anecdotes[selected]} text="Today's anecdote" votes={votes[selected]}/>
      <Button onClick={handleNext} text="Next"/>
      <Button onClick={handleVote} text="Vote"/>
      <Anecdote anecdote={anecdotes[mostVoted]} text="Most voted anecdote" votes={votes[mostVoted]}/>
    </>
  )
}

export default App
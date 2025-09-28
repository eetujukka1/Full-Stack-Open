import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
    appendAnecdote(state, action) {
      return [...state, action.payload]
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = object => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update({
      ...object,
      votes: object.votes + 1
    })
    dispatch(vote(updatedAnecdote))
  }
}

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from './requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newNoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newNoteMutation.mutate({ content, important: true }, {
      onSuccess: (data) => {
        dispatch({ type: 'SHOW', payload: `You added ${data.content}`})
        setTimeout(() => dispatch({ type: 'HIDE'}), 5000)
      },
      onError: (error) => {
        if (error.response.status === 400) {
          console.log(error)
          dispatch({ type: 'SHOW', payload: error.response.data.error})
        } else {
          dispatch({ type: 'SHOW', payload: `Error adding anecdote: ${error}`})
        }
        setTimeout(() => dispatch({ type: 'HIDE'}), 5000)
      }
    })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './components/requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation(
    {mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], 
        anecdotes.map(anecdote => 
          (anecdote.id === updatedAnecdote.id) 
          ? updatedAnecdote 
          : anecdote)
      )
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate(
      { ...anecdote, votes: anecdote.votes + 1 },
      {
        onSuccess: (data) => {
          dispatch({ type: 'SHOW', payload: `You voted ${data.content}`})
          setTimeout(() => dispatch({ type: 'HIDE'}), 5000)
        },
        onError: (error) => {
          dispatch({ type: 'SHOW', payload: `Error voting: ${error}`})
          setTimeout(() => dispatch({ type: 'HIDE'}), 5000)
        }
      }
    );
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems with server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

import { useNotificationValue } from "../NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const notification = useNotificationValue()

  if (notification.hidden) return null

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification

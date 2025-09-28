import { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        hidden: false,
        message: action.payload
      }
      case 'HIDE':
        return {
          hidden: true,
          message: ''
        }
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { hidden: true, message: '' })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[1]
}

export default NotificationContext
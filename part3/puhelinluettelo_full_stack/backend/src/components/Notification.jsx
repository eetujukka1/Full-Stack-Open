const Notification = ({ message, value }) => {
    if (message === null) {
        return null
    }
    if (value) {
        return (
            <div className="success">
                {message}
            </div>
        )
    }
    return (
        <div className="error">
            {message}
        </div>
    )
}

export default Notification
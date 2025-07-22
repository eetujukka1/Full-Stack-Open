const Country = ({name, onClick}) => {
    return (
        <div>
            {name}
            <button onClick={onClick}>Show</button>
        </div>
    )
}

export default Country
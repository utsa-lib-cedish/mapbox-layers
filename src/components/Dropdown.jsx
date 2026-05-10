import '../css/Dropdown.css';

function Dropdown( {options, id, selectedValue, onChange }){
    return <div className='select-and-label'>
        <label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}:</label>
        <div className='select-wrapper'>
            <select
                className='dropdown' id={id}
                onChange={onChange}
                value={selectedValue}
            >
                {
                    options.map(option => (
                        <option
                            value={option.code}
                            key={option.code}
                        >
                            {option.name}
                        </option>
                    ))
                }
            </select>
        </div>
    </div>

}

export default Dropdown;
import '../css/Modal.css';
import ReactDOM from "react-dom";

function Modal ( {onClick} ) {
    return ReactDOM.createPortal(
        <div
            onClick={onClick}
            className='modalWrapper'
        >
            <div className='modalContent'>
                <h2>Mexican Indigenous Population Explorer</h2>
                <ul>
                    <li>Select a Mexican state from the dropdown</li>
                    <li>The map will zoom in to that state</li>
                    <li>A second dropdown will list the top ten Indigenous people by population in that state</li>
                    <li>Select a group to see a choropleth with the relative population in each municipality</li>
                    <li>Hover over a municipality to see the population statistic for that place</li>
                </ul>
               <button>OK</button>
            </div>
        </div>,
        document.querySelector('#modal-container')
    )
}

export default Modal;
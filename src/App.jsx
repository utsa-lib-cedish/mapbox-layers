import { useState } from "react";
import Map from "./components/Map";
import './css/App.css';
import states from './data/mex-states.json';
import Dropdown from "./components/Dropdown";

function App(){
    const [selectedState, setSelectedState] = useState("");

    const handleChange = (e) => {
        console.log(e.target.value);
        setSelectedState(e.target.value);
    }

    return <div id="page-wrapper">
       <Dropdown
           options={states}
           id="state"
           selectedValue={selectedState}
           onChange={handleChange}
       />
       <Map selectedState={selectedState} />
    </div>
}

export default App;
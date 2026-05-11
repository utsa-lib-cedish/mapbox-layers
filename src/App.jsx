import { useState, useEffect } from "react";
import Map from "./components/Map";
import './css/App.css';
import states from './data/mex-states.json';
import Dropdown from "./components/Dropdown";
import groupsByState from './data/state-groups.json';

const COLORS = [
    "#8B4513", "#2E8B57", "#4169E1", "#D2691E",
    "#8A2BE2", "#B22222", "#20B2AA", "#CD853F",
    "#556B2F", "#FF8C00"
];

function App(){
    const [selectedState, setSelectedState] = useState("");
    const [stateGroups, setStateGroups] = useState([]);

    useEffect(() => {
        const groups = groupsByState[selectedState] || [];

         const newGroups = groups.map((group, i) => ({
            ...group,
            color: COLORS[i],
            active: i === 0
        }));

        setStateGroups(newGroups);
        }, [selectedState]);


    const handleChange = (e) => {
        setSelectedState(e.target.value);
    }

    const handleGroupChange = e => {
        const code = e.target.value;
        setStateGroups(prev => prev.map(group => ({
            ...group,
            active: group.code === code
        })));
    }

    return <div id="page-wrapper">
       <div id="dropdowns">
           <Dropdown
               options={states}
               id="state"
               selectedValue={selectedState}
               onChange={handleChange}
           />
           {selectedState && <Dropdown
                options={stateGroups}
                id='group'
                selectedValue={stateGroups.find(group => group.active)?.code || ""}
                onChange={handleGroupChange}
           />}
       </div>
       <Map selectedState={selectedState} groupList={stateGroups} />
    </div>
}

export default App;
import React, {useState} from 'react';
import './OptionsPanelPFV.css';

var started = false;

function OptionsPanel(props) { 

    function startButton() {
        started = !props.started;
        props.startButton(started);
    }

    function returnNodeType(e) {
        props.setNodeType(Number.parseInt(e.target.value));
    }

    function returnSortAlg(e) {
        props.sortAlgSet(e.target.value);
    }

    function returnSpeed(e) {
        props.sortSpeedSet(e.target.value);
    }

    return(
        <div className="OptionsPanel">
            <h1>PATH FINDING VISUALISER</h1>
            <h3>Node Type
                <br/>
                <div onChange={returnNodeType}>
                    <input className="ntInput" type="radio" value="0" name="nodeType" defaultChecked/>Start Node<span className=""></span>
                    <input className="ntInput" type="radio" value="1" name="nodeType"/>End Node
                </div>
            </h3>
            <br/>
            <h3>Path Finding Algorithm
                <br/>
                <select onChange={e => {returnSortAlg(e)}}>
                    <option value="0">Dijkstra's Algorithm</option>
                    <option value="1">A* Algorithm</option>
                </select>    
            </h3>
            <br/>
            <h3>Path Finding Speed
                <br/>
                <input onChange={e => {returnSpeed(e)}} className="slider" type="range" min="0" max="0.99" step="0.01"/>
            </h3>
            <br/>
            <button onClick={startButton}>{props.started ? "Reset" : "Start"}</button>
        </div>
    );
}

export default OptionsPanel;
import React from 'react';
import './OptionsPanelPFV.css';

var isStarted = false;

const OptionsPanel = (props) => { 

    const StartPathFinding = () => {
        isStarted = !props.isStarted;
        props.StartPathFinding(isStarted);
    }

    const ReturnNodeType = (event) => {
        props.SetNodeType(Number.parseInt(event.target.value));
    }

    const ReturnSortAlg = (event) => {
        props.SetSortAlg(event.target.value);
    }

    const ReturnSpeed = (event) => {
        props.SetSortSpeed(event.target.value);
    }

    return(
        <div className="OptionsPanel">
            <h1>PATH FINDING VISUALISER</h1>
            <h3>Node Type
                <br/>
                <div onChange={ReturnNodeType}>
                    <input className="ntInput" type="radio" value="0" name="nodeType" defaultChecked/>Start Node<span className=""></span>
                    <input className="ntInput" type="radio" value="1" name="nodeType"/>End Node
                </div>
            </h3>
            <br/>
            <h3>Path Finding Algorithm
                <br/>
                <select onChange={event => {ReturnSortAlg(event)}}>
                    <option value="0">Dijkstra's Algorithm</option>
                    <option value="1">A* Algorithm</option>
                </select>    
            </h3>
            <br/>
            <h3>Path Finding Speed
                <br/>
                <input onChange={event => {ReturnSpeed(event)}} className="slider" type="range" min="0" max={0.5 - Number.MIN_VALUE} step="0.001"/>
            </h3>
            <br/>
            <button onClick={StartPathFinding}>{props.isStarted ? "Reset" : "Start"}</button>
        </div>
    );
}

export default OptionsPanel;
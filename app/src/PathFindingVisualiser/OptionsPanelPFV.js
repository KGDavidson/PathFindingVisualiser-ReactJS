import React from 'react';
import './OptionsPanelPFV.css';

var started = false;

const OptionsPanel = (props) => { 

    const StartPathFinding = () => {
        started = !props.started;
        props.StartPathFinding(started);
    }

    const ReturnNodeType = (e) => {
        props.SetNodeType(Number.parseInt(e.target.value));
    }

    const ReturnSortAlg = (e) => {
        props.SetSortAlg(e.target.value);
    }

    const ReturnSpeed = (e) => {
        //props.SetSortSpeed(e.target.value);
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
                <select onChange={e => {ReturnSortAlg(e)}}>
                    <option value="0">Dijkstra's Algorithm</option>
                    <option value="1">A* Algorithm</option>
                </select>    
            </h3>
            <br/>
            <h3>Path Finding Speed
                <br/>
                <input onChange={e => {ReturnSpeed(e)}} className="slider" type="range" min="0" max="0.99" step="0.01"/>
            </h3>
            <br/>
            <button onClick={StartPathFinding}>{started ? "Reset" : "Start"}</button>
        </div>
    );
}

export default OptionsPanel;
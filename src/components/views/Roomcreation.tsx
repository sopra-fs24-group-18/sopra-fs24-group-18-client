import React, { useState } from "react";
import { api, handleError } from "helpers/api";
//import User from "models/User";
import {useNavigate} from "react-router-dom";
import "styles/views/Roomcreation.scss";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="creation field">
      <label className="creation label">{props.label}</label>
      <input
        className="creation input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
interface DropdownProps {
  title: string;
  options: string[];
  onSelect: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownProps> = ({ title, options, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsVisible(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-title">{title}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          className="button-dropdown"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={`Toggle ${title}`}
        >
        </button>
        <div className="selected-option">
          {selectedOption}
        </div>
      </div>
      {isVisible && (
        <div className="menu-container">
          {options.map((option, index) => (
            <button key={index} onClick={() => handleSelect(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface RoomCreationProps {}

const RoomCreation: React.FC<RoomCreationProps> = () => {
  const [gameMode, setGameMode] = useState("");
  const [playerAmount, setPlayerAmount] = useState("");
  const navigate = useNavigate();
  const [name, setRoomName] = useState("");


  const handleSubmit = async () => {
    try {
      const ownerId = sessionStorage.getItem("userId");
      const userId = sessionStorage.getItem("userId");
      if (!ownerId) {
        alert("Owner ID is not available. Please log in again.");

        return;
      }
      if (name ==="" || playerAmount === "" || gameMode === "")
      { alert("Please fill out all blanks: room name, game mode and player number.")

        return ;}

      console.log("test:", { name, ownerId, playerAmount: Number(playerAmount), gameMode });
      // request to create room
      const response = await api.post("/rooms", {
        name,
        ownerId,
        playerAmount: Number(playerAmount),
        gameMode
      });

      //check response
      if(response.data && response.data.roomCode) {
        const { roomCode } = response.data;
        //const roomId = response.data.id;
        // store it for using in game room
        //sessionStorage.setItem("roomCode", roomCode);
        sessionStorage.setItem("roundNumber", "1");
        //sessionStorage.setItem("roomId", roomId);
        const roundNumber = Number(sessionStorage.getItem("roundNumber"))

        // store it for using in game room
        const roomData = response.data;
        sessionStorage.setItem("roomId", roomData.id);
        sessionStorage.setItem("playerNames", roomData.playerNames);
        sessionStorage.setItem("roomCode", roomCode);
        sessionStorage.setItem("gameMode", gameMode);
        sessionStorage.setItem("timeLeft", "4");
        navigate("/prepare");
        console.log("Room created:", { roomCode, name, ownerId, playerAmount: Number(playerAmount), gameMode, roundNumber });
      } else {
        alert("Failed to retrieve room code after creation");
      }
    } catch (error) {
      console.error(`Failed to create room: ${error}`);
      alert(`Failed to create room: ${error}`);
    }
  };
  const userId = sessionStorage.getItem("userId");
  const handleCancel = () => {
    navigate(`/lobby/${userId}`);
  };

  return (
    <div className="background-container">
      <div className="creation container">
        <div className="creation form">

          <DropdownMenu
            title="Player Number"
            options={["1", "2", "3"]}
            onSelect={setPlayerAmount}
          />

          <DropdownMenu
            title="Game Mode"
            options={["GUESSING", "BUDGET"]}
            onSelect={setGameMode}
          />
          <FormField
            label="Room Name"
            value={name}
            onChange={(un: string) => setRoomName(un)}
          />

          <div className="button-group">
            <button className="button-ok" onClick={handleSubmit}>
            </button>
            <button className="button-cancel" onClick={handleCancel}>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCreation;
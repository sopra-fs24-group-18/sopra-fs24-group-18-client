import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import "styles/views/Roomcreation.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

interface DropdownProps {
  title: string;
  options: string[];
  onSelect: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownProps> = ({ title, options, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsVisible(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-title">{title}</div>
      <button
        className="button-dropdown"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={`Toggle ${title}`}
      >
        {selectedOption || 'Choose'}
      </button>
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
  const [gameMode, setGameMode] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log({ gameMode, playerNumber });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="background-container">
      <div className="creation container">
        <DropdownMenu
          title="Player Number"
          options={['1', '2', '3']}
          onSelect={setPlayerNumber}
        />

        <DropdownMenu
          title="Game Mode"
          options={['Easy', 'Hard']}
          onSelect={setGameMode}
        />

        <div className="button-group">
          <button className="button-ok" onClick={handleSubmit} disabled={!gameMode || !playerNumber}>
          </button>
          <button className="button-cancel" onClick={handleCancel}>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCreation;
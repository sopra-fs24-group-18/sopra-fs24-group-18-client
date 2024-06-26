import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import Tool from "models/Tool";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Shop.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


const Purchase = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(parseInt(sessionStorage.getItem("timeLeft"))-2);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [player, setPlayer] = useState("");
  const userId = sessionStorage.getItem("userId");
  const roomId = sessionStorage.getItem("roomId");
  const roomCode = sessionStorage.getItem("roomCode");
  const gameMode = sessionStorage.getItem("gameMode");

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response_rank = await api.get(`/rooms/${roomId}/rank`);
        if (response_rank.data.length === 1){
          sessionStorage.setItem("isBlurDisabled", "true");
          sessionStorage.setItem("isDefenseDisabled", "true");
          sessionStorage.setItem("isBonusDisabled", "true");
          sessionStorage.setItem("isGambleDisabled", "true");
        }
      } catch (error) {
        console.error("Error fetching points", error);
      }
    };
    fetchPoints();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${userId}`);
        setPlayer(response.data);
        console.log("User data fetched successfully:", response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
      }
    }

    fetchUser();
  }, [userId]);

  // timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if(timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
        sessionStorage.setItem("timeLeft", timeLeft.toString());
      }
    }, 1000);

    if (timeLeft === 0) {
      clearTimeout(timer);
      if (gameMode === "BUDGET") {
        sessionStorage.setItem("timeLeft", "32");
        navigate(`/rooms/${roomCode}/${userId}/budget`);
      } else {
        sessionStorage.setItem("timeLeft", "32");
        navigate(`/rooms/${roomCode}/${userId}/guessing`);
      }

    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const doPurchase = async (toolType) => {
    try {
      const response = await api.get("/tools");
      if (toolType === response.data[0].type) {
        const tool = new Tool(response.data[0]);
        const toolId = tool.id;
        const response_2 = await api.post(`/tools/${toolId}/${roomId}/${userId}`);
        displayMessage(`Buy and use the ${toolType} successfully!`, "success-message");
        sessionStorage.setItem("isHintDisabled", "true");
        const response_buy = await api.get(`/users/${userId}`);
        setPlayer(response_buy.data);
      } else if (toolType === response.data[1].type) {
        const tool_2 = new Tool(response.data[1]);
        const toolId_2 = tool_2.id;
        const response_3 = await api.post(`/tools/${toolId_2}/${roomId}/${userId}`);
        displayMessage(`Buy and use the ${toolType} successfully!`, "success-message");
        sessionStorage.setItem("isBlurDisabled", "true");
        const response_buy = await api.get(`/users/${userId}`);
        setPlayer(response_buy.data);
      } else if (toolType === response.data[2].type) {
        const tool_3 = new Tool(response.data[2]);
        const toolId_3 = tool_3.id;
        const response_4 = await api.post(`/tools/${toolId_3}/${roomId}/${userId}`);
        displayMessage(`Buy and use the ${toolType} successfully!`, "success-message");
        sessionStorage.setItem("isDefenseDisabled", "true");
        const response_buy = await api.get(`/users/${userId}`);
        setPlayer(response_buy.data);
      } else if (toolType === response.data[3].type) {
        const tool_4 = new Tool(response.data[3]);
        const toolId_4 = tool_4.id;
        const response_5 = await api.post(`/tools/${toolId_4}/${roomId}/${userId}`);
        displayMessage(`Buy and use the ${toolType} successfully!`, "success-message");
        sessionStorage.setItem("isBonusDisabled", "true");
        sessionStorage.setItem("isGambleDisabled", "true");
        const response_buy = await api.get(`/users/${userId}`);
        setPlayer(response_buy.data);
      } else if (toolType === response.data[4].type) {
        const tool_5 = new Tool(response.data[4]);
        const toolId_5 = tool_5.id;
        const response_6 = await api.post(`/tools/${toolId_5}/${roomId}/${userId}`);
        displayMessage(`Buy and use the ${toolType} successfully!`, "success-message");
        sessionStorage.setItem("isBonusDisabled", "true");
        sessionStorage.setItem("isGambleDisabled", "true");
        const response_buy = await api.get(`/users/${userId}`);
        setPlayer(response_buy.data);
      } else {
        displayMessage("Cannot find this tool.", "error-message");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        displayMessage("You don't have enough points.", "error-message");
      } else {
        displayMessage(`Something went wrong during the purchase: ${handleError(error)}`, "error-message");
      }
    }
  };

  const displayMessage = (messageText, messageType) => {
    setMessage({ text: messageText, type: messageType });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 5000); // Hide message after 5 seconds
  };

  const leaveRoom = async () => {
    try {
      const requestBody = { roomId, userId };
      await api.post(`/rooms/${roomId}/${userId}/exit`, requestBody);
      // for game room
      sessionStorage.removeItem("playerNames");
      sessionStorage.removeItem("questionId");
      sessionStorage.removeItem("rank");
      sessionStorage.removeItem("roomCode");
      sessionStorage.removeItem("roomId");
      sessionStorage.removeItem("roundNumber");
      sessionStorage.removeItem("timeLeft");
      sessionStorage.removeItem("gameMode");

      // for waiting answer
      sessionStorage.removeItem("isReady_answer");
      sessionStorage.removeItem("myScore");
      sessionStorage.removeItem("realPrice");
      sessionStorage.removeItem("showAlert");
      sessionStorage.removeItem("isReady_answer_timer");
      sessionStorage.removeItem("bonus");

      // for shop
      sessionStorage.removeItem("isHintDisabled");
      sessionStorage.removeItem("isBlurDisabled");
      sessionStorage.removeItem("isDefenseDisabled");
      sessionStorage.removeItem("isBonusDisabled");
      sessionStorage.removeItem("isGambleDisabled");
      sessionStorage.removeItem("showAlert_shop");
      sessionStorage.removeItem("showAlert_loading");
      navigate(`/lobby/${userId}`);
    } catch (error) {
      console.error("Error deleting server data:", error);
    }
  };

  const skipShop = async () => {
    sessionStorage.setItem("showAlert_shop", "false");
    sessionStorage.setItem("showAlert_loading", "true");
  };


  return (
    <div className="background-container">
      {(sessionStorage.getItem("showAlert_shop") === "true") && (<BaseContainer>
        <div style={{ marginTop: "80px",marginBottom: "-40px", fontSize: "22px", fontFamily: "\"Arial\", sans-serif", textAlign: "center" }}>
          Tools are automatically used immediately after purchase.
        </div>
        <div className="shop container">
          {/* Display message */}
          {message.text && (
            <div style={{ fontSize: "20px", fontFamily: "\"Arial\", sans-serif", textAlign: "center" }}>
              {/*<div className={`message-container ${message.type}`}>*/}
              {message.text}
            </div>
          )}
          <div className="shop form"><br /><br />
            {/* Display remaining time */}
            <div style={{ position: "absolute", top: 50, left: 100, textAlign: "center" }}>
                Time: <br />
              {timeLeft}
            </div>
            {/* Display Points */}
            <div style={{ position: "absolute", top: 50, right: 100, textAlign: "center" }}>
                Your Point: <br />
              {player.score}
            </div>

            {/* Get Hints */}
            <div style={{ marginTop: "40px", textAlign: "left", fontSize: "15px" }}>
                Hints: 30 Points
            </div>
            <div className="shop button-container"
              style={{ display: "flex", justifyContent: "space-between", margin: 0, padding: 0 }}>
              <button className="shop hint"></button>
              <button className="shop buy-button"
                disabled={(sessionStorage.getItem("isHintDisabled") === "true")}
                onClick={() => doPurchase("HINT")}
              >
                  Buy
              </button>
            </div>
            <div style={{ fontSize: "10px", fontFamily: "\"Microsoft YaHei\", sans-serif" }}>
                You can use this tool to get hints.
            </div>

            {/* Disturb Others */}
            <div style={{ marginTop: "10px", textAlign: "left", fontSize: "15px" }}>
                Blur: 50 Points
            </div>
            <div className="shop button-container"
              style={{ display: "flex", justifyContent: "space-between", margin: 0, padding: 0 }}>
              <button className="shop bomb"></button>
              <button className="shop buy-button"
                disabled={(sessionStorage.getItem("isBlurDisabled") === "true")}
                onClick={() => doPurchase("BLUR")}
              >
                  Buy
              </button>
            </div>
            <div style={{ fontSize: "10px", fontFamily: "\"Microsoft YaHei\", sans-serif" }}>
                You can use this tool to disturb other player.
            </div>

            {/* Prevent your images from being blurred */}
            <div style={{ marginTop: "10px", textAlign: "left", fontSize: "15px" }}>
                Defense: 20 Points
            </div>
            <div className="shop button-container"
              style={{ display: "flex", justifyContent: "space-between", margin: 0, padding: 0 }}>
              <button className="shop defense"></button>
              <button className="shop buy-button"
                disabled={(sessionStorage.getItem("isDefenseDisabled") === "true")}
                onClick={() => doPurchase("DEFENSE")}
              >
                  Buy
              </button>
            </div>
            <div style={{ fontSize: "10px", fontFamily: "\"Microsoft YaHei\", sans-serif" }}>
                You can use this tool to prevent your images from being blurred.
            </div>

            {/* If you get the first prize in the next round, you can get an extra 60 points */}
            <div style={{ marginTop: "10px", textAlign: "left", fontSize: "15px" }}>
                Bonus: 20 Points
            </div>
            <div className="shop button-container"
              style={{ display: "flex", justifyContent: "space-between", margin: 0, padding: 0 }}>
              <button className="shop bonus"></button>
              <button className="shop buy-button"
                disabled={(sessionStorage.getItem("isBonusDisabled") === "true")}
                onClick={() => doPurchase("BONUS")}
              >
                  Buy
              </button>
            </div>
            <div style={{ fontSize: "10px", fontFamily: "\"Microsoft YaHei\", sans-serif" }}>
                You can use this tool to earn an extra 60 points by winning 1st prize in the next round.
            </div>

            {/* Prevent your images from being blurred */}
            <div style={{ marginTop: "10px", textAlign: "left", fontSize: "15px" }}>
                Gamble: 40 Points
            </div>
            <div className="shop button-container"
              style={{ display: "flex", justifyContent: "space-between", margin: 0, padding: 0 }}>
              <button className="shop gamble"></button>
              <button className="shop buy-button"
                disabled={(sessionStorage.getItem("isGambleDisabled") === "true")}
                onClick={() => doPurchase("GAMBLE")}
              >
                  Buy
              </button>
            </div>
            <div style={{ fontSize: "10px", fontFamily: "\"Microsoft YaHei\", sans-serif" }}>
                You can use this tool to gamble. If you win 1st prize next round, your get an extra 150 points; if not,
              you get 0 points next round and deduct an additional 100 points.
            </div>
            <br />
          </div>

        </div>

      </BaseContainer>)}

      {(sessionStorage.getItem("showAlert_loading") === "true") && (<div className="shop_loading">
        <br /><br /><br /><br />Preparing for the next round ......<br />
      </div>)}

      {(sessionStorage.getItem("showAlert_shop") === "true") && (<div className="shop button-container">
        <Button
          width="100%"
          onClick={() => {
            skipShop();
          }}
        >
          Skip
        </Button>
      </div>)}

      <div className="exit_button-container"
        width="100%"
        onClick={() => {
          leaveRoom();
        }}
      >
        Exit
      </div>

    </div>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Purchase;

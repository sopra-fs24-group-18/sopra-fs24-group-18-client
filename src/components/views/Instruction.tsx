import React from "react";
import "styles/views/Instruction.scss";
import { useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";

const Instruction= () => {
  const navigate = useNavigate();
  const navigateToMainPage = () => {
    navigate("/lobby/:userId");
  };

  return (
    <div className="instruction">
      <div className="instruction_container">
        <div className="instruction_container_content">
          <h1>Welcome to the Game! 🎉</h1>
          <p>Ready to dive into the fun? Here&apos;s how to play:</p>

          <h2>Getting Started 🏁</h2>
          <p>
            After logging into the Lobby, you can either create a game room or join an existing one using a room code.
          </p>

          <h2>Game Modes 🎮</h2>
          <p>We have two exciting game modes for you to enjoy:</p>
          <ul>
            <li>
              <strong>Guessing:</strong> You&apos;ll see an image and need to use the slider bar to choose a price. Hit confirm within 30 seconds!
            </li>
            <li>
              <strong>Budget:</strong> You&apos;ll get a budget and need to pick a set of images from six options within 30 seconds.
            </li>
          </ul>

          <h2>Power Up with Tools 🛠️</h2>
          <p>After each round, you can use your points to buy tools for the next round. <br/>
            If you start the game as the only player, you will only be able to purchase the hint tool.<br/>
            Everyone starts with 100 points. Here’s what you can get:</p>
          <ul>
            <li><strong>Hint:</strong> Narrows down the price range in Guessing mode or shows how many items to choose in Budget mode.💡</li>
            <li><strong>Blur:</strong> Blurs the images of other players. 😵‍💫</li>
            <li><strong>Defense:</strong> Prevents your images from being blurred. 🛡️</li>
            <li><strong>Bonus:</strong> Earn an extra 60 points if you win the next round. 🎁</li>
            <li><strong>Gamble:</strong> Earn an extra 150 points if you win the next round, but get 0 points and deduct an additional 100 points if you don&apos;t! 🎲</li>
          </ul>

          <h2>Winning the Game 🏆</h2>
          <p>
            The winner of each round gets 100 points, the 2nd place receives 70 points, and the 3rd place receives 40 points. Remember, the key to winning is to choose the closest price!
          </p>
          <p>Good luck and have fun! 😃</p>
        </div>
      </div>


      <Button
        style={{
          width: "20%",
          position: "fixed",
          bottom: "10%",
          left: "40%",
        }}
        onClick={navigateToMainPage}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        Got it!
      </Button>

    </div>

  );
};

export default Instruction;


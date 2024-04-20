import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Mainpage from '../../views/Mainpage';
import Register from '../../views/Register';
import Roomcreation from '../../views/Roomcreation';
import Gameroom from "../../views/Gameroom";
import Gameroommock from "../../views/Gameroommock";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* this is for firstly open the mainpage */}
        <Route path="/" element={<Mainpage />} />

        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game"/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/register" element={<Register/>} />
        <Route path="/roomcreation" element={<Roomcreation/>} />
        <Route path="/gameroom" element={<Gameroom/>} />
        <Route path="/gameroomo" element={<Gameroommock/>} />

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;

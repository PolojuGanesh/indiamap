import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const DashboardRoute = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardData = async () => {
    const token = Cookies.get("jwt_token");
    const url = "http://localhost:3000/dashboard";
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      setCards(data.cards);
    }
  };

  const clickOnMapButton = () => {
    navigate("/map");
  };

  const clickOnLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>
      {cards.map((card) => (
        <ul className="dashboard-ul-container" key={card.id}>
          <li className="dashboard-each-list">{card.title}</li>
        </ul>
      ))}
      <div>
        <button
          className="map-logout-button"
          type="button"
          onClick={clickOnMapButton}
        >
          Map
        </button>
        <button
          className="map-logout-button"
          type="button"
          onClick={clickOnLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardRoute;

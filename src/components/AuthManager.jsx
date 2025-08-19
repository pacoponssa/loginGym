// // src/components/AuthManager.jsx
// import { useNavigate } from "react-router-dom";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";

// const AuthManager = () => {
//   const navigate = useNavigate();
//   const { setLogoutCallback } = useContext(AuthContext);

//   useEffect(() => {
//     setLogoutCallback(() => () => {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("usuario");
//       delete axios.defaults.headers.common["Authorization"];
//       navigate("/", { state: { expired: true } });
//     });
//   }, [setLogoutCallback, navigate]);

//   return null;
// };

// export default AuthManager;

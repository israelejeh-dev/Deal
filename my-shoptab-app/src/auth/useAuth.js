// src/auth/useAuth.js
// Custom React hook to access authentication context

import { useContext } from "react";
import AuthContext from "./context";


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      shop: { id: "default_shop", name: "My Shop" },
      loading: false,
      signup: async () => {},
      login: async () => {},
      logout: async () => {},
      sendOtp: async () => ({ isDevTest: true }),
      verifyOtp: async () => ({ hasShop: true }),
      saveShopSetup: async () => {},
    };
  }
  return context;
}

export default useAuth;

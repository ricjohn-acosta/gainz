import { AuthError, Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { create } from "zustand";

import useProfileStore from "./profileStore";
import { supabase } from "../services/supabase";

interface AuthState {
  notLoaded: boolean;
  session: Session | null;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<User | AuthError | null>;
  signUp: (
    username: string,
    email: string,
    password: string,
  ) => Promise<User | AuthError | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  notLoaded: true,
  session: null,
  setSession: async (session) => {
    if (!session) {
      useProfileStore.setState({ data: { me: null } });
      set({ notLoaded: false });
      return;
    }

    set({ session });
    set({ notLoaded: false });
    await useProfileStore.getState().operations.getMeProfile();
  },
  login: async (email, password) => {
    if (!email) return Promise.reject("Email is required");
    if (!password) return Promise.reject("Password is required");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert("Error logging in", "Please contact ric@kapaii.com");
      return Promise.reject(error);
    }
    set({ session: data.session });
    await useProfileStore.getState().operations.getMeProfile();
    return Promise.resolve(data.user);
  },
  signUp: async (username, email, password) => {
    if (!email) return Promise.reject("Email is required");
    if (!password) return Promise.reject("Password is required");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email: email,
        },
      },
    });
    if (error) {
      Alert.alert(error.message);
      return Promise.reject(error);
    }

    set({ session: data.session });
    await useProfileStore.getState().operations.getMeProfile();
    return Promise.resolve(data.user);
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return Promise.reject(error);
    set({ session: null });
    return Promise.resolve();
  },
  resetPassword: async (email) => {
    const resetPasswordURL = Linking.createURL("reset-password");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });
    console.log(data, error);
  },
}));

export default useAuthStore;

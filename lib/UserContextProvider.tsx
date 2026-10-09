import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Nullable } from "typescript-nullable";
import { definitions } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";

interface UserContext {
  user: Nullable<{ id; email }>;
  session: Nullable<Session>;
  roles: UserRole[];
  hasRole: (role: UserRole) => boolean;
}

const UserContext = createContext<UserContext>({
  user: null,
  session: null,
  roles: [],
  hasRole: (role) => false,
});

type UserRole = definitions["user_roles"]["role"];

export const UserContextProvider = (props) => {
  const { supabaseClient } = props;
  const [session, setSession] = useState<Nullable<Session>>(null);
  const [user, setUser] = useState<Nullable<User>>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);

  const fetchUserRoles = useCallback(async () => {
    const { data } = await supabase.from("user_roles").select("role");

    if (data) {
      setRoles(data.map(({ role }) => role));
    }
  }, []);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (Array.isArray(role)) {
        return role.some((r) => roles.includes(r));
      }
      return roles.includes(role);
    },
    [roles]
  );

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    } else {
      setRoles([]);
    }
  }, [fetchUserRoles, user]);

  const value = {
    session,
    user,
    roles,
    hasRole,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};

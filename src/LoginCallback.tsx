import { useEffect } from "react";
import { UserManager, User } from "oidc-client-ts";
import { useNavigate } from "react-router";

type Props = {
  authenticated: string | null;
  setAuth: (authenticated: string | null) => void;
  userManager: UserManager;
};

export default function LoginCallback(props: Props) {
  let navigate = useNavigate();

  useEffect(() => {
    props.userManager
      .signinRedirectCallback()
      .then((user: User) => {
        if (!user) {
          props.setAuth(null);
        }


        props.setAuth(user.access_token ?? null);
        navigate("/");
      })
      .catch((error: any) => {
        console.log(error)
        props.setAuth(null);
      });

  }, [props.authenticated, props.userManager, props.setAuth]);

  return (
    <>
    </>
  )
}

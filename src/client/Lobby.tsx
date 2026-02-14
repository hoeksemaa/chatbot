import { useState } from "react";
import { authClient } from "./lib/authClient";
import { SignupForm } from "./signup-form";
import { LoginForm } from "./login-form";
import { Navigate } from 'react-router'

function Lobby() {
    const [signedUp, setSignedUp] = useState(false)
    const { data: session, isPending } = authClient.useSession()

    if (isPending) return <div>Loading...</div>
    if (session) return <Navigate to="/new" replace />

    const toggleForm = () => {
        if (signedUp) {
            setSignedUp(false)
        } else {
            setSignedUp(true)
        }
    }

    return (signedUp) ?
        <SignupForm onSwitchForm={toggleForm} />
        :
        <LoginForm onSwitchForm={toggleForm} />
}

export default Lobby;
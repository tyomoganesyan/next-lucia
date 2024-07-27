"use client"


import { useActionState } from "react"
import { handleChangeLogin } from "../lib/actions"

export default function SettingsPage() {

  const [state, handleChangeLoginAction] = useActionState(handleChangeLogin, { message: "" })



  return (<>
    <main className="p-4 px-6 mx-6">
      <h1 className="is-size-3">Enter your new Login</h1>
      <div className="columns">
        <div className="column is-two-fifths p-4">
          <form className="box" action={handleChangeLoginAction}>
          {state?.message && <p style={{color:'red'}}>{state.message}</p>}
            <div className="field my-4">
              <input
                type="text"
                className="input is-dark"
                placeholder="please enter your new login"
                name="newLogin"
              />
            </div>
            <div className="field my-4">
              <input
                type="password"
                className="input is-dark"
                placeholder="please enter your password"
                name="password"
              />
            </div>
            <button className="button is-success">submit</button>
          </form>
        </div>
      </div>
    </main>
  </>)
} 
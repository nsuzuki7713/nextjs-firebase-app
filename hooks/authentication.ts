import firebase from 'firebase/app'
import { User } from '../models/User'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'

const userState = atom<User>({
  key: 'user',
  default: null,
})

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState)

  useEffect(() => {
    console.log('Start useEffect')

    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        // Handle Errors here.
        console.log(error)
      })

    firebase.auth().onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        console.log('Set user')
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  return { user }
}

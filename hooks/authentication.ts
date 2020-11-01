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
        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous
        }
        setUser(loginUser)
        createUserIfNotFound(loginUser)
      } else {
        setUser(null)
      }
    })
  }, [])

  return { user }
}

async function createUserIfNotFound(user: User) {
  const userRef = firebase.firestore().collection('users').doc(user.uid)
  const doc = await userRef.get()
  if (doc.exists) {
    // 書き込みの方が高いので！
    return
  }

  await userRef.set({
    name: 'taro' + new Date().getTime(),
  })
}
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useEffect, useState, useReducer, useRef } from 'react'
import Gun from 'gun'


const gun = Gun({
  peers: [
		'https://quarkcompany.com/ws/gun',
  ]
});

const initialState = {
  messages: []
};

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
};


export default function Home() {

  const [formState, setForm] = useState({
    name: '', message: ''
  });

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const messages = gun.get('messages')
    messages.map().once(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      })
    })
  }, [])

  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value })
  }


  function saveMessage() {
    const messages = gun.get('messages')
    messages.set({
      name: prompt("Pon tu Nombre", "Anónimo"),
      message: formState.message,
      createdAt: Date.now()
    })
    setForm({
      name: '', message: ''
    })
  }

  const dummy = useRef()

  return (
    <div>
      <Head>
        <title>DAPP Chat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="https://i.ibb.co/qBVhRpm/me.png" />
      </Head>

      <input className={styles.inputmsg} onChange={onChange} placeholder='Message' name='message' value={formState.message} />
      <button className={styles.send} onClick={saveMessage}>Send</button>

      <div className={styles.msgcontainer}>
        {
          state.messages.map(message => (
            <div key={message.createdAt} className={styles.msgs}>
              <h2>👨‍💻{message.name}</h2>
              <h3>{message.message}</h3>
            </div>
          ))
        }
        <div ref={dummy}></div>
      </div>

    </div>
  )
}

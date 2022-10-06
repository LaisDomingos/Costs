import {useState, useEffect} from 'react'

import styles from './Message.module.css'

function Message({type, msg}){

    //Essa const é para que fique visivel apenas por um tempo a mensagem
    const [visible, setVisible] = useState(false)

    //O useEffect é para o time
    useEffect(() =>{
        //Se a mensagem não existir, setVisible falso
        if(!msg){
            setVisible(false)
            return
        }
        //Se ela existir, ela aparece
        setVisible(true)

        //O tempo que ela vai ficar presente no ecrã
        const timer = setTimeout(() => {
            setVisible(false)
        }, 3000)

        return() => clearTimeout(timer)
    }, [msg] )
    return(
        <>
            {visible && //A mensagem só vai aparecer se estiver visible
                <div className={`${styles.message} ${styles[type]}`}>
                    {msg}
                </div>
            }
        </>
    )
}
export default Message
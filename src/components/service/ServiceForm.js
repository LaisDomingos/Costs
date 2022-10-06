import styles from '../project/ProjectForm.module.css'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import {useState} from 'react'


function ServiceForm({handleSubmit, btnText, projectData }){ //Precisamos do ´projectData pq esses serviços serão adicionados ao projeto

    const [service,setService] = useState({})

    function submit(e) {
        e.preventDefault()
        projectData.services.push(service) //Jogamos o serviço dentro de serviços, ou seja, mais de um serviço
        handleSubmit(projectData)
    }

    function handleChange(e){
        //Para pegar o objeto arual
        setService({...service, [e.target.name]: e.target.value})
    }

    return(
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor total"
                handleOnChange={handleChange}
            />
            <Input
                type="text"
                text="Descriçao do serviço"
                name="description"
                placeholder="Descreva o serviço"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText}/>
        </form>
    )
}
export default ServiceForm
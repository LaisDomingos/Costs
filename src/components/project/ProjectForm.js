import styles from './ProjectForm.module.css'

import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'

import {useEffect, useState} from 'react'

function ProjectForm({handleSubmit, btnText, projectData}){
    const [categories, setCategories] = useState([])
    const [project, setProject] =useState(projectData || {})
    //O useState acima usa a idei de que se o projeto for de edição, vira da const projectData, se não será um array vazio a espera do input
    useEffect(() => { /*Sem esse useEffect ele fica buscando atualização a todo momento*/
        
        /*fetch é um request para a url de categories*/
        fetch("http://localhost:5000/categories",{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())/*peguei os dados da resposta e transformei em json*/
            .then((data) => { 
                setCategories(data) /*peguei os dados em json e coloquei no hook(use State) de setCategories*/
            })
            .catch((err) => console.log(err))
    }, [])/*O status inicial é uma array vazia*/

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project) //passo o projeto que está no formulário para o argumento
        //console.log(project)
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value})
        
    }

    function handleCategory(e){
        setProject({...project, 
            category:{
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text,
        },
    })
        
    }

    return(
        <form onSubmit={submit} className={styles.form}>
           <Input 
                type='text' 
                text='Nome do projeto' 
                name='name'
                placeholder="Insira o nome do projeto"
                handleOnChange={handleChange}
                value={project.name ? project.name : ''}
            />
           <Input 
                type='number' 
                text='Orçamento do projeto' 
                name='budget'
                placeholder="Insira o orçamento total"
                handleOnChange={handleChange}
                value={project.budget ? project.budget : ''}
            />
            <Select
                name="category_id"
                text="Selecione a categoria" 
                options={categories}
                handleOnChange={handleCategory}
                value={project.category ? project.category.id :''} //Se tiver um valor, irá passr esse valor, se não será vazio
            />
           <SubmitButton text={btnText} />
        </form>
    )
}
export default ProjectForm
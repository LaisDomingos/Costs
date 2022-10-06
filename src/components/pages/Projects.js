import { useLocation } from "react-router-dom"  
import { useState, useEffect } from "react"

import Message from "../layout/Message"

import styles from './Projects.module.css'
import Container from '../layout/Container'
import Loading from "../layout/Loading"
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../project/ProjectCard"


function Projects(){

    //Para salvar os projetos
    const [projects, setProjects] = useState([])
    
    //Para colocar a imagem de loading. False pq o loading sempre inicia, true para remover
    const [removeLoading,setRemoveLoading] = useState(false)

    const[projectMessage,setProjectMessage] = useState('')

    const location = useLocation()
    let message =''
    if (location.state){
        message = location.state.message
    }


    useEffect(() => {
        //Esse setTimeOut é só para que possamos ver o loading (mas isso só pq no nosso projeto ele não demora já que esta no servidor)
        setTimeout (() => {
            fetch('http://localhost:5000/projects', {
                method: 'GET',
                headers: {
                    'Content-type':'application/json',
                },
    
            })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                setProjects(data)
                //Ao abrir o console vemos que já temos os projetos carregados
                setRemoveLoading(true) //Quando terminar de carregar os projetos ele será removido
            })
            .catch((err) => console.log(err))
        
        }, 300)

    }, [] )

    function removeProject(id){
        //Isso nos poupa de URL de API
        fetch(`http://localhost:5000/projects/${id}`,{
            method: 'DELETE', //Aqui deleta no backend
            headers : {
                'Content-type': 'application/json',
            },
            })
            .then((resp) => resp.json())
            .then(() => {
                setProjects(projects.filter((projects) => projects.id !== id ))
                //Esse filtro deleta no frontend
                setProjectMessage('Projeto removido com sucesso')
            })
            .catch(err => console.log(err))
    }

    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to='/newproject' text='Criar Projeto'/>
            </div>
            
            {message && //Se tiver uma mensagem, apareçera a mensagem
                <Message type='sucess' msg={message} /> //Nesse caso sempre será de sucesso pq está puxando do NewProject
            }
            {projectMessage && 
                <Message type='sucess' msg={projectMessage} /> 
            }
            <Container customClass='start'>
                {projects.length > 0 && 
                    projects.map((projects) => (
                        <ProjectCard  
                        name={projects.name}
                        id={projects.id}
                        budget={projects.budget}
                        category={projects.category ? projects.category.name : 'Categoria Indefinida'}
                        key={projects.id}
                        handleRemove={removeProject}
                        />
                    ))
                }
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 &&
                    <p>Não há projetos cadastrados!</p>
                }
            </Container>
        </div>
    )
}
export default Projects
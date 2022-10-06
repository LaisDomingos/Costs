import styles from './Project.module.css'
import Loading from '../layout/Loading'
import Container from  '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from  '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react'
import { v4 as uuidv4} from 'uuid'

function Project(){
    
    const {id} = useParams()
    
    const [project,setProject] = useState([])
    const [services,setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false) //Não exibe o formulário do projeto, por isso falso
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message,setMessage] = useState()
    const [type,setType] = useState()

    useEffect(() =>{
        //Nosso projeto sendo regastado do banco
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`,{
            method: "GET",
            headers : {
                'Container-type': 'application/json',
            },
            })
            .then((resp) => resp.json())
            .then((data) => {
               setProject(data)
               setServices(data.services)//Vai vim direto do branco
            })
            .catch(err => console.log(err))
        
        }, 300)
    }, [id])

    function editPost(project){

        setMessage('') //Foi colocado como vazio, pois sem isso, se atualizassemos varias vezes a mensagem pararia de aparacer
        //budget validation => para que quando alterarmos o valor, não possa ser menor do que já tem de gasto dos serviços
        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false //Desejo parar tudo, não quero que o projeto seja atualizado, por isso do return false
        }
        
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),//Se comunicar com o json
            })
            .then(resp => resp.json())
            .then((data) => {
               //Atualizar o dado com o que veio na atualização
                setProject(data)
                setShowProjectForm(false)//Vou esconder o formulário já que já completei a edição
                setMessage('Projeto atualizado!')
                setType('sucess')

            })
            .catch(err => console.log(err))
    }
    
    function createService(project){
        setMessage('')
        //pegar o ultimo serviço  
        const lastService = project.services[project.services.length -1] 

        lastService.id = uuidv4() //Instalamos no começo. Serve para criar um ID e renderizar listas no react
       
        const lastServiceCost = lastService.cost
        
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        //maximum value validation
        if(newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop() //Assim nós tiramos esse serviço, se não ele entra quando outro serviço entrat ou tiver alteração do valor
            return false
        } 

        //add service cost to project total (tenho que atualizar o cost, ou seja, o valor gasto)
        project.cost = newCost

        //update project
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers : {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            //Exibir os serviços  
            setShowServiceForm(false)//Assim ele fecha a área de formulário
            //Ja vai aparecer o cost no console log, ou seja, a soma dos serviços
            setMessage('Serviço adicionado com sucesso!')
            setType('sucess')
        })
            .catch(err => console.log(err))
    }


    function removeService(id,cost){
        
        const servicesUpdated = project.services.filter (
            (service) => service.id !== id //Só vai ficar os serviços que tem o id diferente do id do removido
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost) //Fazendo a operação do custo do serviço e do projeto
    
        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH', //Pq está fazendo uma atualização parcial
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
            setType('sucess')
        })
            .catch(err => console.log(err))
    }


    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)//Negativo do showProjectForm
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)//Negativo do showProjectForm
    }

    return (
        <>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type = {type} msg={message}/>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? ' Editar Projeto' : 'Fechar' //se não tiver um showProjectForm sendo exibibo aparecerá Editar projeto, se não será fechar
                            } 
                           
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name} 
                                </p>
                                <p>
                                    <span>Total do orçamento:</span> R$ {project.budget} 
                                </p>
                                <p>
                                    <span>Total Utilizado:</span> R$ {project.cost} 
                                </p>
                            </div>
                        ):(
                            <div className={styles.project_info}>
                                <ProjectForm 
                                    handleSubmit={editPost}
                                    btnText="Concluir edição" 
                                    projectData={project}   
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && 
                                <ServiceForm 
                                    handleSubmit={createService}
                                    btnText = "Adicionar Serviços"
                                    projectData={project}
                                />
                            }
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 && //se existe serviços
                            services.map((service) => (
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                />
                            ))
                        }
                        {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                    </Container>
                </Container>
            </div>
        ): ( //Se o projeto não vier, terá o Loading
            <Loading/>
        )}
        </>
    )
}
export default Project
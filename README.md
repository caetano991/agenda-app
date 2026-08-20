📅 Agenda App

Aplicação web para gerenciamento de tarefas, desenvolvida com Java + Spring Boot no back-end e HTML, CSS e JavaScript puro no front-end.

O projeto permite criar, visualizar, editar, excluir e atualizar o status de tarefas, além de contar com filtros por status, categoria, prioridade e uma busca por título.

🚀 Funcionalidades
✅ Criar novas tarefas
✏️ Editar tarefas existentes
🗑️ Excluir tarefas
🔄 Alterar o status da tarefa
🔎 Buscar tarefas pelo título
🏷️ Filtrar por categoria
📌 Filtrar por prioridade
📊 Filtrar por status
📅 Definir data de vencimento
⚠️ Identificar tarefas atrasadas
💾 Persistência dos dados utilizando banco H2 em memória
🌐 API REST para comunicação entre front-end e back-end
📱 Interface web responsiva
Status disponíveis
A fazer
Em andamento
Concluído
Prioridades disponíveis
Alta
Média
Baixa
Categorias disponíveis
Trabalho
Pessoal
Saúde
Finanças
Outro
🛠️ Tecnologias utilizadas
Back-end
Java 17
Spring Boot 3.2.4
Spring Web
Spring Data JPA
Spring Validation
Lombok
Maven
Banco de dados
H2 Database
Front-end
HTML5
CSS3
JavaScript
Fetch API
🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em API REST, onde o JavaScript do navegador se comunica com o back-end através de requisições HTTP.

┌──────────────────────────────┐
│          Front-end           │
│                              │
│     HTML + CSS + JavaScript  │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│          Spring Boot         │
│                              │
│      TarefaController        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Spring Data JPA        │
│                              │
│       TarefaRepository       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         H2 Database          │
│                              │
│           tarefas            │
└──────────────────────────────┘
📂 Estrutura do projeto
agenda-app/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── agenda/
│       │           └── app/
│       │               ├── AgendaApplication.java
│       │               │
│       │               ├── controller/
│       │               │   └── TarefaController.java
│       │               │
│       │               ├── model/
│       │               │   ├── Tarefa.java
│       │               │   ├── Prioridade.java
│       │               │   └── Status.java
│       │               │
│       │               └── repository/
│       │                   └── TarefaRepository.java
│       │
│       └── resources/
│           ├── application.properties
│           │
│           └── static/
│               ├── index.html
│               │
│               ├── css/
│               │   └── style.css
│               │
│               └── js/
│                   └── app.js
│
├── pom.xml
└── README.md
📋 Modelo de tarefa

Cada tarefa possui os seguintes campos:

Campo	Tipo	Descrição
id	Long	Identificador único
titulo	String	Título da tarefa
descricao	String	Descrição da tarefa
categoria	String	Categoria da tarefa
prioridade	Enum	Prioridade da tarefa
vencimento	LocalDate	Data de vencimento
status	Enum	Status atual da tarefa

O título é obrigatório e a descrição possui limite de 500 caracteres.

🔌 API REST

A API está disponível através do endereço:

http://localhost:8080/api/tarefas
Listar todas as tarefas
GET /api/tarefas

Retorna todas as tarefas cadastradas.

Buscar uma tarefa
GET /api/tarefas/{id}

Exemplo:

GET /api/tarefas/1
Criar uma tarefa
POST /api/tarefas
Content-Type: application/json

Exemplo de corpo:

{
  "titulo": "Estudar Java",
  "descricao": "Revisar Spring Boot e JPA",
  "categoria": "Trabalho",
  "prioridade": "ALTA",
  "vencimento": "2026-08-25",
  "status": "A_FAZER"
}
Atualizar uma tarefa
PUT /api/tarefas/{id}
Content-Type: application/json

Exemplo:

PUT /api/tarefas/1
{
  "titulo": "Estudar Spring Boot",
  "descricao": "Revisar Spring Data JPA",
  "categoria": "Trabalho",
  "prioridade": "MEDIA",
  "vencimento": "2026-08-28",
  "status": "EM_ANDAMENTO"
}
Excluir uma tarefa
DELETE /api/tarefas/{id}

Exemplo:

DELETE /api/tarefas/1
💾 Banco de dados

Durante o desenvolvimento, o projeto utiliza o H2 Database em memória.

Configuração atual:

spring.datasource.url=jdbc:h2:mem:agendadb
spring.datasource.username=sa
spring.datasource.password=

Acesse o console do H2 através de:

http://localhost:8080/h2-console
Dados para conexão
JDBC URL: jdbc:h2:mem:agendadb
User Name: sa
Password:

⚠️ Como o banco está configurado como mem, os dados são perdidos quando a aplicação é encerrada.

⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

Java 17 ou superior
Maven 3.8+
Git (opcional)

Verifique as versões:

java -version
mvn -version
▶️ Como executar
1. Clone o repositório
git clone URL_DO_REPOSITORIO

Entre na pasta:

cd agenda-app
2. Execute a aplicação

Utilizando Maven:

mvn spring-boot:run

Ou compile o projeto:

mvn clean package

E execute o .jar gerado:

java -jar target/agenda-app-0.0.1-SNAPSHOT.jar
3. Acesse a aplicação

Após iniciar o Spring Boot, abra:

http://localhost:8080

A interface da Agenda será carregada automaticamente.

🔄 Funcionamento

O front-end utiliza a Fetch API para se comunicar com o back-end.

Exemplo:

const resposta = await fetch("/api/tarefas");
const tarefas = await resposta.json();

Para criar ou editar tarefas, o JavaScript envia os dados em formato JSON para a API.

Usuário
   │
   ▼
Interface da Agenda
   │
   ▼
JavaScript / Fetch API
   │
   ▼
TarefaController
   │
   ▼
TarefaRepository
   │
   ▼
H2 Database
🖥️ Interface

A aplicação possui uma interface dividida em:

Menu lateral: filtros de status e categoria
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/40be7d22-d01a-4724-8531-ce650f5af42b" />


Cabeçalho: busca e filtro de prioridade
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/b78e5f80-fc18-447a-b275-53d962ef0f04" />


Tabela: visualização das tarefas
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/ac7df129-8217-4507-82c6-17ffdd943a91" />


Modal: criação e edição de tarefas
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/4debba85-75bf-4889-9826-5c08efe40004" />
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/6bca3642-f401-4c84-a9dd-3c82c75eb801" />



O status de uma tarefa também pode ser alterado diretamente pela interface.

O ciclo de status é:

A FAZER
   ↓
EM ANDAMENTO
   ↓
CONCLUÍDO
   ↓
A FAZER
🔐 Validação

O back-end utiliza o Spring Validation para validar os dados recebidos pela API.

O título da tarefa, por exemplo, é obrigatório:

@NotBlank(message = "O titulo e obrigatorio")
private String titulo;

Além disso, a descrição possui limite de 500 caracteres:

@Column(length = 500)
private String descricao;
🗺️ Próximas melhorias

Algumas funcionalidades que podem ser adicionadas futuramente:

Persistência utilizando MySQL ou PostgreSQL

Sistema de autenticação e login

Cadastro de usuários

Tarefas associadas a usuários

Paginação da lista de tarefas

Ordenação por prioridade e vencimento

Notificações de tarefas próximas do vencimento

Dashboard com estatísticas

Testes unitários e de integração

Dockerização da aplicação

Deploy em ambiente de produção

👨‍💻 Autor

Desenvolvido por Miguel Caetano, como projeto pessoal utilizando Java, Spring Boot, JPA e JavaScript.

📄 Licença

Este projeto foi desenvolvido para fins educacionais.

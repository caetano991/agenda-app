# Agenda — Spring Boot + HTML/CSS/JS puro

## Como rodar
```bash
mvn spring-boot:run
```
Depois acesse http://localhost:8080 — o próprio Spring Boot já serve o `index.html`.

Console do banco H2 (para ver as tabelas/dados): http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:agendadb`
- User: `sa` / Password: (em branco)

## Endpoints da API
| Método | Rota                | Ação                     |
|--------|----------------------|--------------------------|
| GET    | /api/tarefas         | lista todas              |
| GET    | /api/tarefas/{id}    | busca uma                |
| POST   | /api/tarefas         | cria                     |
| PUT    | /api/tarefas/{id}    | atualiza                 |
| DELETE | /api/tarefas/{id}    | exclui                   |

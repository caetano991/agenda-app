package com.agenda.app.controller;

import com.agenda.app.model.Tarefa;
import com.agenda.app.repository.TarefaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController = cada metodo devolve JSON direto no corpo da resposta (nao devolve uma view/HTML)
// Essa e a ponte real entre back-end e front-end: o JS do navegador vai chamar essas rotas com fetch()
@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {

    private final TarefaRepository repository;

    public TarefaController(TarefaRepository repository) {
        this.repository = repository;
    }

    // GET /api/tarefas -> lista todas
    @GetMapping
    public List<Tarefa> listar() {
        return repository.findAll();
    }

    // GET /api/tarefas/5 -> busca uma especifica
    @GetMapping("/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/tarefas -> cria uma nova (o corpo da requisicao vira um objeto Tarefa automaticamente)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tarefa criar(@Valid @RequestBody Tarefa tarefa) {
        tarefa.setId(null); // garante que e uma criacao, nao uma edicao por engano
        return repository.save(tarefa);
    }

    // PUT /api/tarefas/5 -> atualiza uma tarefa existente
    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @Valid @RequestBody Tarefa dados) {
        return repository.findById(id)
                .map(tarefaExistente -> {
                    dados.setId(tarefaExistente.getId());
                    return ResponseEntity.ok(repository.save(dados));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/tarefas/5 -> remove
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

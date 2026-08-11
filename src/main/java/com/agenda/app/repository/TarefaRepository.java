package com.agenda.app.repository;

import com.agenda.app.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

// So de estender JpaRepository voce ja ganha findAll, findById, save, deleteById etc.
// O Spring implementa essa interface sozinho em tempo de execucao.
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
}

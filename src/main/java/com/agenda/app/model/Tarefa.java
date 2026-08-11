package com.agenda.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "tarefas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O titulo e obrigatorio")
    private String titulo;

    @Column(length = 500)
    private String descricao;

    private String categoria; // Trabalho, Pessoal, Saude, Financas, Outro

    @Enumerated(EnumType.STRING)
    private Prioridade prioridade;

    private LocalDate vencimento;

    @Enumerated(EnumType.STRING)
    private Status status;
}

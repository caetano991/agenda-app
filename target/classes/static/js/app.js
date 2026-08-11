// ============================================================
// app.js
// Isso aqui é a "ponte real" entre o front e o back:
// o navegador chama fetch() nas rotas expostas pelo TarefaController
// (http://localhost:8080/api/tarefas), que devolvem JSON.
// Como o back e o front rodam na MESMA origem (o Spring serve
// esse HTML/CSS/JS direto de resources/static), não existe
// problema de CORS: é tudo "localhost:8080" para o navegador.
// ============================================================

const API_URL = "/api/tarefas";

let tarefas = [];
let filtro = {
    status: "TODAS",
    categoria: "Todas",
    prioridade: "TODAS",
    busca: ""
};

const els = {
    tabela: document.getElementById("tabelaTarefas"),
    vazio: document.getElementById("vazio"),
    resumo: document.getElementById("resumo"),
    busca: document.getElementById("busca"),
    filtroPrioridade: document.getElementById("filtroPrioridade"),
    modal: document.getElementById("modal"),
    modalTitulo: document.getElementById("modalTitulo"),
    form: document.getElementById("formTarefa"),
};

const LABEL_STATUS = { A_FAZER: "A fazer", EM_ANDAMENTO: "Em andamento", CONCLUIDO: "Concluído" };
const LABEL_PRIORIDADE = { ALTA: "Alta", MEDIA: "Média", BAIXA: "Baixa" };

// ---------- Chamadas à API ----------

async function carregarTarefas() {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error("Falha ao carregar tarefas");
    tarefas = await resposta.json();
    renderizar();
}

async function salvarTarefa(tarefa) {
    const isEdicao = !!tarefa.id;
    const url = isEdicao ? `${API_URL}/${tarefa.id}` : API_URL;
    const metodo = isEdicao ? "PUT" : "POST";

    const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefa),
    });

    if (!resposta.ok) throw new Error("Falha ao salvar tarefa");
    await carregarTarefas();
}

async function excluirTarefa(id) {
    const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Falha ao excluir tarefa");
    await carregarTarefas();
}

// Clique na bolinha faz a tarefa "andar" pelo ciclo de status:
// A_FAZER -> EM_ANDAMENTO -> CONCLUIDO -> A_FAZER (e assim por diante)
const PROXIMO_STATUS = {
    A_FAZER: "EM_ANDAMENTO",
    EM_ANDAMENTO: "CONCLUIDO",
    CONCLUIDO: "A_FAZER",
};

async function avancarStatus(tarefa) {
    const atualizada = { ...tarefa, status: PROXIMO_STATUS[tarefa.status] ?? "A_FAZER" };
    await salvarTarefa(atualizada);
}

// ---------- Renderização ----------

function tarefasFiltradas() {
    return tarefas.filter((t) => {
        if (filtro.status !== "TODAS" && t.status !== filtro.status) return false;
        if (filtro.categoria !== "Todas" && t.categoria !== filtro.categoria) return false;
        if (filtro.prioridade !== "TODAS" && t.prioridade !== filtro.prioridade) return false;
        if (filtro.busca && !t.titulo.toLowerCase().includes(filtro.busca.toLowerCase())) return false;
        return true;
    });
}

function classeDaBolinha(status) {
    if (status === "CONCLUIDO") return "is-done";
    if (status === "EM_ANDAMENTO") return "is-progress";
    return "";
}

function estaAtrasada(tarefa) {
    if (!tarefa.vencimento || tarefa.status === "CONCLUIDO") return false;
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    return new Date(tarefa.vencimento) < hoje;
}

function formatarData(iso) {
    if (!iso) return "-";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

function renderizar() {
    atualizarContadores();

    const lista = tarefasFiltradas();
    els.tabela.innerHTML = "";
    els.vazio.hidden = lista.length !== 0;

    for (const t of lista) {
        const linha = document.createElement("tr");
        linha.className = t.status === "CONCLUIDO" ? "tarefa--concluida" : "";

        linha.innerHTML = `
            <td><button class="check ${classeDaBolinha(t.status)}" data-acao="toggle" data-id="${t.id}">
                ${t.status === "CONCLUIDO" ? "✓" : ""}
            </button></td>
            <td>
                <div class="tarefa__titulo">${escapeHtml(t.titulo)}</div>
                ${t.descricao ? `<div class="tarefa__desc">${escapeHtml(t.descricao)}</div>` : ""}
            </td>
            <td>${escapeHtml(t.categoria ?? "-")}</td>
            <td><span class="prioridade"><span class="dot dot--${t.prioridade}"></span>${LABEL_PRIORIDADE[t.prioridade] ?? "-"}</span></td>
            <td class="vencimento ${estaAtrasada(t) ? "atrasado" : ""}">${formatarData(t.vencimento)}</td>
            <td><span class="status-pill status-pill--${t.status}">${LABEL_STATUS[t.status]}</span></td>
            <td class="acoes">
                <button class="acao-btn" data-acao="editar" data-id="${t.id}" aria-label="Editar">✎</button>
                <button class="acao-btn acao-btn--excluir" data-acao="excluir" data-id="${t.id}" aria-label="Excluir">🗑</button>
            </td>
        `;
        els.tabela.appendChild(linha);
    }
}

function atualizarContadores() {
    document.getElementById("cont-TODAS").textContent = tarefas.length;
    document.getElementById("cont-A_FAZER").textContent = tarefas.filter(t => t.status === "A_FAZER").length;
    document.getElementById("cont-EM_ANDAMENTO").textContent = tarefas.filter(t => t.status === "EM_ANDAMENTO").length;
    document.getElementById("cont-CONCLUIDO").textContent = tarefas.filter(t => t.status === "CONCLUIDO").length;

    const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    els.resumo.textContent = `${tarefas.length} tarefas · ${hoje}`;
}

function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

// ---------- Modal (criar/editar) ----------

function abrirModal(tarefa = null) {
    els.form.reset();
    document.getElementById("tarefaId").value = tarefa?.id ?? "";
    els.modalTitulo.textContent = tarefa ? "Editar tarefa" : "Nova tarefa";
    document.getElementById("campoTitulo").value = tarefa?.titulo ?? "";
    document.getElementById("campoDescricao").value = tarefa?.descricao ?? "";
    document.getElementById("campoCategoria").value = tarefa?.categoria ?? "Trabalho";
    document.getElementById("campoPrioridade").value = tarefa?.prioridade ?? "MEDIA";
    document.getElementById("campoVencimento").value = tarefa?.vencimento ?? "";
    document.getElementById("campoStatus").value = tarefa?.status ?? "A_FAZER";
    els.modal.hidden = false;
}

function fecharModal() {
    els.modal.hidden = true;
}

els.form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const tarefa = {
        id: document.getElementById("tarefaId").value || null,
        titulo: document.getElementById("campoTitulo").value.trim(),
        descricao: document.getElementById("campoDescricao").value.trim(),
        categoria: document.getElementById("campoCategoria").value,
        prioridade: document.getElementById("campoPrioridade").value,
        vencimento: document.getElementById("campoVencimento").value || null,
        status: document.getElementById("campoStatus").value,
    };
    await salvarTarefa(tarefa);
    fecharModal();
});

document.getElementById("btnNovaTarefa").addEventListener("click", () => abrirModal());
document.getElementById("btnCancelar").addEventListener("click", fecharModal);

// ---------- Ações na tabela (delegação de eventos) ----------

els.tabela.addEventListener("click", async (evento) => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (botao.dataset.acao === "editar") abrirModal(tarefa);
    if (botao.dataset.acao === "excluir") {
        if (confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) await excluirTarefa(id);
    }
    if (botao.dataset.acao === "toggle") await avancarStatus(tarefa);
});

// ---------- Filtros da sidebar e do cabeçalho ----------

document.querySelectorAll(".sidebar__nav").forEach((nav) => {
    nav.addEventListener("click", (evento) => {
        const item = evento.target.closest(".sidebar__item");
        if (!item) return;

        nav.querySelectorAll(".sidebar__item").forEach(i => i.classList.remove("is-active"));
        item.classList.add("is-active");

        const tipo = nav.dataset.tipo; // "status" ou "categoria"
        filtro[tipo] = item.dataset.valor;
        renderizar();
    });
});

els.busca.addEventListener("input", (evento) => {
    filtro.busca = evento.target.value;
    renderizar();
});

els.filtroPrioridade.addEventListener("change", (evento) => {
    filtro.prioridade = evento.target.value;
    renderizar();
});

// ---------- Início ----------
carregarTarefas().catch((erro) => {
    console.error(erro);
    els.resumo.textContent = "Erro ao carregar tarefas. O back-end está rodando?";
});

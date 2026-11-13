//1) pega os elementos da tela

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const erro = document.getElementById("erro");

//2) buscar os livros na API e mostrar na tela

async function carregarLivros() {
    const resposta = await fetch("/livros");
    const livros = await resposta.json();

    lista.innerHTML = "";

    livros.forEach((livro) => {
        const item = document.createElement("li");

        item.innerHTML = `
            <span>${livro.titulo} - ${livro.autor} (${livro.ano || "Ano não informado"}) | Editora: ${livro.editora || "-"} | Páginas: ${livro.paginas || 0}</span>
            <button class="del" data-id="${livro.id}">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

//3) Cadastra um livro

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    erro.textContent = "";

    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano = document.getElementById("ano").value.trim();
    const editora = document.getElementById("editora").value.trim();
    const paginas = Number(document.getElementById("paginas").value);

    if (!titulo || !autor || !editora || !Number.isFinite(paginas) || paginas <= 0) {
        erro.textContent = "Informe título, autor, editora e páginas válidas.";
        return;
    }

    const dados = {
        titulo,
        autor,
        ano,
        editora,
        paginas,
    };

    const resposta = await fetch("/livros", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados),
    });

    const info = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        erro.textContent = info.erro || "Não foi possível cadastrar o livro.";
        return;
    }

    form.reset();
    await carregarLivros();
});

//5) apaga um livro (delete)

lista.addEventListener("click", async (evento) => {
    if (!evento.target.dataset.id) return;

    await fetch(`/livros/${evento.target.dataset.id}`, { method: "DELETE" });

    carregarLivros();
});

carregarLivros();